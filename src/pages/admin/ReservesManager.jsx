import { useState, useEffect, useContext } from "react";
import { Calendar } from 'primereact/calendar';
import supabase from "../../utils/supabase";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { NavBar } from "../../components/atoms/NavBar";

const STATES = ['En eval.', 'Aceptada', 'Rechazada', 'Vencida', 'Finalizada'];

const stateMapFullToShort = {
  'En evaluación': 'En eval.',
  'Aceptada': 'Aceptada',
  'Rechazada': 'Rechazada',
  'Vencida': 'Vencida',
  'Finalizada': 'Finalizada'
};

const stateBadges = {
  'En eval.': 'bg-yellow-400 text-black px-2 py-1 rounded-full font-semibold text-sm',
  'Aceptada': 'bg-green-600 text-white px-2 py-1 rounded-full font-semibold text-sm',
  'Rechazada': 'bg-orange-700 text-white px-2 py-1 rounded-full font-semibold text-sm',
  'Vencida': 'bg-red-600 text-white px-2 py-1 rounded-full font-semibold text-sm',
  'Finalizada': 'bg-gray-400 text-white px-2 py-1 rounded-full font-semibold text-sm',
};

const isExpired = (reserva) => {
  if (reserva.state !== 'Aceptada') return false;
  const now = new Date();
  const startDate = new Date(reserva.start_date);
  const diffHours = (now - startDate) / (1000 * 60 * 60);
  return diffHours > 48 && !reserva.check_in;
};

export const MyReserves = () => {
  const { auth } = useContext(AuthContext)
  const [tempDates, setTempDates] = useState(null); // selección calendario
  const [dates, setDates] = useState(null); // fechas aplicadas filtro
  const [selectedState, setSelectedState] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleApplyFilter = () => {
    setDates(tempDates);
  };

  const handleClearDates = () => {
    setTempDates(null);
    setDates(null);
  };

  const setThisWeek = () => {
    const today = new Date();
    const day = today.getDay(); // Domingo=0, Lunes=1, ..., Sábado=6
    const diffToMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    setTempDates([monday, sunday]);
  };

  useEffect(() => {
    const getReserves = async () => {
      const { data, error } = await supabase
        .from('reserve')
        .select(`
          *,
          reservation_detail (
            id_room,
            room (
              *,
              type_room (
                price_day, type
              )
            )
          )
        `)
        .eq('code_guest', auth.user_info.code)

      if (error) {
        console.error('Error fetching reserves:', error)
        throw new Error('Algo malo ha ocurrido...')
      }

      const daysFormatter = (ms) => {
        const days = ms / (1000 * 60 * 60 * 24)
        return days
      }

      let reserves = []
      for (let r of data) {
        const ed = new Date(r.end_date)
        const sd = new Date(r.start_date)

        reserves.push({
          ...r,
          invoice: {
            total_price: r.reservation_detail[0].room.type_room.price_day * daysFormatter(ed - sd)
          }
        })
      }

      console.log('Mis reservas completas con precios:', reserves)
      setReservas(reserves)
    }


    toast.promise(getReserves(), {
      loading: 'Cargando reservas...',
      success: 'Reservas cargadas correctamene',
      error: err => err.message
    })
  }, [])

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      let filtered = reservas.filter(reserva => {
        // Filtro por fechas aplicadas
        if (dates && dates.length === 2) {
          const start = new Date(dates[0]);
          const end = new Date(dates[1]);
          const resStart = new Date(reserva.start_date);
          const resEnd = new Date(reserva.end_date);
          if (resEnd < start || resStart > end) return false;
        }

        const estadoRealFull = isExpired(reserva) ? 'Vencida' : reserva.state;
        if (!selectedState) return true;
        return estadoRealFull === selectedState;
      });

      setReservas(filtered);
    } catch (e) {
      setError('Error filtrando reservas.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [dates, selectedState]);

  const handleCancelReservation = (idReserve, startDate, checkIn) => {

    const cancelPromise = async () => {
      const now = new Date();
      const start = new Date(startDate);
      const diffHours = (start - now) / (1000 * 60 * 60);
      if (diffHours < 48 || checkIn) {
        throw new Error("No puedes cancelar la reserva en menos de 48 horas o si ya hiciste check-in.")
      }

      const { error } = await supabase.from('reserve').update({
        state: 'Rechazada'
      }).eq('id_reserve', idReserve)

      if (error) throw new Error('Error al cancelar la reserva')

      return (`Reserva ${idReserve} cancelada correctamente`);
    }

    toast.promise(cancelPromise(), {
      loading: 'Cancelando...',
      success: d => d,
      error: (err) => err.message
    })
  };

  return (
    <>
      <main className="flex flex-col items-center justify-start w-full min-h-screen bg-white p-5 md:p-10 min-w-[450px] space-y-5">
        <NavBar />
        <div className="p-4 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Mis Reservas</h1>

          {/* <div className="flex flex-wrap justify-between mb-6 gap-4 items-center">
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              <Calendar
                value={tempDates}
                onChange={(e) => setTempDates(e.value)}
                selectionMode="range"
                readOnlyInput
                placeholder="Rango de fechas"
                className="w-64"
                maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
                showIcon
              />

              <button
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
                onClick={handleClearDates}
              >
                Borrar selección
              </button>

              <button
                className="bg-orange-400 hover:bg-orange-400 text-white font-semibold py-2 px-6 rounded"
                onClick={setThisWeek}
              >
                Esta semana
              </button>

              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded"
                onClick={handleApplyFilter}
                disabled={!tempDates || tempDates.length !== 2}
              >
                Buscar
              </button>
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <button
                key="all"
                className={`px-4 py-1 rounded-full font-semibold ${!selectedState ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600'
                  }`}
                onClick={() => setSelectedState(null)}
              >
                Todos
              </button>
              {STATES.map(state => (
                <button
                  key={state}
                  className={`px-4 py-1 rounded-full font-semibold ${selectedState === state ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600'
                    }`}
                  onClick={() => setSelectedState(state)}
                >
                  {state}
                </button>
              ))}
            </div>
          </div> */}

          {!loading && !error && reservas.length === 0 && (
            <p className="text-center w-full mt-8 text-lg font-semibold">
              No hay reservas que coincidan con los filtros.
            </p>
          )}

          <div className="space-y-4">
            {reservas.map(reserva => {
              const estadoRealFull = isExpired(reserva) ? 'Vencida' : reserva.state;
              const estadoReal = stateMapFullToShort[estadoRealFull] || estadoRealFull;

              const startDateObj = new Date(reserva.start_date);
              const now = new Date();
              const diffHours = (startDateObj - now) / (1000 * 60 * 60);
              const canCancel = estadoRealFull === 'Aceptada' || estadoRealFull === 'En evaluación' && diffHours > 48 && !reserva.check_in;

              return (
                <div
                  key={reserva.id_reserve}
                  className="border rounded-lg p-6 flex justify-between items-center bg-white shadow"
                >
                  <div>
                    <p className="text-gray-600 font-semibold mb-2 flex items-center gap-3">
                      <span>{new Date(reserva.start_date).toLocaleDateString()} → {new Date(reserva.end_date).toLocaleDateString()}</span>
                      <span className={stateBadges[estadoReal]}>{estadoReal}</span>
                    </p>
                    <p className="text-lg font-bold mb-1">N° {reserva.id_reserve.toString().padStart(3, '0')}</p>

                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Habitaciones</h4>
                      <table className="w-full text-left table-fixed">
                        <thead>
                          <tr>
                            <th className="w-1/3">Habitación</th>
                            <th className="w-1/3">Tipo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reserva.reservation_detail?.map(detail => (
                            <tr key={detail.id_room}>
                              <td className="py-1">{detail.id_room}</td>
                              <td className="py-1">{detail.room?.type_room?.type || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <p className="text-xl font-semibold">Total a pagar</p>
                    <p className="text-3xl font-bold">${reserva.invoice?.total_price.toLocaleString()}</p>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelReservation(reserva.id_reserve, reserva.start_date, reserva.check_in)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded mt-4 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}

                    {estadoRealFull === 'Vencida' && (
                      <p className="mt-4 text-red-600 font-semibold">Por favor, comunícate para procesar el pago.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};
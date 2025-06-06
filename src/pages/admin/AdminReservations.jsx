import React, { useEffect, useState } from 'react';
import supabase from '../../utils/supabase';
import { Calendar } from 'primereact/calendar';
import { InvoceTemplate } from '../../components/molecules/InvoceTemplate';
import { toast, Toaster } from 'sonner';
import { NavBar } from '../../components/atoms/NavBar';

const STATES = ['En evaluación', 'Aceptada', 'Rechazada', 'Vencida', 'Finalizada'];

const stateBadges = {
  'En evaluación': 'bg-yellow-400 text-black px-2 py-1 rounded-full font-semibold text-sm',
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

export const AdminReservations = () => {
  const [reservas, setReservas] = useState([]);
  const [dates, setDates] = useState(null);
  const [tempDates, setTempDates] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para marcar las reservas a las que se les generó factura exitosamente
  const [facturasGeneradas, setFacturasGeneradas] = useState({});

  // Actualiza localmente las reservas tras acciones para reflejar cambios UI inmediato
  const updateReservaLocalState = (id, updates) => {
    setReservas((prev) =>
      prev.map((r) => (r.id_reserve === id ? { ...r, ...updates } : r))
    );
  };

  // Trae reservas con filtros de fecha y estado
  async function fetchReservations() {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('view_reservas_completas').select('*');

      if (dates && dates.length === 2) {
        query = query
          .gte('start_date', dates[0].toISOString().split('T')[0])
          .lte('end_date', dates[1].toISOString().split('T')[0]);
      }

      if (selectedState && selectedState !== 'Vencida') {
        query = query.eq('state', selectedState);
      }

      const { data, error } = await query;
      if (error) throw error;

      let filtered = data;
      if (selectedState === 'Vencida') {
        filtered = data.filter(isExpired);
      }

      setReservas(filtered || []);
    } catch (e) {
      setError('Error cargando reservas');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Actualiza el estado de una reserva (excepto en Generar Factura modo Vencida)
  async function updateReserveState(id_reserve, newState) {
    const { data, error } = await supabase
      .from('reserve')
      .update({ state: newState })
      .eq('id_reserve', id_reserve);

    if (error) {
      toast.error(`Error actualizando estado de reserva ${id_reserve}`, { duration: 4000 });
      console.error('Error actualizando estado de reserva:', error);
      return null;
    }
    return data;
  }

  // Manejadores de acciones
  const handleAccept = async (id) => {
    const res = await updateReserveState(id, 'Aceptada');
    if (res) {
      toast.success(`Reserva ${id} aceptada`, { duration: 3000 });
      updateReservaLocalState(id, { state: 'Aceptada' });
    }
  };

  const handleReject = async (id) => {
    const res = await updateReserveState(id, 'Rechazada');
    if (res) {
      toast('Reserva rechazada', { description: `Reserva ${id} rechazada`, duration: 3000 });
      updateReservaLocalState(id, { state: 'Rechazada' });
    }
  };

  const handleCheckIn = async (id, reserva) => {
    const now = new Date();
    const startDate = new Date(reserva.start_date);
    const diffHours = (startDate - now) / (1000 * 60 * 60);

    if (diffHours > 24) {
      toast('Check-in solo permitido 24 horas antes', { variant: 'warning', duration: 3000 });
      return;
    }

    const { error } = await supabase
      .from('reserve')
      .update({ check_in: true })
      .eq('id_reserve', id);

    if (error) {
      toast.error('Error al hacer Check In', { duration: 3000 });
      console.error(error);
      return;
    }
    toast.success('Check In realizado', { duration: 3000 });
    updateReservaLocalState(id, { check_in: true });
  };

  // Al hacer Check Out
  const handleCheckOut = async (reserva) => {
    try {
      // 1. Actualizar estado y check_out en reserve
      const { error: updateError } = await supabase
        .from('reserve')
        .update({ check_out: true, state: 'Finalizada' })
        .eq('id_reserve', reserva.id_reserve);

      if (updateError) {
        toast.error('Error al hacer Check Out', { duration: 4000 });
        console.error(updateError);
        return;
      }

      // 2. Insertar factura en invoice
      const { error: insertError } = await supabase
        .from('invoice')
        .insert({
          id_reserve: reserva.id_reserve,
          total_price: reserva.total_price,
        });

      if (insertError) {
        toast.error('Error al crear la factura', { duration: 4000 });
        console.error(insertError);
        return;
      }

      // 3. Marcar factura generada y actualizar UI
      setFacturasGeneradas((prev) => ({ ...prev, [reserva.id_reserve]: true }));
      toast.success('Check Out realizado y factura generada', { duration: 4000 });
      updateReservaLocalState(reserva.id_reserve, { check_out: true, state: 'Finalizada' });

      // 4. Generar PDF
      InvoceTemplate(reserva);
    } catch (e) {
      toast.error('Error inesperado al hacer Check Out', { duration: 4000 });
      console.error(e);
    }
  };

  // Generar factura pero sin cambiar estado (solo para reservas vencidas)
  const handleGenerateInvoiceVencida = async (reserva) => {
    try {
      // Insertar factura sin cambiar estado
      const { error: insertError } = await supabase
        .from('invoice')
        .insert({
          id_reserve: reserva.id_reserve,
          total_price: reserva.total_price,
        });

      if (insertError) {
        toast.error('Error al crear la factura', { duration: 4000 });
        console.error(insertError);
        return;
      }

      setFacturasGeneradas((prev) => ({ ...prev, [reserva.id_reserve]: true }));
      toast.success('Factura generada con éxito', { duration: 4000 });

      InvoceTemplate(reserva);
    } catch (e) {
      toast.error('Error inesperado al generar factura', { duration: 4000 });
      console.error(e);
    }
  };

  const setThisWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    setTempDates([monday, sunday]);
    setDates([monday, sunday]);
  };

  const handleDateChange = (e) => {
    setTempDates(e.value);
    if (e.value?.length === 2) {
      setDates(e.value);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [dates, selectedState]);

  return (
    <main className="flex flex-col items-center justify-start w-full min-h-screen bg-white p-5 md:p-10 min-w-[450px] space-y-5">
        <NavBar />
    <div className="p-4 max-w-7xl mx-auto">
      <Toaster position="bottom-right" richColors />

      <h1 className="text-4xl font-bold mb-6">Manejo de Reservas</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <Calendar
          value={tempDates}
          onChange={handleDateChange}
          selectionMode="range"
          readOnlyInput
          placeholder="Rango de fechas"
          className="w-64"
          maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
          onClick={setThisWeek}
        >
          Esta semana
        </button>

        <button
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
          onClick={() => {
            setTempDates(null);
            setDates(null);
          }}
        >
          Borrar selección
        </button>

        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded"
          onClick={fetchReservations}
        >
          Buscar
        </button>

        <div className="ml-auto flex gap-2 flex-wrap">
          <button
            className={`px-4 py-1 rounded-full font-semibold ${!selectedState ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setSelectedState(null)}
          >
            Todos
          </button>
          {STATES.map((state) => (
            <button
              key={state}
              className={`px-4 py-1 rounded-full font-semibold ${selectedState === state ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600'}`}
              onClick={() => setSelectedState(state)}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {loading && <p>Cargando reservas...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && reservas.length === 0 && (
        <p className="text-center font-semibold mt-12 text-lg">No hay reservas que coincidan con los filtros.</p>
      )}

      <div className="space-y-6">
        {reservas.map((reserva) => {
          const estadoReal = isExpired(reserva) ? 'Vencida' : reserva.state;

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
                <p className="font-semibold mb-2">Cliente: {reserva.guest?.user?.name} {reserva.guest?.user?.last_name}</p>

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
                      {reserva.reservation_detail?.map((detail) => (
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
                <p className="text-3xl font-bold">${reserva.total_price.toLocaleString()}</p>

                {estadoReal === 'En evaluación' && (
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded"
                      onClick={() => handleAccept(reserva.id_reserve)}
                    >
                      Aceptar
                    </button>
                    <button
                      className="border border-yellow-400 text-yellow-400 font-semibold py-2 px-6 rounded hover:bg-yellow-400 hover:text-black cursor-pointer"
                      onClick={() => handleReject(reserva.id_reserve)}
                    >
                      Rechazar
                    </button>
                  </div>
                )}

                {estadoReal === 'Aceptada' && !reserva.check_in && (() => {
                  const now = new Date();
                  const startDate = new Date(reserva.start_date);
                  const diffHours = (startDate - now) / (1000 * 60 * 60);
                  if (diffHours <= 24 && diffHours >= 0) {
                    return (
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded"
                        onClick={() => handleCheckIn(reserva.id_reserve, reserva)}
                      >
                        Check In
                      </button>
                    );
                  }
                  return null;
                })()}

                {estadoReal === 'Aceptada' && reserva.check_in && !reserva.check_out && (
                  <button
                    className="bg-orange-700 hover:bg-orange-800 text-white font-semibold py-2 px-6 rounded"
                    onClick={() => handleCheckOut(reserva)}
                  >
                    Check Out
                  </button>
                )}

                {estadoReal === 'Vencida' && (
                  <>
                    <p className="mt-4 text-red-600 font-semibold">Por favor, comunícate para procesar el pago.</p>
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded mt-2"
                      onClick={() => handleGenerateInvoiceVencida(reserva)}
                      disabled={facturasGeneradas[reserva.id_reserve]}
                    >
                      Generar Factura
                    </button>
                    {facturasGeneradas[reserva.id_reserve] && (
                      <p className="mt-2 text-green-600 font-semibold">Factura generada con éxito</p>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </main>
  );
};







import { useState, useEffect, useContext } from "react";
import { availability, createReserve } from "../../controllers/Client";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";

export const InvoiceReservation = ({ selectedRooms, onConfirm, initialDates }) => {
  const [total, setTotal] = useState(0);
  const [listIdRooms, setListIdRooms] = useState([])
  const { auth } = useContext(AuthContext);
  const user = auth.user_info;
  console.log('usuario', user)

  useEffect(() => {
    const newTotal = selectedRooms
      .filter(room => room.quantity > 0)
      .reduce((acc, room) => acc + room.price * room.quantity, 0);
    setTotal(newTotal);
    listRooms()
  }, [selectedRooms]);

  const roomsToShow = selectedRooms.filter(room => room.quantity > 0);

  console.log('roommmmm', roomsToShow)

  const listRooms = async () => {
    if (roomsToShow.length > 0){
      let idRooms = []
      let rooms
      let roomId
      console.log('RoomsToShow', roomsToShow)
      for (let i = 0; i < roomsToShow.length; i++) {
        rooms = await availability(roomsToShow[i].type, startDate, endDate)
        roomId = rooms.idRooms.slice(0, roomsToShow[i].quantity)
        console.log('IDs', roomId)
        idRooms.push(...roomId)
      };
      console.log('IDROOMS', idRooms)
      setListIdRooms(idRooms)
    };
  };

  const formatDate = (date) => {
      const d = new Date(date);
      d.setHours(12, 0, 0, 0); // evitar desfase por zona horaria
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    const startDate = formatDate(initialDates[0]);
    const endDate = formatDate(initialDates[1]);
    console.log('codigo cliente', user.code)

    console.log(startDate)
    console.log(endDate)

  if (roomsToShow.length === 0) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-extrabold mb-4">Factura de Reserva</h2>
      <table className="w-full text-left mb-4 table-fixed text-sm">
        <thead>
          <tr>
            <th className="pb-3 w-1/3 font-semibold">Tipo</th>
            <th
              className="pb-3 w-1/6 text-right font-semibold"
              style={{ whiteSpace: 'nowrap', paddingRight: '0.75rem' }}
            >
              Cant.
            </th>
            <th className="pb-3 w-1/6 text-center font-semibold">Precio Unitario</th>
            <th className="pb-3 w-1/3 text-center font-semibold">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {roomsToShow.map(({ type, quantity, price }) => (
            <tr key={type} className="border-t">
              <td className="py-2">{type}</td>
              <td className="py-2 text-right" style={{ whiteSpace: 'nowrap', paddingRight: '0.75rem' }}>
                {quantity}
              </td>
              <td className="py-2 text-center">${price.toLocaleString()}</td>
              <td className="py-2 text-center">${(price * quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right font-extrabold text-xl mb-4" style={{ letterSpacing: '0.1em' }}>
        Total: ${total.toLocaleString()}
      </div>
      <button
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-md"
        onClick={ async () => {
            toast.promise(await createReserve(user.code, startDate, endDate, listIdRooms), {
            loading: 'Reservando...',
            success: 'Reserva realizada con exito',
            error: err => err.message
          });
            window.location.reload()
          }}
        disabled={roomsToShow.length === 0}
      >
        Confirmar Reserva
      </button>
    </div>
  );
};
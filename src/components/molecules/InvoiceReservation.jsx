import { useState, useEffect } from "react";

export const Invoice = ({ selectedRooms, onConfirm }) => {
  // selectedRooms: [{ type, price, quantity }, ...]
  
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = selectedRooms.reduce((acc, room) => acc + room.price * room.quantity, 0);
    setTotal(newTotal);
  }, [selectedRooms]);

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Factura de Reserva</h2>
      <table className="w-full text-left mb-4">
        <thead>
          <tr>
            <th className="pb-2">Tipo</th>
            <th className="pb-2">Cantidad</th>
            <th className="pb-2">Precio Unitario</th>
            <th className="pb-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {selectedRooms.map(({ type, quantity, price }) => (
            <tr key={type}>
              <td className="py-1">{type}</td>
              <td className="py-1">{quantity}</td>
              <td className="py-1">${price.toLocaleString()}</td>
              <td className="py-1">${(price * quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right font-bold text-lg mb-4">
        Total: ${total.toLocaleString()}
      </div>
      <button
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded"
        onClick={onConfirm}
        disabled={selectedRooms.every(room => room.quantity === 0)}
      >
        Confirmar Reserva
      </button>
    </div>
  );
};

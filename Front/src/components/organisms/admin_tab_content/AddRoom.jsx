import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";
import { toast } from "sonner";

export function AddRoom({ types }) {
  const [selectedType, setSelectedType] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (types.length > 0 && !selectedType) {
      setSelectedType(types[0].id);
    }
  }, [types, selectedType]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const addRoomPromise = async () => {
      if (!selectedType) {
        throw new Error('Selecciona un tipo de habitación')
      }

      if (!roomCode || roomCode.length < 5) {
        throw new Error('El código debe tener al menos 5 caracteres')
      }

      const formattedCode = roomCode.toUpperCase();

      const { data: existingRoom } = await supabase.from('room').select('*').eq(
        'id_room', formattedCode
      ).single()

      if (existingRoom) throw new Error('Ya existe una habitación con este código')

      const { error } = await supabase.from('room').insert({
        id_room: formattedCode,
        id_type: selectedType
      })

      if (error) {
        throw error
      }
    }

    toast.promise(addRoomPromise(), {
      loading: 'Agregando...',
      success: () => {
        setIsSubmitting(false)
        setRoomCode('')
        return 'Habitación agregada con exito'
      },
      error: (err) => {
        setIsSubmitting(false)
        return err.message
      }
    })

  };

  return (
    <form className="tab-form-r" onSubmit={handleAdd}>
      <article >
        <label >Tipo de Habitación</label>
        <select
          value={selectedType ?? ''}
          onChange={(e) => setSelectedType(Number(e.target.value))}
          disabled={isSubmitting}
          className="w-full p-2 border rounded"
          style={{ gridArea: 'type' }}
        >
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.type}
            </option>
          ))}
        </select>
      </article>

      <article >
        <label >Código de Habitación</label>
        <input
          type="text"
          placeholder="Ej: ST101"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          maxLength={6}
          disabled={isSubmitting}
          className="w-full p-2 border rounded"
          style={{ gridArea: 'code' }}
        />
        <p className="text-xs text-gray-500">Máx. 6 caracteres</p>
      </article>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-2 p-2 rounded text-white ${isSubmitting
          ? 'bg-blue-300 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
          }`}
        style={{ gridArea: 'send' }}
      >
        {isSubmitting ? 'Agregando...' : 'Agregar'}
      </button>
    </form>
  );
}
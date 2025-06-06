import { useState } from "react";
import supabase from "../../../utils/supabase";
import { toast } from "sonner";

export function DeleteRoom() {
  const [roomCode, setRoomCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleDelete = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const deleteRoomPromise = async () => {
      if (!roomCode || roomCode.length < 5) {
        throw new Error('El código debe tener al menos 5 caracteres')
      }

      const formattedCode = roomCode.toUpperCase();

      const { data: existingRoom } = await supabase.from('room').select('*').eq(
        'id_room', formattedCode
      ).single()

      if (!existingRoom) throw new Error('No existe una habitación con este código. Verifica o intenta con otro')

      const { error } = await supabase.from('room').delete().eq(
        'id_room', formattedCode
      )

      if (error) {
        throw error
      }
    }

    toast.promise(deleteRoomPromise(), {
      loading: 'Eliminando...',
      success: () => {
        setIsSubmitting(false)
        setRoomCode('')
        return 'Habitación eliminada con exito'
      },
      error: (err) => {
        setIsSubmitting(false)
        return err.message
      }
    })

  };

  return (
    <form className="tab-form-r" onSubmit={handleDelete}>
      <article style={{ gridArea: 'type' }}>
        <label>Tipo de habitación</label>
        <input
          type="text"
          placeholder="Standard - King - Queen"
          className="bg-[#EFEFEF]"
          disabled
        />
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
        {isSubmitting ? 'Eliminando...' : 'Eliminar'}
      </button>
    </form>
  );
}
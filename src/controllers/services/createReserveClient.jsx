import supabase from "../../utils/supabase";

export const createReserveWithRooms = async (codeGuest, startDate, endDate, listIdRooms) => {
    try {
        if (!codeGuest || !startDate || !endDate || !Array.isArray(listIdRooms)) {
            throw new Error("Faltan parámetros obligatorios o la lista de habitaciones está vacía.");
        }
        await supabase.rpc('create_reserve_with_rooms', {
            p_code_guest: codeGuest,
            p_start_date: startDate,
            p_end_date: endDate,
            p_rooms: listIdRooms
        });
    } catch (error) {
        console.error('Error fetching room types:', error);
    }
}
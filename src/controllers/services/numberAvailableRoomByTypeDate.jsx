import supabase from "../../utils/supabase";

export const numberAvailableRoomByTypeDate = async (typeR, startDate, endDate ) => {
    try{
        const { data, error } = await supabase.rpc('available_rooms_by_type_and_date', { tipo: typeR, f1: startDate, f2: endDate })
        if (error){
            return('Anything was founded', error)
        }
        return data
    } catch (error) {
        throw new Error('Servidor caído', error)
    }
}
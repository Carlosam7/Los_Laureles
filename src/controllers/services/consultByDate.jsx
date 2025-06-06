import supabase from "../../utils/supabase";

export const consultByDate = async (startDate, endDate ) => {
    try{
        const { data, error } = await supabase.rpc('consult_by_date', { s_date: startDate, e_date: endDate })
        if (error){
            return('Anything was founded', error)
        }
        return data
    } catch (error) {
        throw new Error('Servidor caído', error)
    }
}
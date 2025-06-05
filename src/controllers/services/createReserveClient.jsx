import supabase from "../../utils/supabase";

export const createReserve = async (codeGuest, startDate, endDate) => {
    try {

        const guests = await supabase.from('guest').select('code_guest')
        const codes = guests.data
        const code1 = codes[0]



        console.log(code1.code_guest)
        console.log(startDate)
        console.log(endDate)
        const { error } = await supabase.from('reserve').insert({ 
            code_guest: '6f1483a5-1ec0-4141-8a09-715a21028ac6', start_date: startDate, end_date: endDate })
        if (error) {
            console.log('error', error)
            return error;
        } else {
            console.log('sfksnkfsbkfb')
            return true;
        }

    } catch {
        console.error('Error fetching room types:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
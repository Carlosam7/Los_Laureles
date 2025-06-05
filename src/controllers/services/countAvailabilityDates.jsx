import supabase from '../../utils/supabase.js';

export const countAvailabilityDates = async (startDate, endDate ) => {
  try {
    const { data, error } = await supabase.rpc('consult_all_available_counts', {
      s_date: startDate,
      e_date: endDate
    });

    if (error) throw error;

    const availabilityMap = {};
    data.forEach(({ type, available_count }) => {
      availabilityMap[type] = available_count;
    });

    console.log("Resultado de countAvailabilityDates:", availabilityMap); // 🧪

    return availabilityMap; // ✅ NO envuelvas en { count: data }

  } catch (err) {
    console.error(err);
    return {}; // para evitar crashes en errores
  }
}

import supabase from '../../utils/supabase.js';

export const countAvailabilityDates = async (startDate, endDate) => {
  if (!startDate || !endDate) return {};

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

    return availabilityMap;

  } catch (err) {
    console.error('Error en countAvailabilityDates:', err);
    return {};
  }
}

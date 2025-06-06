import supabase from '../../utils/supabase.js';


// Convierte etiqueta rango a límites numéricos
const getPriceBounds = (range) => {
  switch(range) {
    case 'Rango1': return [200000, 400000];
    case 'Rango2': return [400000, 600000];
    case 'Rango3': return [600000, 800000];
    case 'Rango4': return [800000, 1000000];
    case 'Rango5': return [1000000, 1200000];
    case 'Rango6': return [1200000, 1400000];
    case 'Rango7': return [1400000, 1500000];
    default: return [0, Infinity];
  }
};
/**
 * Obtiene habitaciones filtradas y su disponibilidad entre fechas.
 * @param {Object} params
 * @param {string} params.startDate - Fecha inicio (obligatoria)
 * @param {string} params.endDate - Fecha fin (obligatoria)
 * @param {string|string[]} [params.selectedTypes] - Array o string CSV con tipos para filtrar (opcional)
 * @param {string} [params.priceRange] - Etiqueta rango precio (ej: 'Rango1') (opcional)
 * @returns {Promise<Array>} Lista de habitaciones con propiedad 'available_count'
 */
export const fetchFilterRooms = async ({ startDate, endDate, selectedTypes = [], priceRange = null }) => {
  if (!startDate || !endDate) throw new Error('Las fechas son obligatorias');

  // Convertir selectedTypes a array si llega como string CSV
  if (typeof selectedTypes === 'string') {
    selectedTypes = selectedTypes.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Obtener tipos disponibles para el rango de fechas
  let { data: rooms, error } = await supabase.rpc('get_available_room_types', { s_date: startDate, e_date: endDate });
  if (error) throw error;

  if (!rooms || rooms.length === 0) return [];

  // Filtrar por tipos seleccionados
  if (Array.isArray(selectedTypes) && selectedTypes.length > 0) {
    rooms = rooms.filter(room => selectedTypes.includes(room.type));
  }

  // Filtrar por rango de precio
  if (typeof priceRange === 'string' && priceRange.trim() !== '') {
    const [minPrice, maxPrice] = getPriceBounds(priceRange);
    rooms = rooms.filter(room => room.price_day >= minPrice && room.price_day <= maxPrice);
  }

  // Obtener disponibilidad por tipo en el rango de fechas
  const { data: availabilityData, error: availabilityError } = await supabase.rpc('consult_all_available_counts', {
    s_date: startDate,
    e_date: endDate
  });
  if (availabilityError) throw availabilityError;

  // Mapeo tipo -> cantidad disponible
  const availabilityMap = {};
  availabilityData.forEach(item => {
    availabilityMap[item.type] = item.available_count;
  });

  // Agregar disponibilidad a cada habitación
  const roomsWithAvailability = rooms.map(room => ({
    ...room,
    available_count: availabilityMap[room.type] ?? 0
  }));

  return roomsWithAvailability;
};





import supabase from '../../utils/supabase.js';

// Función para obtener límites de precio según valor del dropdown
const getPriceBounds = (range) => {
  switch(range) {
    case 'Rango1': return [100000, 200000];
    case 'Rango2': return [200000, 300000];
    case 'Rango3': return [300000, 400000];
    case 'Rango4': return [400000, 500000];
    default: return [0, Infinity];
  }
};

export const fetchFilterRooms = async ({ startDate, endDate, selectedTypes = [], priceRange = null }) => {
  // 1. Consultar habitaciones disponibles en rango de fechas
  let { data: rooms, error } = await supabase.rpc('consult_by_date', { s_date: startDate, e_date: endDate });
  if (error) throw error;

  // 2. Filtrar por tipo si aplica
  if (selectedTypes.length > 0) {
    rooms = rooms.filter(room => selectedTypes.includes(room.type));
  }

  // 3. Filtrar por rango de precio si aplica
  if (priceRange) {
    const [minPrice, maxPrice] = getPriceBounds(priceRange);
    rooms = rooms.filter(room => room.price_day >= minPrice && room.price_day <= maxPrice);
  }

  // 4. Consultar disponibilidad total por tipo en ese rango de fechas
  const { data: availabilityData, error: availabilityError } = await supabase.rpc('consult_all_available_counts', {
    s_date: startDate,
    e_date: endDate
  });
  
  if (availabilityError) throw availabilityError;

  // 5. Crear mapa para acceso rápido
  const availabilityMap = {};
  availabilityData.forEach(item => {
    availabilityMap[item.type] = item.available_count;
  });

  // 6. Agregar disponibilidad a cada habitación
  const roomsWithAvailability = rooms.map(room => ({
    ...room,
    available_count: availabilityMap[room.type] ?? 0
  }));

  return roomsWithAvailability;
};

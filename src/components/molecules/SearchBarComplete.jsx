import { useState } from "react";
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';

import { fetchFilterRooms } from '../../controllers/services/fetchFilterRooms';
import { CardReserveIncrement } from './CardReserveIncrement';

export const SearchBarComplete = () => {
  const [dates, setDates] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [loading, setLoading] = useState(false);

  const cities = [
    { name: 'Estándar Tropical', code: 'ST' },
    { name: 'Presidencial Elegance', code: 'PE' },
    { name: 'Suite Royal Relax', code: 'SR' },
    { name: 'Familiar Natural', code: 'FN' },
    { name: 'King Comfort', code: 'KC' },
    { name: 'Queen Serenity', code: 'QS' }
  ];

  const priceRanges = [
    { label: '$100.000 - $200.000', value: 'Rango1' },
    { label: '$200.000 - $300.000', value: 'Rango2' },
    { label: '$300.000 - $400.000', value: 'Rango3' },
    { label: '$400.000 - $500.000', value: 'Rango4' }
  ];

  //const traducirTipo = (tipo) => {
  //switch (tipo) {
  //case 'Standard': return 'Estándar Tropical';
  //case 'Family': return 'Familiar Natural';
  //case 'Presidential': return 'Presidencial Elegance';
  //case 'Suite Royal': return 'Suite Royal Relax';
  //case 'King': return 'King Comfort';
  //case 'Queen': return 'Queen Serenity';
  //default: return tipo;
  //}
  //};

const handleSearch = async () => {
  if (!dates || dates.length !== 2) {
    alert("Por favor selecciona un rango de fechas válido");
    return;
  }

  setLoading(true);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const startDate = formatDate(dates[0]);
  const endDate = formatDate(dates[1]);

  try {
    // 1. Obtener habitaciones filtradas según fechas, tipo y precio (como haces)
    const roomsFiltered = await fetchFilterRooms({
      startDate,
      endDate,
      selectedTypes: selectedCities.map(c => c.name),
      priceRange: selectedPriceRange
    });

    // 2. Obtener disponibilidad (igual que en RoomListAvailability)
    const availabilityMap = await countAvailabilityDates(startDate, endDate);

    setAvailabilityMap(availabilityMap);
    setFilteredRooms(roomsFiltered);

  } catch (error) {
    console.error("Error al buscar habitaciones:", error);
    alert("Error al buscar habitaciones. Revisa la consola.");
  }

  setLoading(false);
};


  return (
    <div className="flex flex-col items-center justify-center mb-4">
      <div className="flex flex-col items-center justify-evenly m-2 w-full h-full bg-black/20 rounded-2xl p-10">
        <h1 className="text-xl md:text-[4rem] text-center font-bold text-white">Bienvenidos al</h1>
        <h1 className="text-2xl md:text-[4rem] text-center font-bold text-white">Hotel Resort Los Laureles</h1>
        <p className="mt-4 text-sm text-white text-center">Entra en un mundo de naturaleza, confort y atención personalizada en nuestros espacios</p>
      </div>

      <div className="flex max-w-[1200px] justify-center space-y-2 md:flex-row md:space-y-0 md:space-x-2 bg-gray-100 p-3 rounded-lg shadow-md mt-4">
        <Calendar
          value={dates}
          onChange={(e) => setDates(e.value)}
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          className="w-full"
          placeholder="Elige tus fechas"
          showIcon
        />

        <MultiSelect
          value={selectedCities}
          onChange={(e) => setSelectedCities(e.value)}
          options={cities}
          optionLabel="name"
          maxSelectedLabels={3}
          className="w-full"
          placeholder="Elige tu tipo"
        />

        <Dropdown
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(e.value)}
          options={priceRanges}
          optionLabel="label"
          optionValue="value"
          className="w-full"
          placeholder="Elige tu rango de precio"
        />

        <button
          className="flex items-center justify-center md:justify-between w-full px-4 py-3 text-black bg-[#FDC800] rounded-md md:w-[40%]"
          onClick={handleSearch}
          disabled={loading}
        >
          <span className="font-medium">{loading ? "Buscando..." : "Buscar"}</span>
          <span className={`invisible md:visible pi pi-arrow-right`} style={{ fontSize: '1rem' }}></span>
        </button>
      </div>

      <div className="mt-6 w-full max-w-[1200px]">
        {filteredRooms.length > 0 ? (
          filteredRooms
            .filter(room => room.available_count > 0)
            .map((room, index) => (
              <CardReserveIncrement
                key={index}
                name={room.type}
                price={room.price_day}
                capacity={room.capacity}
                image={room.images?.[0]?.Url || ''}  // O usa 'url' según como venga
                description={'Aquí va la descripción'}
                availability={room.available_count}
              />
            ))
        ) : (
          <p className="text-center mt-4">No hay habitaciones disponibles en este rango de fechas.</p>
        )}
      </div>
    </div>
  );
};


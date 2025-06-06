import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';

export const SearchBarComplete = ({ initialDates = null, initialSelectedCities = [], initialPriceRange = null }) => {
  const [dates, setDates] = useState(initialDates);
  const [selectedCities, setSelectedCities] = useState(initialSelectedCities);
  const [selectedPriceRange, setSelectedPriceRange] = useState(initialPriceRange);

  const navigate = useNavigate();

  // Refs para controlar que solo inicialicemos una vez
  const isInitialDatesSet = useRef(false);
  const isInitialCitiesSet = useRef(false);
  const isInitialPriceRangeSet = useRef(false);

  useEffect(() => {
    if (!isInitialDatesSet.current) {
      setDates(initialDates);
      isInitialDatesSet.current = true;
    }
  }, [initialDates]);

  useEffect(() => {
    if (!isInitialCitiesSet.current) {
      setSelectedCities(initialSelectedCities);
      isInitialCitiesSet.current = true;
    }
  }, [initialSelectedCities]);

  useEffect(() => {
    if (!isInitialPriceRangeSet.current) {
      setSelectedPriceRange(initialPriceRange);
      isInitialPriceRangeSet.current = true;
    }
  }, [initialPriceRange]);

  // Fechas mínimas y máximas para el calendario
  const today = new Date();
  const maxDate = new Date(today.getFullYear() + 1, 11, 31);

  const cities = [
    { name: 'Estándar Tropical', code: 'ST' },
    { name: 'Presidencial Elegance', code: 'PE' },
    { name: 'Suite Royal Relax', code: 'SR' },
    { name: 'Familiar Natural', code: 'FN' },
    { name: 'King Comfort', code: 'KC' },
    { name: 'Queen Serenity', code: 'QS' }
  ];

  const priceRanges = [
    { label: 'Todos los rangos', value: null },
    { label: '$200,000 - $400,000', value: 'Rango1' },
    { label: '$400,000 - $600,000', value: 'Rango2' },
    { label: '$600,000 - $800,000', value: 'Rango3' },
    { label: '$800,000 - $1,000,000', value: 'Rango4' },
    { label: '$1,000,000 - $1,200,000', value: 'Rango5' },
    { label: '$1,200,000 - $1,400,000', value: 'Rango6' },
    { label: '$1,400,000 - $1,500,000', value: 'Rango7' },
  ];

  const handleSearch = () => {
    if (!dates || dates.length !== 2) {
      alert("Por favor selecciona un rango de fechas válido");
      return;
    }

    const formatDate = (date) => {
      const d = new Date(date);
      d.setHours(12, 0, 0, 0); // evitar desfase por zona horaria
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const startDate = formatDate(dates[0]);
    const endDate = formatDate(dates[1]);
    const typesParam = selectedCities.map(c => c.code).join(',');
    const priceParam = selectedPriceRange || '';

    navigate(`/reservation?start=${startDate}&end=${endDate}&types=${typesParam}&price=${priceParam}`);
  };

  return (
    <div className="flex flex-col items-center justify-center mb-4">
      <div className="flex flex-col items-center justify-evenly m-2 w-full h-full bg-black/20 rounded-2xl p-10">
        <h1 className="text-xl md:text-[4rem] text-center font-bold text-white">Bienvenidos al</h1>
        <h1 className="text-2xl md:text-[4rem] text-center font-bold text-white">Hotel Resort Los Laureles</h1>
        <p className="mt-4 text-sm text-white text-center">Entra en un mundo de naturaleza, confort y atención personalizada en nuestros espacios</p>
      </div>

      <div className="flex flex-col mx-auto w-full space-y-2 max-w-screen-xl md:flex-row md:space-y-0 md:space-x-4 bg-gray-100 p-3 rounded-lg shadow-md mt-4 min-w-0">
        <Calendar
          value={dates}
          onChange={(e) => setDates(e.value)}
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          className="w-full"
          placeholder="Elige tus fechas"
          showIcon
          minDate={today}
          maxDate={maxDate}
          yearNavigator
          yearRange={`${today.getFullYear()}:${maxDate.getFullYear()}`}
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
          className="flex items-center justify-center md:justify-between w-full md:w-2/5 px-4 py-3 text-black bg-[#FDC800] rounded-md"
          onClick={handleSearch}
        >
          <span className="font-medium">Buscar</span>
          <span className="invisible md:visible pi pi-arrow-right" style={{ fontSize: '1rem' }}></span>
        </button>
      </div>
    </div>
  );
};



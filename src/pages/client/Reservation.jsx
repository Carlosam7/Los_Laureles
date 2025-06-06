import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { SearchBarComplete } from "../../components/molecules/SearchBarComplete";
import { fetchFilterRooms } from "../../controllers/services/fetchFilterRooms";
import { countAvailabilityDates } from "../../controllers/services/countAvailabilityDates";
import { CardReserveIncrement } from "../../components/molecules/CardReserveIncrement";
import { NavBar } from "../../components/atoms/NavBar";

export const Reservation = () => {
    const [searchParams] = useSearchParams();
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [availabilityMap, setAvailabilityMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Leer parámetros URL
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");
    const typesParam = searchParams.get("types"); // ej: "ST,PE"
    const priceRange = searchParams.get("price") || null;

    // Código a nombre completo (para fetchFilterRooms)
    const codeToNameMap = {
        ST: 'Estándar Tropical',
        PE: 'Presidencial Elegance',
        SR: 'Suite Royal Relax',
        FN: 'Familiar Natural',
        KC: 'King Comfort',
        QS: 'Queen Serenity'
    };

    // Convertir códigos URL a nombres para fetchFilterRooms
    const selectedTypes = typesParam
        ? typesParam.split(',').map(code => codeToNameMap[code]).filter(Boolean)
        : [];

    // Valores iniciales para SearchBarComplete
    const initialDates = (startDate && endDate) ? [new Date(startDate), new Date(endDate)] : null;
    const initialSelectedCities = typesParam
        ? typesParam.split(',').map(code => ({ name: codeToNameMap[code], code })).filter(c => c.name)
        : [];
    const initialPriceRange = priceRange;

    // Cuando cambien filtros URL, disparar fetch
    useEffect(() => {
        const fetchRooms = async () => {
            if (!startDate || !endDate) {
                setFilteredRooms([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const roomsFiltered = await fetchFilterRooms({
                    startDate,
                    endDate,
                    selectedTypes,
                    priceRange
                });

                const availabilityData = await countAvailabilityDates(startDate, endDate);

                setAvailabilityMap(availabilityData);
                setFilteredRooms(roomsFiltered);
            } catch (error) {
                setError("Error al cargar las habitaciones.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [startDate, endDate, typesParam, priceRange]);

    return (
        <>
            <main className="flex flex-col items-center justify-start w-full min-h-screen bg-white p-5 md:p-10 min-w-[450px] space-y-5">
                <NavBar />
                <SearchBarComplete
                    initialDates={initialDates}
                    initialSelectedCities={initialSelectedCities}
                    initialPriceRange={initialPriceRange}
                />

                <div className="mt-6 w-full max-w-[1400px] mx-auto px-4">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-10">
                            <svg
                                className="animate-spin h-10 w-10 text-yellow-500 mb-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12" cy="12" r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                            <p className="text-gray-700 font-semibold text-lg">Cargando habitaciones...</p>
                        </div>
                    )}

                    {error && <p className="text-red-600">{error}</p>}

                    {!loading && filteredRooms.length === 0 && (
                        <div className="flex flex-col items-center justify-center min-h-[300px] p-10 text-center">
                            <svg
                                className="h-12 w-12 mb-4 text-gray-700"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                            </svg>
                            <p style={{ color: '#1f2937', fontWeight: '600', fontSize: '1.125rem' }}>
                                No hay habitaciones disponibles con el filtro.
                            </p>
                        </div>
                    )}

                    {filteredRooms.length > 0 && filteredRooms
                        .filter(room => (availabilityMap[room.type] ?? 0) > 0)
                        .map(room => (
                            <CardReserveIncrement
                                key={room.id || room.type}
                                name={room.type}
                                price={room.price_day}
                                capacity={room.capacity}
                                image={room.image_url || ''}
                                description={room.description}
                                availability={availabilityMap[room.type] ?? 0}
                            />
                        ))
                    }
                </div>
            </main>
        </>
    );
};








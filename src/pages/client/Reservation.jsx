import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { SearchBarComplete } from "../../components/molecules/SearchBarComplete";
import { fetchFilterRooms } from "../../controllers/services/fetchFilterRooms";
import { countAvailabilityDates } from "../../controllers/services/countAvailabilityDates";
import { CardReserveIncrement } from "../../components/molecules/CardReserveIncrement";
import { InvoiceReservation } from "../../components/molecules/InvoiceReservation";
import { NavBar } from "../../components/atoms/NavBar";

export const Reservation = () => {
    const [searchParams] = useSearchParams();
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [availabilityMap, setAvailabilityMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estado para cantidades seleccionadas por tipo de habitación
    const [selectedRoomsQuantity, setSelectedRoomsQuantity] = useState({});

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

    // Cuando cambian filtros URL, disparar fetch
    useEffect(() => {
        const fetchRooms = async () => {
            if (!startDate || !endDate) {
                setFilteredRooms([]);
                setSelectedRoomsQuantity({});
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

                // Inicializar cantidades a 0 para cada tipo filtrado
                const quantitiesInit = {};
                roomsFiltered.forEach(room => {
                    quantitiesInit[room.type] = selectedRoomsQuantity[room.type] || 0;
                });
                setSelectedRoomsQuantity(quantitiesInit);

            } catch (error) {
                setError("Error al cargar las habitaciones.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [startDate, endDate, typesParam, priceRange]);

    // Función para actualizar cantidad de un tipo específico
    const updateQuantity = (type, quantity) => {
        setSelectedRoomsQuantity(prev => ({
            ...prev,
            [type]: quantity
        }));
    };

    // Preparar datos para factura, solo con habitaciones disponibles y cantidades > 0
    const selectedRoomsForInvoice = filteredRooms
        .filter(room => (availabilityMap[room.type] ?? 0) > 0)
        .map(room => ({
            type: room.type,
            price: room.price_day,
            quantity: selectedRoomsQuantity[room.type] || 0
        }));

    return (
        <main className="flex flex-col w-full min-h-scre    en bg-white p-5 md:p-10 min-w-[450px] space-y-5">
            <NavBar/>
            <SearchBarComplete
                initialDates={initialDates}
                initialSelectedCities={initialSelectedCities}
                initialPriceRange={initialPriceRange}
            />

            <div className="flex flex-col md:flex-row items-start justify-between mt-4 mb-6 max-w-[1400px] mx-auto px-4 gap-8">

                {/* Contenedor lista de habitaciones */}
                <div className="flex-1">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-10">
                            {/* Spinner y texto */}
                        </div>
                    )}

                    {error && <p className="text-red-600">{error}</p>}

                    {!loading && filteredRooms.length === 0 && (
                        <div className="flex flex-col items-center justify-center min-h-[300px] p-10 text-center">
                            {/* Mensaje no hay habitaciones */}
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
                                quantity={selectedRoomsQuantity[room.type] || 0}
                                onQuantityChange={(qty) => updateQuantity(room.type, qty)}
                            />
                        ))
                    }
                </div>
                {selectedRoomsForInvoice.some(room => room.quantity > 0) && (
                    <div className="w-full md:w-96 sticky top-20">
                        <InvoiceReservation
                            initialDates = {initialDates}
                            selectedRooms={selectedRoomsForInvoice}
                            onConfirm={() => {
                                console.log("Reserva confirmada:", selectedRoomsForInvoice);
                            }}
                        />
                    </div>
                )}
            </div>
        </main>
    );
};
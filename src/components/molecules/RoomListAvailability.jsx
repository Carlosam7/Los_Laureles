import { useEffect, useState } from 'react'
import { CardReserveIncrement } from './CardReserveIncrement'
import { countAvailabilityDates } from '../../controllers/services/countAvailabilityDates'

export const RoomListAvailability = ({ rooms, startDate, endDate }) => {
    const [availabilityMap, setAvailabilityMap] = useState({})
    const [loadingCounts, setLoadingCounts] = useState(false)
    const [errorCounts, setErrorCounts] = useState(null)


useEffect(() => {
    const fetchCounts = async () => {
        setLoadingCounts(true);
        setErrorCounts(null);
        try {
            console.log('Fechas enviadas:', startDate, endDate);
            const result = await countAvailabilityDates(startDate, endDate);
            console.log('Resultado de countAvailabilityDates:', result);
            setAvailabilityMap(result);
        } catch (err) {
            console.error('Error al contar disponibilidad:', err);
            setErrorCounts(err.message || 'Error desconocido');
        } finally {
            setLoadingCounts(false);
        }
    };
    if (startDate && endDate) fetchCounts();
}, [rooms, startDate, endDate]);

    if (loadingCounts) return <p>Cargando disponibilidad...</p>
    if (errorCounts) return <p>Error: {errorCounts}</p>

const traducirTipo = (tipo) => {
    switch (tipo) {
        case 'Standard': return 'Estándar Tropical';
        case 'Family': return 'Familiar Natural';
        case 'Presidential': return 'Presidencial Elegance';
        case 'Suite Royal': return 'Suite Royal Relax';
        case 'King': return 'King Comfort';
        case 'Queen': return 'Queen Serenity';
        default: return tipo;
    }
};

return (
    <>
        {rooms.length > 0 ? (
            rooms
                .filter(room => {
                    const tipoCompleto = traducirTipo(room.type);
                    const availableCount = availabilityMap[tipoCompleto] ?? 0;
                    return availableCount > 0;
                })
                .map((room, index) => {
                    const tipoCompleto = traducirTipo(room.type);
                    const availableCount = availabilityMap[tipoCompleto] ?? 0;

                    return (
                        <CardReserveIncrement
                            key={index}
                            name={tipoCompleto}
                            price={room.priceDay}
                            capacity={room.capacity}
                            image={room.images[0]?.Url || ''}
                            description={'Aquí va la descripción'}
                            availability={availableCount}
                        />
                    );
                })
        ) : (
            <p>No hay habitaciones disponibles en este rango de fechas.</p>
        )}
    </>
);
}
import { useEffect, useState, useMemo } from 'react'
import { CardReserveIncrement } from './CardReserveIncrement'
import { countAvailabilityDates } from '../../controllers/services/countAvailabilityDates'

export const RoomListAvailability = ({ rooms, startDate, endDate }) => {
    const [availabilityMap, setAvailabilityMap] = useState({})
    const [loadingCounts, setLoadingCounts] = useState(false)
    const [errorCounts, setErrorCounts] = useState(null)

    useEffect(() => {
        if (!startDate || !endDate) return

        const fetchCounts = async () => {
            setLoadingCounts(true)
            setErrorCounts(null)
            try {
                const result = await countAvailabilityDates(startDate, endDate)
                setAvailabilityMap(result)
            } catch (err) {
                setErrorCounts(err.message || 'Error desconocido')
            } finally {
                setLoadingCounts(false)
            }
        }
        fetchCounts()
    }, [startDate, endDate])

    const availableRooms = useMemo(() => {
        return rooms.filter(room => (availabilityMap[room.type] ?? 0) > 0)
    }, [rooms, availabilityMap])

    if (loadingCounts) return <p>Cargando disponibilidad...</p>
    if (errorCounts) return <p>Error: {errorCounts}</p>

    return (
        <>
            {availableRooms.length > 0 ? (
                availableRooms.map(room => (
                    <CardReserveIncrement
                        key={room.id || room.type}
                        name={room.type}
                        price={room.priceDay}
                        capacity={room.capacity}
                        image={room.images[0]?.Url || ''}
                        description={room.description}
                        availability={availabilityMap[room.type] ?? 0}
                    />
                ))
            ) : (
                    <p style={{ color: '#1f2937', fontWeight: '600', fontSize: '1.125rem', textAlign: 'center' }}>
                    No hay habitaciones disponibles en este rango de fechas.
                    </p>
            )}
        </>
    )
}

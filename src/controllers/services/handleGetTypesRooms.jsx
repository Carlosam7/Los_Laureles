import supabase from '../../utils/supabase.js';
import { StandardRoom, FamilyRoom, PresidentialRoom, SuiteRoyalRoom, KingRoom, QueenRoom } from '../../models/classes/Room.js';

export const handleGetTypesRooms = async (req, res) => {
    try {
        const { data } = await supabase.from('view_by_type_room').select();
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No room types found' });
        }
        const roomTypes = data.map(room => {
            switch (room.type) {
                case 'Estándar Tropical':
                    return new StandardRoom(room.id_type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds, []);
                case 'Familiar Natural':
                    return new FamilyRoom(room.id_type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds, []);
                case 'Presidencial Elegance':
                    return new PresidentialRoom(room.id_type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds, []);
                case 'Suite Royal Relax':
                    return new SuiteRoyalRoom(room.id_type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds, []);
                case 'King Comfort':
                    return new KingRoom(room.id_type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds, []);
                case 'Queen Serenity':
                    return new QueenRoom(room.id_type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds, []);
                default:
                    throw new Error(`Unknown type: ${room.type}`);
            }
        });
        return roomTypes;
    } catch (error) {
        console.error('Error fetching room types:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
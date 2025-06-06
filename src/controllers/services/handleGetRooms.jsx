import supabase from '../../utils/supabase.js';
import { Room } from '../../models/classes/Room.js';

export const handleGetRooms = async (req, res) => {
    try {
        const { data } = await supabase.from('view_rooms').select();
        const rooms = data.map(room => {
            return new Room(room.id_room, room.id_type, room.type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds);
        }
        )
        return rooms;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
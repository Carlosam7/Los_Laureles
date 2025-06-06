import supabase from '../../utils/supabase.js';
import { Room } from '../../models/classes/Room.js';

export const handleGetTypesRooms = async () => {
    try {
        const { data, error } = await supabase.from('view_by_type_room').select();
        if (error || !data) throw new Error('No room types found');

        const roomTypes = data.map(room => {               
                    return new Room(null, room.id_type, room.type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds, []);
            }
        );

        return roomTypes;
    } catch (error) {
        console.error('Error fetching room types:', error);
        return [];
    }
}
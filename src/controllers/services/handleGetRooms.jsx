import supabase from '../../utils/supabase.js';
import { StandardRoom, FamilyRoom, PresidentialRoom, SuiteRoyalRoom, KingRoom, QueenRoom } from '../../models/classes/Room.js';

export const handleGetRooms = async (req, res) => {
    try {
        const { data } = await supabase.from('view_rooms').select();
        const rooms = data.map(room => {
            switch (room.type) {
                case 'Estándar Tropical':
                    return new StandardRoom(room.id_room, room.type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds);
                case 'Familiar Natural':
                    return new FamilyRoom(room.id_room, room.type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds);
                case 'Presidencial Elegance':
                    return new PresidentialRoom(room.id_room, room.type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds);
                case 'Suite Royal Relax':
                    return new SuiteRoyalRoom(room.id_room, room.type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds);
                case 'King Comfort':
                    return new KingRoom(room.id_room, room.type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds);
                case 'Queen Serenity':
                    return new QueenRoom(room.id_room, room.type, room.price_day, room.capacity, room.description, room.size, room.number_bathrooms, room.number_rooms, room.number_beds);
                default:
                    throw new Error(`Unknown room type: ${room.type}`);
            }
            
        })
        // let room_types = []
        // let value = false;
        // room_types.push(rooms[0]);
        // for (let i=0; i < rooms.length; i++) {
        //     for (let j=0; j < room_types.length; j++) {
        //         if (room_types[j].type === rooms[i].type) {
        //             value = true;
        //             break;
        //         }
        //     }
        //     if (!value) {
        //         room_types.push(rooms[i]);
        //     }else{
        //         value = false;
        //     }
            
        // }
        return rooms;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
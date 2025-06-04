import { handleGetTypesRooms } from "./services/handleGetTypesRooms";
import { handleGetImages } from "./services/handleGetImages";

export const showRooms = async (req, res) => {
    try {
        const typeRooms = await handleGetTypesRooms();
        const images = await handleGetImages();

        //Agregar las imágenes a cada tipo de habitación
        typeRooms.map(room => {
            const roomImages = images.filter(image => image.idType === room.idRoom);
            room.images = roomImages
        })
        return typeRooms;
    }catch (error) {
        console.error('Error fetching rooms or types:', error);
        throw new Error('Failed to fetch rooms or types');
    }


}
import { handleGetTypesRooms } from "./services/handleGetTypesRooms";
import { handleGetImages } from "./services/handleGetImages";
import { consultByDate } from "./services/consultByDate";
import { numberAvailableRoomByTypeDate } from "./services/numberAvailableRoomByTypeDate";
import { createReserveWithRooms } from "./services/createReserveClient";

export const showRooms = async () => {
    try {
        const typeRooms = await handleGetTypesRooms();
        const images = await handleGetImages();

        if (!typeRooms.length) throw new Error("No se encontraron tipos de habitaciones");
       // if (!images.length) throw new Error("No se encontraron imágenes");

        //Agregar las imágenes a cada tipo de habitación
        typeRooms.map(room => {
            const roomImages = images.filter(image => image.idType == room.idType);
            room.images = roomImages
        });

        return typeRooms;

    }catch (error) {
        console.error('Error fetching rooms or types:', error);
        [];
    }
}

export const getRoom = async (idType, listRoom = null) => {
    if(listRoom===null){
    
        const rooms = await showRooms();
        const r = rooms.find(room => room.idType == idType);
        return r;
    
    } else {

        const r = listRoom.find(room => room.idType == idType);
        return r;

    }  
};

export const availability = async (type, sDate, eDate) => {
    const data = await consultByDate(sDate, eDate)
    if (data.find(r => r.type == type)){
        const rooms = data.filter(r => r.type == type)
        const idRooms = rooms.map(room => 
            room.id_room
        )

        return { available: true, idRooms: idRooms, numberAvailable: idRooms.length }
    }else{
        return { available: false, idRooms: null, numberAvailable: null }
    }
}

export const createReserve = async (code, sDate, eDate, listRooms) => {
    try {
        await createReserveWithRooms(code, sDate, eDate, listRooms)
    } catch (error) {
        console.log('Error', error)
        return error
    }
}
import Image from './Image.js';

class Room {
    /**
        * @param {String}       idRoom                    - Unique identifier for the room
        * @param {String}       type                      - Type of the room (e.g., 'King', 'Family')
        * @param {Number}       priceDay                  - Price per day for the room
        * @param {Number}       capacity                  - Maximum number of people the room can accommodate
        * @param {String}       description               - Description of the room
        * @param {Boolean}      [available=true]         - Availability status of the room
        * @param {Array<Image>} images                    - Array of Image objects associated with the room
    */

    constructor(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images) {
        this.idRoom = idRoom;
        this.idType = idType;
        this.type = type; // This is not used in the base class, but can be used in subclasses
        this.priceDay = priceDay;
        this.capacity = capacity;
        this.description = description;
        this.size = size;
        this.numberBathrooms = numberBathrooms;
        this.numberRooms = numberRooms;
        this.numberBeds = numberBeds;
        this.images = images;


        // Clase abstracta
        // if (this.constructor === Room) {
        //     throw new Error("Cannot instantiate abstract class");
        // }
    }

    //Getters
    get IdRoom() {
        return this.idRoom;
    }
    get IdType() {
        return this.idRoom;
    }
    get Type() {
        return this.type;
    }
    get PriceDay() {
        return this.priceDay;
    }
    get Capacity() {
        return this.capacity;
    }
    get Description() {
        return this.description;
    }

    get Images() {
        return this.images;
    }

    //Setters
    set IdRoom(idRoom) {
        this.idRoom = idRoom;
    }
    set IdType(idType) {
        this.idType = idType;
    }
    set Type(type) {
        this.type = type;
    }
    set PriceDay(priceDay) {
        this.priceDay = priceDay;
    }
    set Capacity(capacity) {
        this.capacity = capacity;
    }
    set Description(description) {
        this.description = description;
    }
    set Images(images) {
        this.images = images;
    }


    // Representation of the Room object
    toString() {
        return (`Room ID: ${this.IdRoom}, 
        Type: ${this.Type}, 
        Price per Day: ${this.PriceDay}, 
        Capacity; ${this.Capacity}, 
        Description: ${this.Description}, 
        Images: [${this.Images.map(image => image.toString()).join(', ')}]`
        );
    }


};

// class StandardRoom extends Room {
//     constructor(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images=[]) {
//         super(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images);
//     }

//     // Getters
//     get Type() {
//         return 'Estándar Tropical';
//     }

//     // Setters
//     set Type(type) {
//         throw new Error("Cannot change the type of a Standard Room");
//     }
// };

// class FamilyRoom extends Room {
//    constructor(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images=[]) {
//         super(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images);
//     }

//     // Getters
//     get Type() {
//         return 'Familiar Natural';
//     }

//     // Setters
//     set Type(type) {
//         throw new Error("Cannot change the type of a Famlily Room");
//     }

// };

// class PresidentialRoom extends Room {
//     constructor(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images=[]) {
//         super(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images);
//     }

//     // Getters
//     get Type() {
//         return 'Presidencial Elegance';
//     }

//     // Setters
//     set Type(type) {
//         throw new Error("Cannot change the type of a Presidential Room");
//     }

// };

// class SuiteRoyalRoom extends Room {
//    constructor(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images=[]) {
//         super(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images);
//     }

//     // Getters
//     get Type() {
//         return 'Suite Royal Relax';
//     }

//     // Setters
//     set Type(type) {
//         throw new Error("Cannot change the type of a Suit Royal Room");
//     }

// };

// class KingRoom extends Room {
//    constructor(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images=[]) {
//         super(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images);
//     }

//     // Getters
//     get Type() {
//         return 'King Comfort';
//     }

//     // Setters
//     set Type(type) {
//         throw new Error("Cannot change the type of a King Room");
//     }

// };

// class QueenRoom extends Room {
//    constructor(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images=[]) {
//         super(idRoom, idType, type, priceDay, capacity, description, size, numberBathrooms, numberRooms, numberBeds, images);
//     }

//     // Getters
//     get Type() {
//         return 'Queen Serenity';
//     }

//     // Setters
//     set Type(type) {
//         throw new Error("Cannot change the type of a PresidentialRoom");
//     }

// }

export { Room };
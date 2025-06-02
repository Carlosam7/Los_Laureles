import Reserve from './Reserve.js';
import Room from './rooms/Room.js';
import User from './User.js';

class Guest extends User {

    /**
        * @param {String} telephone 
        * @param {Array<Reserve>} reservations
    */

    constructor (code, email, id, name, lastname, telephone, reservations=[]) {
        super(code, email, id, name, lastname);

        this.telephone  = telephone;
        this.reservations = reservations; // Array of Reserve objects
        this.type       = 'client';

        // Validate that reservations is an array of Reserve instances
        if (!Array.isArray(reservations) || !reservations.every(reserve => reserve instanceof Reserve)) {
            throw new Error("Reservations must be an array of Reserve instances");
        }

    }

    // Getters
    get Telephone() {
        return this.telephone;
    };
    get Reservations() {
        return this.reservations;
    }
    // Setters
    set Telephone(telephone) {
        this.telephone = telephone;
    }

    consultReserve(idReserve) {
        const reserve = this.reservations.find(res => res.IdReserve === idReserve);
        if (reserve) {
            return reserve;
        }else {
            throw new Error('Reserve not found');
        }
    }

    addReserve(idReserve, startDay, endDay, rooms, comments, invoice=null) {
        // Validate that rooms is an array of Room instances
        if (!Array.isArray(rooms) || !rooms.every(room => room instanceof Room)) {
            throw new Error("Rooms must be an array of Room instances");
        }

        // Create a new Reserve instance
        const newReserve = new Reserve(idReserve, startDay, endDay, 'Pending', this, rooms, comments, invoice);

        // Add the new reserve to the reservations array
        this.reservations.push(newReserve);

    }

    cancelReserve(idReserve) {
        const index = this.reservations.findIndex(res => res.idReserve === idReserve);
        if (index !== -1) {
            this.reservations.splice(index, 1);
            return true;
        } else {
            return new Error('Reserve not found');
        }
    }

    //Representation of the Guest object
    toString() {
        return (`Guest: ${this.name} ${this.lastname}, 
        Email: ${this.email},
        Telephone: ${this.telephone}, 
        Reservations: ${this.reservations.length}`);
    }

}

export default Guest;
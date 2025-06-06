import Invoice from './Invoice.js';
import Guest from './Guest.js';
import Room from './rooms/Room.js';
import Administrator from './Administrator.js';

class Reserve {
    /** 
        *@param {number}        idReserve
        *@param {Date}          startDay
        *@param {Date}          endDay
        *@param {string}        state
        *@param {Guest}         guest
        *@param {Array<Room>}   rooms
        *@param {string}        comment
     */
    constructor(idReserve, startDay, endDay, state = 'Pending', guest, rooms, comment) {
        this.idReserve  =   idReserve;
        this.startDay   =   startDay;     // Dates should be Date objects
        this.endDay     =   endDay;       // Dates should be Date objects
        this.state      =   state;        // 'pending', 'confirmed', 'cancelled'
        this.checkedIn   =   false;        // Boolean to check if the guest has checked in
        this.checkedOut  =   false;        // Boolean to check if the guest has checked out
        this.guest      =   guest;        // Instance of Guest class
        this.rooms      =   rooms;        // Array of room IDs or Room objects
        this.comment   =   comment;     // Array of comments related to the reservation
        this.invoice    =   null;         // Optional invoice object

        // Validate rooms
        if (!Array.isArray(rooms) || !rooms.every(room => room instanceof Room)) {
            throw new Error("Rooms must be an array of Room instances");
        }
        if (rooms.length === 0) {
            throw new Error("At least one room must be reserved");
        }


        // Validate that guest is an instance of Guest
        if (!(guest instanceof Guest)) {
            throw new Error("Guest must be an instance of Guest class");
        }

        // Validate that startDay and endDay are Date objects
        if (!(startDay instanceof Date) || !(endDay instanceof Date)) {
            throw new Error("StartDay and EndDay must be Date objects");
        }

        if (startDay >= endDay) {
            throw new Error("StartDay must be before EndDay");
        }

        // Validate that state is a valid string
        const validStates = ['Pending', 'Confirmed', 'Cancelled'];
        if (!validStates.includes(state)) {
            throw new Error(`State must be one of the following: ${validStates.join(', ')}`);
        }

        // Validate that rooms is an array of Room instances
        if (!Array.isArray(rooms) || !rooms.every(room => room instanceof Room)) {
            throw new Error("Rooms must be an array of Room instances");
        }
    }

    // Getters
    get IdReserve() {
        return this.idReserve;
    }
    get StartDay() {
        return this.startDay;
    }
    get EndDay() {
        return this.endDay;
    }
    get State() {
        return this.state;
    }
    get CheckedIn() {
        return this.checkedIn;
    }
    get CheckedOut() {
        return this.checkedOut;
    }
    get Guest() {
        return this.guest;
    }
    get Rooms() {
        return this.rooms;
    }
    get Comment() {
        return this.comment;
    }

    // Setters
    set IdReserve(idReserve) {
        this.idReserve = idReserve;
    }
    set StartDay(startDay) {
        this.startDay = startDay;
    }
    set EndDay(endDay) {
        this.endDay = endDay;
    }
    set State(state) {
        this.state = state;
    }
    set CheckedIn(checkedIn) {
        if (typeof checkedIn === 'boolean') {
            this.checkedIn = checkedIn;
        } else {
            throw new Error("CheckedIn must be a boolean");
        }
    }
    set CheckedOut(checkedOut) {
        if (typeof checkedOut === 'boolean') {
            this.checkedOut = checkedOut;
        } else {
            throw new Error("CheckedOut must be a boolean");
        }
    }
    set Guest(guest) {
        if (guest instanceof Guest) {
            this.guest = guest;
        } else {
            throw new Error("Guest must be an instance of Guest class");
        }
    }
    set Rooms(rooms) {
        if (Array.isArray(rooms) && rooms.every(room => room instanceof Room)) {
            this.rooms = rooms;
        } else {
            throw new Error("Rooms must be an array of Room instances");
        }
    }
    set Comment(comment) {
        this.comment = comment;
        return true;
    }

    //Functions

    generateInvoice(administrator) {
        if (!(administrator instanceof Administrator)) {
            throw new Error ('Administrator must be an instance of Administrator class');
        } else {
            // Calculate total price based on rooms and dates
            const totalPrice = this.rooms.reduce((total, room) => total + room.PriceDay, 0) * ((this.endDay.getTime() - this.startDay.getTime()) / (1000 * 60 * 60 * 24)); // Calculate days between start and end

            // Create a new Invoice instance
            const invoice = new Invoice(this, administrator, totalPrice, new Date())

            // Set the invoice for the reservation
            this.invoice = invoice;
            // Add the invoice to the administrator's invoices
            administrator.Invoices = invoice;
        }
    }

    // Representation of the Reserve object
    toString() {
        return (`Reserve ID: ${this.idReserve},
        Start Day: ${this.startDay.toLocaleDateString()},
        End Day: ${this.endDay.toLocaleDateString()},
        State: ${this.state},
        Checked In: ${this.checkedIn},
        Checked Out: ${this.checkedOut},
        Guest: ${this.guest.toString()},
        Rooms: ${this.rooms.map(room => room.Type).join(', ')},
        Comment: ${this.comment},
        Invoice: ${this.invoice ? this.invoice.toString() : 'No invoice generated'}`);
    }
}

export default Reserve;
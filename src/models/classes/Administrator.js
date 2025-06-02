import User from "./User.js";
import Reserve from "./Reserve.js";
import Invoice from "./Invoice.js";

class Administrator extends User {

    /**
     * @param {Array<String, String>} comments
     * @param {Array<Reserve>} reserves
     * @param {Array<Invoice>} invoices
     */

    constructor (code, email, id, name, lastname, comments={}, invoices=[]){
        super(code, email, id, name, lastname);

        this.comments   = comments;
        this.type       = 'administrator';
        this.reserves   = []; // Array of Reserve objects
        this.invoices   = invoices; // Array of Invoice objects


        // Validate that comments is an object with Reserve IDs as keys and comments as values
        if (typeof comments !== 'object' || Array.isArray(comments)) {
            throw new Error("Comments must be an object with Reserve IDs as keys and comments as values");
        }

        // Validate that invoices is an array of Invoice instances
        if (!Array.isArray(invoices) || !invoices.every(invoice => invoice instanceof Invoice)) {
            throw new Error("Invoices must be an array of Invoice instances");
        }

    }

    // Getters
    get Comments() {
        return this.comments;
    }
    get Invoices() {
        return this.invoices;
    }
    get Reserves() {
        return this.reserves;
    }

    // Setters
    set Reserves(reserve) {
        if (reserve instanceof Reserve) {
            this.reserves.push(reserve);
            return true;
        } else {
            return new Error("Reserve must be an instance of Reserve class");
        }
    }
    set Invoices(invoice) {
        if (invoice instanceof Invoice) {
            this.invoices.push(invoice);
            return true;
        } else {
            return new Error("Invoice must be an instance of Invoice class");
        }
    }

    //functions
    consultReserve(idreserve) {
        const reserve = this.reserves.find(res => res.idReserve === idreserve);
        if (!reserve) {
            return new Error('Reserve not found');
        }
        return reserve;
    }

    confirmReserve(idReserve, comment) {
        const reserve = this.consultReserve(idReserve);
        if (reserve.state === 'Confirmed') {
            return new Error('Reserve is already confirmed');
        }
        if (!(typeof comment === 'string')) {
            return new Error('Comment must be a string');
        }
        reserve.state = 'Confirmed';
        this.addComment(idReserve, comment);
        return true;
    }

    cancelReserve(idreserve, comment) {
        const reserve = this.reserves.find(res => res.idReserve === idreserve);
        if (!reserve) {
            return new Error('Reserve not found');
        }
        if (reserve.state === 'Cancelled') {
            return new Error('Reserve is already cancelled');
        }
        if (!(typeof comment === 'string')) {
            return new Error('Comment must be a string');
        }
        reserve.state = 'Cancelled';
        this.addComment(idreserve, comment);
        return true;
    }

    checkIn (idReserve, check) {
        const reserve = this.consultReserve(idReserve);
        if (reserve instanceof Error) {
            return reserve; // Return the error if reserve not found
        }
        try {
            if (reserve.endDay < new Date()) {
                return new Error('Cannot check-in for a reserve that has already ended');
            }
            reserve.checkedIn = check;
            reserve.generateInvoice(this);
            return true; // Return true if check-in is successful
        } catch (error) {
            return error; // Return the error if any occurs during check-in
        }
    }
    checkOut (idReserve) {
        const reserve = this.consultReserve(idReserve);
        if (reserve instanceof Error) {
            return reserve; // Return the error if reserve not found
        }
        try {
            reserve.checkedOut(true);
            return true; // Return true if check-out is successful
        } catch (error) {
            return error; // Return the error if any occurs during check-out
        }
    }

    addComment(idReserve, comment) {
        if (this.consultReserve(idReserve) instanceof Error) {
            return new Error('Reserve not found');
        }
        if (typeof comment !== 'string' || comment.trim() === '') {
            return new Error('Comment must be a non-empty string');
        }
        if (this.comments[idReserve]) {
            return new Error('Comment for this reserve already exists');
        }
        this.comments[idReserve] = comment;
        const reserve = this.consultReserve(idReserve);
        reserve.Comment = comment;
        return true; // Return true if comment is added successfully
    }

    // Representation of the Administrator object
    toString() {
        return (`Administrator: ${this.name} ${this.lastname}, 
        Email: ${this.email},
        ID: ${this.id},
        Type: ${this.type},
        Reserves: ${this.reserves.length},
        Invoices: ${this.invoices.length}`);
    }




}

export default Administrator;
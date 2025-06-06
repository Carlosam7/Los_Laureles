import Administrator from "./Administrator.js";
import Reserve from "./Reserve.js";

class Invoice {

    /**
     * 
     * @param {String}          idInvoice 
     * @param {Reserve}         reserve 
     * @param {Administrator}   administrator 
     * @param {Number}          totalPrice 
     * @param {Date}            date 
     */

    static idInvoice=0; // Unique identifier for the invoice
    constructor (reserve, administrator, totalPrice, date) {
        this.idInvoice      =   Invoice.idInvoice++; // Incremental ID for each invoice
        this.reserve        =   reserve; // Reserve object
        this.administrator  =   administrator; // Administrator object
        this.totalPrice     =   totalPrice; // Total price of the invoice
        this.date           =   date; // Date of the invoice

        // Validate that reserve is an instance of Reserve
        if (!(reserve instanceof Reserve)) {
            throw new Error("Reserve must be an instance of Reserve class");
        }

        // Validate that administrator is an instance of Administrator
        if (!(administrator instanceof Administrator)) {
            throw new Error("Administrator must be an instance of Administrator class");
        }
    }

    // Getters
    get IdInvoice() {
        return this.idInvoice;
    }
    get Reserve() {
        return this.reserve;
    }
    get Administrator() {
        return this.administrator;
    }
    get TotalPrice() {
        return this.totalPrice;
    }
    get Date() {
        return this.date;
    }

    toString() {
        return (`Invoice ID: ${this.idInvoice},
        Reserve ID: ${this.reserve.IdReserve},
        Administrator: ${this.administrator.Name} ${this.administrator.Lastname},
        Total Price: $${this.totalPrice.toFixed(2)},
        Date: ${this.date.toLocaleDateString()}`);
    }
}

export default Invoice;
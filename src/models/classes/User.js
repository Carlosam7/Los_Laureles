class User {
    constructor (code, email, id, name, lastname) {

        /**
            * @param {String} code 
            * @param {String} email 
            * @param {String} id 
            * @param {String} name 
            * @param {String} lastname 
         */

        this.code       = code;
        this.email      = email;
        this.id         = id;
        this.name       = name;
        this.lastname   = lastname;

        // Clase abstracta
        if (this.constructor === User) {
            throw new Error("Cannot instantiate abstract class");
        }
    }

    //Getters
    get Code() {
        return this.code;
    }
    get Email() {
        return this.email;
    }
    get Id() {
        return this.id;
    }
    get Name() {
        return this.name;
    }
    get Lastname() {
        return this.lastname;
    }

    //Setters
    set Code(code) {
        this.code = code;
    }
    set Email(email) {
        this.email = email;
    }
    set Id(id) {
        this.id = id;
    }
    set Name(name) {
        this.name = name;
    }
    set Lastname(lastname) {
        this.lastname = lastname;
    }
}

export default User;
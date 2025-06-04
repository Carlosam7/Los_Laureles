class Image {

    /**
     * 
     * @param {String} idType 
     * @param {String} url 
     */

    constructor (idType, url) {
        this.idType     =   idType;
        this.url        =   url;
    }

    // Getters
    get IdType() {
        return this.idType;
    }
    get Url() {
        return this.url;
    }

    // Setters
    set IdType(idType) {
        this.idType = idType;
    }
    set Url(url) {
        this.url = url;
    }
}

export default Image;
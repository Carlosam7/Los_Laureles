class Image {

    /**
     * 
     * @param {String} idImage 
     * @param {String} idRoom 
     * @param {String} url 
     */

    constructor (idImage, idRoom, url) {
        this.idImage    =   idImage;
        this.idRoom     =   idRoom;
        this.url        =   url;
    }

    // Getters
    get IdImage() {
        return this.idImage;
    }
    get IdRoom() {
        return this.idRoom;
    }
    get Url() {
        return this.url;
    }

    // Setters
    set IdImage(idImage) {
        this.idImage = idImage;
    }
    set IdRoom(idRoom) {
        this.idRoom = idRoom;
    }
    set Url(url) {
        this.url = url;
    }
}

export default Image;
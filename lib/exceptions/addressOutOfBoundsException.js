class AddressOutOfBoundsException extends Error {

    constructor(message) {
        super();
        this.errorMessage = message;
        this.name = "AddressOutOfBoundsException";
    }
}

// window.AddressOutOfBoundsException = AddressOutOfBoundsException;
module.exports = AddressOutOfBoundsException;
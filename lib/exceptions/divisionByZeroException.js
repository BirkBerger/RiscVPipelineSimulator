class DivisionByZeroException extends Error {

    constructor(message) {
        super();
        this.errorMessage = message;
        this.name = "DivisionByZeroException";
    }
}

// window.DivisionByZeroException = DivisionByZeroException;
module.exports = DivisionByZeroException;
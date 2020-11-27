class InfiniteLoopException extends Error {

    constructor(message) {
        super();
        this.errorMessage = message;
        this.name = "InfiniteLoopException";
    }
}

// window.InfiniteLoopException = InfiniteLoopException;
module.exports = InfiniteLoopException;
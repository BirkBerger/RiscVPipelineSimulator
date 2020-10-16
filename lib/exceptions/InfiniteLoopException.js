class InfiniteLoopException extends Error {

    constructor(message) {
        super();
        this.errorMessage = message;
        this.name = "InfiniteLoopException";
    }
}
class InterpreterHolder {

    constructor(interpreter) {
        this.interpreter = interpreter;
    }
    getInterpreter() {
        return this.interpreter;
    }
}

module.exports = InterpreterHolder;
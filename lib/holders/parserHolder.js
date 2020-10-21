class ParserHolder {

    constructor(parser) {
        this.parser = parser;
    }
    getParser() {
        return this.parser;
    }
}

module.exports = ParserHolder;
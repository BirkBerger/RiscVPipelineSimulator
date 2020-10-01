class CompilerHolder {

    constructor(compiler) {
        this.compiler = compiler;
    }
    getCompiler() {
        return this.compiler;
    }
}

module.exports = CompilerHolder;
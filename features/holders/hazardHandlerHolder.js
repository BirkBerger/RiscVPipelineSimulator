class HazardHandlerHolder {

    constructor(hazardHandler) {
        this.hazardHandler = hazardHandler;
    }
    getHazardHandler() {
        return this.hazardHandler;
    }
}

module.exports = HazardHandlerHolder;
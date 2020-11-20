class CleanerHolder {

    constructor(cleaner) {
        this.cleaner = cleaner;
    }
    getCleaner() {
        return this.cleaner;
    }
}

module.exports = CleanerHolder;
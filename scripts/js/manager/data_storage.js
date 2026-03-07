export class DataStorage {
    constructor(sword, pieces) {
        this.swords = sword;
        this.pieces = pieces;
        this.maxUpgradableIndex = this.swords.length - 1;
        this.swordCount = this.swords.length;
    }
    getSwordAt(index) {
        return this.swords[index];
    }
    getSwordWithId(id) {
        const res = this.swords.find(sword => sword.id == id);
        if (res === undefined)
            throw new Error(`Sword with ID ${id} not found.`);
        return res;
    }
}

import { ContextType } from '../other/context.js';
import { Observer, Piece, Sword, TestResult, UnknownItem } from '../other/entity.js';
import { Game } from '../other/main.js';
import { StatID } from './stat_manager.js';
export class SwordManager extends Observer {
    constructor(swords = []) {
        super();
        this._current_sword_index = 0;
        this.found_sword_indexs = new Set();
        this.swords = swords;
        this.max_upgradable_index = this.swords.length - 1;
    }
    get current_sword_index() {
        return this._current_sword_index;
    }
    set current_sword_index(value) {
        value = Math.min(Math.max(value, 0), this.max_upgradable_index);
        this._current_sword_index = value;
        this.notify(this.getRenderEvent());
    }
    getRenderEvent() {
        return {
            type: ContextType.SWORD,
            index: this._current_sword_index,
            sword: this.getCalculatedCurrentSword(),
            isMax: this._current_sword_index >= this.max_upgradable_index
        };
    }
    getSwordWithId(id) {
        const res = this.swords.find(sword => sword.id == id);
        if (res === undefined)
            throw new Error();
        return res;
    }
    getSwordWithIdx(index) {
        const res = this.swords[index];
        if (res === undefined)
            throw new Error();
        return res;
    }
    getCalculatedSwordWithId(id) {
        const sword = this.getSwordWithId(id);
        return new Sword(sword.id, Game.statManager.calculate(StatID.LUCKY_BRACELET, sword.prob), Game.statManager.calculate(StatID.SMITH, sword.cost), Game.statManager.calculate(StatID.BIG_MERCHANT, sword.price), sword.requiredRepairs, sword.canSave, sword.pieces.map(piece => new Piece(piece.id, piece.prob, Game.statManager.calculate(StatID.MAGIC_HAT, piece.max_drop))));
    }
    getCalculatedSwordWithIdx(index) {
        const sword = this.getSwordWithIdx(index);
        return new Sword(sword.id, Game.statManager.calculate(StatID.LUCKY_BRACELET, sword.prob), Game.statManager.calculate(StatID.SMITH, sword.cost), Game.statManager.calculate(StatID.BIG_MERCHANT, sword.price), sword.requiredRepairs, sword.canSave, sword.pieces.map(piece => new Piece(piece.id, piece.prob, Game.statManager.calculate(StatID.MAGIC_HAT, piece.max_drop))));
    }
    getIndex(id) {
        return this.swords.indexOf(this.getSwordWithId(id));
    }
    calculateLoss(index) {
        return this.swords.slice(0, index + 1).reduce((pre, cur) => pre += Game.statManager.calculate(StatID.SMITH, cur.cost), 0);
    }
    isFound(value) {
        switch (typeof value) {
            case "number": return this.found_sword_indexs.has(value);
            case "string": return this.found_sword_indexs.has(this.getIndex(value));
        }
    }
    getFoundSwordCount() {
        return this.found_sword_indexs.size;
    }
    findSword(index) {
        if (!this.isFound(index)) {
            this.found_sword_indexs.add(index);
            Game.statManager.addStatPoint();
        }
    }
    jumpTo(index) {
        index = Math.min(Math.max(index, 0), this.max_upgradable_index);
        this.findSword(index);
        this.current_sword_index = index;
    }
    upgradeSword(index = 1) {
        this.jumpTo(this.current_sword_index + index);
    }
    downgradeSword(index = 1) {
        this.jumpTo(this.current_sword_index - index);
    }
    getCurrentSword() {
        return this.getSwordWithIdx(this.current_sword_index);
    }
    getCalculatedCurrentSword() {
        return this.getCalculatedSwordWithIdx(this.current_sword_index);
    }
    getNextSword() {
        return this.getSwordWithIdx(Math.min(this.current_sword_index + 1, this.max_upgradable_index));
    }
    getAllSwords() {
        const items = [];
        for (let i = 0; i <= this.max_upgradable_index; i++) {
            if (this.found_sword_indexs.has(i))
                items.push(this.swords[i].toItem());
            else
                items.push(new UnknownItem());
        }
        return items;
    }
    test() {
        if (this.current_sword_index >= this.max_upgradable_index)
            return TestResult.MAX_UPGRADE;
        else if (!Game.inventoryManager.hasMoney(this.getCurrentSword().cost))
            return TestResult.RESOURCES_LACK;
        return TestResult.SUCCESS;
    }
}

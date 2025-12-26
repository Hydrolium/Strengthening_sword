import { ContextType } from '../other/context.js';
import { Observer, Piece, Sword, SwordTestResult, UnknownItem } from '../other/entity.js';
import { Game } from '../other/main.js';
import { StatID } from './stat_manager.js';
export class SwordManager extends Observer {
    constructor(swords = []) {
        super();
        this._current_sword_index = 0;
        this.foundSwordIndexes = new Set();
        this.swords = swords;
        this.maxUpgradableIndex = this.swords.length - 1;
    }
    get current_sword_index() {
        return this._current_sword_index;
    }
    set current_sword_index(value) {
        value = Math.min(Math.max(value, 0), this.maxUpgradableIndex);
        this._current_sword_index = value;
        this.notify(this.swordContext);
    }
    get swordContext() {
        return {
            type: ContextType.SWORD,
            index: this._current_sword_index,
            sword: this.getCalculatedCurrentSword(),
            isMax: this._current_sword_index >= this.maxUpgradableIndex
        };
    }
    get foundSwordsContext() {
        const items = [];
        for (let i = 0; i <= this.maxUpgradableIndex; i++) {
            if (this.foundSwordIndexes.has(i))
                items.push(this.swords[i].toItem());
            else
                items.push(new UnknownItem());
        }
        return {
            type: ContextType.FOUND_SWORDS,
            count: this.foundSwordIndexes.size,
            swords: items
        };
    }
    getSwordWithId(id) {
        const res = this.swords.find(sword => sword.id == id);
        if (res === undefined)
            throw new Error(`Sword with ID ${id} not found.`);
        return res;
    }
    getSwordWithIdx(index) {
        const res = this.swords[index];
        if (res === undefined)
            throw new Error(`Sword with Index ${index} not found.`);
        return res;
    }
    getCalculatedSwordWithId(id) {
        const sword = this.getSwordWithId(id);
        return new Sword(sword.id, sword.name, sword.imgSrc, Game.statManager.calculate(StatID.LUCKY_BRACELET, sword.prob), Game.statManager.calculate(StatID.SMITH, sword.cost), Game.statManager.calculate(StatID.BIG_MERCHANT, sword.price), sword.requiredRepairs, sword.canSave, sword.pieces.map(piece => new Piece(piece.id, piece.name, piece.imgSrc, piece.prob, Game.statManager.calculate(StatID.MAGIC_HAT, piece.maxDrop))));
    }
    getCalculatedSwordWithIdx(index) {
        const sword = this.getSwordWithIdx(index);
        return new Sword(sword.id, sword.name, sword.imgSrc, Game.statManager.calculate(StatID.LUCKY_BRACELET, sword.prob), Game.statManager.calculate(StatID.SMITH, sword.cost), Game.statManager.calculate(StatID.BIG_MERCHANT, sword.price), sword.requiredRepairs, sword.canSave, sword.pieces.map(piece => new Piece(piece.id, piece.name, piece.imgSrc, piece.prob, Game.statManager.calculate(StatID.MAGIC_HAT, piece.maxDrop))));
    }
    getIndex(id) {
        return this.swords.indexOf(this.getSwordWithId(id));
    }
    calculateLoss(index) {
        return this.swords.slice(0, index + 1).reduce((pre, cur) => pre += Game.statManager.calculate(StatID.SMITH, cur.cost), 0);
    }
    isFound(value) {
        switch (typeof value) {
            case "number": return this.foundSwordIndexes.has(value);
            case "string": return this.foundSwordIndexes.has(this.getIndex(value));
        }
    }
    findSword(index) {
        if (!this.isFound(index)) {
            this.foundSwordIndexes.add(index);
            Game.statManager.addStatPoint();
        }
    }
    jumpTo(index) {
        index = Math.min(Math.max(index, 0), this.maxUpgradableIndex);
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
        return this.getSwordWithIdx(Math.min(this.current_sword_index + 1, this.maxUpgradableIndex));
    }
    tryUpgrade() {
        const sword = this.getCalculatedCurrentSword();
        if (this.current_sword_index >= this.maxUpgradableIndex)
            return { result: SwordTestResult.REJECTED_BY_MAX_UPGRADE, result_index: this.current_sword_index };
        if (!Game.inventoryManager.hasMoney(sword.cost))
            return { result: SwordTestResult.REJECTED_BY_MONEY_LACK, result_index: this.current_sword_index };
        Game.inventoryManager.takeMoney(sword.cost, {
            type: ContextType.SWORD_UPGRADE,
            name: sword.name,
            cost: sword.cost
        });
        if (Game.developerMod.alwaysSuccess || Math.random() < sword.prob) {
            if (Math.random() < Game.statManager.calculate(StatID.GOD_HAND)) {
                this.upgradeSword(2);
                return { result: SwordTestResult.GREAT_SUCCESS, result_index: this.current_sword_index };
            }
            else {
                this.upgradeSword();
                return { result: SwordTestResult.SUCCESS, result_index: this.current_sword_index };
            }
        }
        else {
            const dropped_pieces = sword.pieces.map(piece => piece.drop()).filter(piece => piece.count > 0);
            dropped_pieces.forEach(piece => Game.inventoryManager.save(piece));
            if (Math.random() < Game.statManager.calculate(StatID.INVALIDATED_SPHERE) / 100) {
                this.upgradeSword(0);
                Game.inventoryManager.saveMoney(sword.cost, {
                    type: ContextType.SWORD_RESTORE,
                    name: sword.name,
                    cost: sword.cost
                });
                return { result: SwordTestResult.FAIL_BUT_INVALIDATED, result_index: this.current_sword_index, dropped_pieces: dropped_pieces };
            }
            else
                return { result: SwordTestResult.FAIL, result_index: this.current_sword_index, dropped_pieces: dropped_pieces, sword: sword };
        }
    }
}

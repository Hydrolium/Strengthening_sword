import { ContextType } from '../other/context.js';
import { Observer, Storage, SwordItem, PieceItem, MoneyItem, RepairPaperItem } from '../other/entity.js';
import { Game } from '../other/main.js';
export class InventoryManager extends Observer {
    constructor() {
        super(...arguments);
        this.swords = new Storage(this, SwordItem, () => Game.developerMod.infinityMaterial);
        this.pieces = new Storage(this, PieceItem, () => Game.developerMod.infinityMaterial);
        this._money = 0;
        this.repairPaper = 0;
    }
    get money() {
        return this._money;
    }
    set money(m) {
        this.notify({
            type: ContextType.MONEY_CHANGE,
            changedMoney: m - this._money,
            havingMoney: m
        });
        this._money = m;
    }
    get inventoryContext() {
        return {
            type: ContextType.INVENTORY,
            swords: this.swords,
            pieces: this.pieces,
            repairPapers: this.repairPaper
        };
    }
    hasMoney(money) {
        return this.money >= money;
    }
    saveMoney(money, context) {
        this.money += money;
        this.notify(context);
    }
    takeMoney(money, context) {
        this.money -= money;
        this.notify(context);
    }
    setMoney(money, context) {
        this.money = money;
        this.notify(context);
    }
    getMoney() {
        return this.money;
    }
    hasRepairPaper(repair_paper) {
        return this.repairPaper >= repair_paper;
    }
    saveRepairPaper(repair_paper) {
        this.repairPaper += repair_paper;
    }
    takeRepairPaper(repair_paper) {
        this.repairPaper -= repair_paper;
    }
    getRepairPaper() {
        return this.repairPaper;
    }
    hasItems(items) {
        for (const item of items) {
            if (item instanceof MoneyItem
                && !this.hasMoney(item.count))
                return false;
            else if (item instanceof SwordItem
                && !this.swords.hasEnough(item.id, item.count))
                return false;
            else if (item instanceof PieceItem
                && !this.pieces.hasEnough(item.id, item.count))
                return false;
            else if (item instanceof RepairPaperItem
                && !this.hasRepairPaper(item.count))
                return false;
        }
        return true;
    }
    take(item) {
        if (item instanceof SwordItem)
            this.swords.remove(item.id, item.count);
        else if (item instanceof PieceItem)
            this.pieces.remove(item.id, item.count);
    }
    save(item) {
        if (item instanceof SwordItem)
            this.swords.add(item);
        else if (item instanceof PieceItem)
            this.pieces.add(item);
    }
    sellSword(id) {
        if (this.swords.hasEnough(id, 1)) {
            const sword = Game.swordManager.getCalculatedSwordWithId(id);
            this.saveMoney(sword.price, {
                type: ContextType.SWORD_SELL,
                name: sword.name,
                price: sword.price
            });
            this.swords.remove(id, 1);
        }
    }
    swapSword(id) {
        if (this.swords.hasEnough(id, 1)) {
            const sword = Game.swordManager.getCalculatedCurrentSword();
            if (sword.canSave) {
                this.save(sword.toItem());
            }
            this.swords.remove(id, 1);
            Game.swordManager.jumpTo(Game.swordManager.getIndex(id));
            Game.mainScreen.show(Game.swordManager.swordContext);
        }
    }
    breakSword(id) {
        if (this.swords.hasEnough(id, 1)) {
            const pieces = Game.swordManager.getCalculatedSwordWithId(id).pieces.map(piece => piece.drop()).filter(pieceItem => pieceItem.count > 0);
            this.swords.remove(id, 1);
            pieces.forEach(piece => this.save(piece));
            return pieces;
        }
        return [];
    }
    getPieces() {
        return this.pieces;
    }
    getSwords() {
        return this.swords;
    }
}

import { ContextType, GameContext, InventoryContext } from '../other/context.js';
import { Observer, Storage, Item, SwordItem, PieceItem, MoneyItem, RepairPaperItem } from '../other/entity.js';
import { Game } from '../other/main.js';

export class InventoryManager extends Observer {

    private swords: Storage<SwordItem> = new Storage<SwordItem>(this, SwordItem, () => Game.developerMod.infinityMaterial);
    private pieces: Storage<PieceItem> = new Storage<PieceItem>(this, PieceItem, () => Game.developerMod.infinityMaterial);

    private _money: number = 0;

    private repairPaper: number = 0;

    private get money(): number {
        return this._money;
    }

    private set money(m: number) {

        this.notify({
            type: ContextType.MONEY_CHANGE,
            changedMoney: m - this._money,
            havingMoney: m
        });

        this._money = m;
    }

    get inventoryContext(): InventoryContext {
        return {
            type: ContextType.INVENTORY,
            swords: this.swords,
            pieces: this.pieces,
            repairPapers: this.repairPaper
        };
    }

    hasMoney(money: number): boolean {
        return this.money >= money;
    }
    saveMoney(money: number, context: GameContext) {
        this.money += money;
        this.notify(context);
    }
    takeMoney(money: number, context: GameContext) {
        this.money -= money;
        this.notify(context);
    }
    setMoney(money: number, context: GameContext) {
        this.money = money;
        this.notify(context);
    }
    getMoney(): number {
        return this.money;
    }

    hasRepairPaper(repair_paper: number): boolean {
        return this.repairPaper >= repair_paper;
    }
    saveRepairPaper(repair_paper: number) {
        this.repairPaper += repair_paper;
    }
    takeRepairPaper(repair_paper: number) {
        this.repairPaper -= repair_paper;
    }
    getRepairPaper(): number {
        return this.repairPaper;
    }

    hasItems(items: Item[]): boolean {
        for(const item of items) {
            if(
                item instanceof MoneyItem
                && !this.hasMoney(item.count)
            ) return false;
            else if (
                item instanceof SwordItem
                && !this.swords.hasEnough(item.id, item.count)
            ) return false;
            else if (
                item instanceof PieceItem
                && !this.pieces.hasEnough(item.id, item.count)
            ) return false;
            else if (
                item instanceof RepairPaperItem
                && !this.hasRepairPaper(item.count)
            ) return false;
        }
        return true;
    }


    take(item: SwordItem | PieceItem) {
        if (item instanceof SwordItem) this.swords.remove(item.id, item.count);
        else if (item instanceof PieceItem) this.pieces.remove(item.id, item.count);
    }

    save(item: SwordItem | PieceItem) {
        if (item instanceof SwordItem) this.swords.add(item);
        else if (item instanceof PieceItem) this.pieces.add(item);
    }

    sellSword(id: string) {

        if(this.swords.hasEnough(id, 1)) {
            
            const sword = Game.swordManager.getCalculatedSwordWithId(id);

            this.saveMoney(sword.price, {
                type: ContextType.SWORD_SELL,
                name: sword.name,
                price: sword.price
            })

            this.swords.remove(id, 1);
        }
    }

    swapSword(id: string) {
        if(this.swords.hasEnough(id, 1)) {

            const sword = Game.swordManager.getCalculatedCurrentSword()
            if(sword.canSave) {
                this.save(sword.toItem());
            }

            this.swords.remove(id, 1);
            
            Game.swordManager.jumpTo(Game.swordManager.getIndex(id));
            Game.mainScreen.show(Game.swordManager.swordContext);

        }
    }

    breakSword(id: string): PieceItem[] {
        if(this.swords.hasEnough(id, 1)) {

            const pieces = Game.swordManager.getCalculatedSwordWithId(id).pieces.map(piece => piece.drop()).filter(pieceItem => pieceItem.count > 0);

            this.swords.remove(id, 1);
            pieces.forEach(piece => this.save(piece));

            return pieces;
        }

        return [];
    }

    getPieces(): Storage<PieceItem> {
        return this.pieces;
    }

    getSwords(): Storage<SwordItem> {
        return this.swords;
    }
}
import { ContextType, GameContext, InventoryContext } from '../other/context.js';
import { Observer, Storage, Item, SwordItem, PieceItem, MoneyItem, RepairPaperItem, StorageInfo } from '../other/entity.js';
import { Game } from '../other/main.js';

export class InventoryManager extends Observer {

    private swordStorage: Storage<SwordItem> = new Storage<SwordItem>(this, SwordItem, () => Game.developerMod.infinityMaterial);
    private pieceStorage: Storage<PieceItem> = new Storage<PieceItem>(this, PieceItem, () => Game.developerMod.infinityMaterial);

    private _money: number = 0;

    private _repairPaperCount: number = 0;

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

    public get inventoryContext(): InventoryContext {
        return {
            type: ContextType.INVENTORY,
            swordStorage: this.swordStorage,
            pieceStorage: this.pieceStorage,
            repairPapers: this._repairPaperCount
        };
    }

    public hasMoney(money: number): boolean {
        return this.money >= money;
    }
    public saveMoney(money: number, context: GameContext) {
        this.money += money;
        this.notify(context);
    }
    public takeMoney(money: number, context: GameContext) {
        this.money -= money;
        this.notify(context);
    }
    public setMoney(money: number, context: GameContext) {
        this.money = money;
        this.notify(context);
    }
    public getMoney(): number {
        return this.money;
    }

    public hasRepairPaper(repair_paper: number): boolean {
        return this._repairPaperCount >= repair_paper;
    }
    public saveRepairPaper(repair_paper: number) {
        this._repairPaperCount += repair_paper;
    }
    public takeRepairPaper(repair_paper: number) {
        this._repairPaperCount -= repair_paper;
    }
    public getRepairPaper(): number {
        return this._repairPaperCount;
    }

    public hasItems(items: readonly Item[]): boolean {
        for(const item of items) {
            if(
                item instanceof MoneyItem
                && !this.hasMoney(item.count)
            ) return false;
            else if (
                item instanceof SwordItem
                && !this.swordStorage.hasEnough(item.id, item.count)
            ) return false;
            else if (
                item instanceof PieceItem
                && !this.pieceStorage.hasEnough(item.id, item.count)
            ) return false;
            else if (
                item instanceof RepairPaperItem
                && !this.hasRepairPaper(item.count)
            ) return false;
        }
        return true;
    }

    public take(item: SwordItem | PieceItem | RepairPaperItem) {
        if (item instanceof SwordItem) this.swordStorage.remove(item.id, item.count);
        else if (item instanceof PieceItem) this.pieceStorage.remove(item.id, item.count);
        else if (item instanceof RepairPaperItem) this.saveRepairPaper(item.count);
    }

    public save(item: SwordItem | PieceItem | RepairPaperItem) {
        if (item instanceof SwordItem) this.swordStorage.add(item);
        else if (item instanceof PieceItem) this.pieceStorage.add(item);
        else if (item instanceof RepairPaperItem) this.saveRepairPaper(item.count);
    }

    public sellSword(id: string) {

        if(this.swordStorage.hasEnough(id, 1)) {
            
            const sword = Game.swordManager.getCalculatedSwordWithId(id);

            this.saveMoney(sword.price, {
                type: ContextType.SWORD_SELL,
                name: sword.name,
                price: sword.price
            })

            this.swordStorage.remove(id, 1);
        }
    }

    public swapSword(id: string) {
        if(this.swordStorage.hasEnough(id, 1)) {

            const sword = Game.swordManager.getCalculatedCurrentSword()
            if(sword.canSave) {
                this.save(sword.toItem());
            }

            this.swordStorage.remove(id, 1);
            
            Game.swordManager.jumpTo(Game.swordManager.getIndex(id));
            Game.mainScreen.show(Game.swordManager.swordContext);

        }
    }

    public breakSword(id: string): readonly PieceItem[] {
        if(this.swordStorage.hasEnough(id, 1)) {

            const pieces = Game.swordManager.getCalculatedSwordWithId(id).pieces.map(piece => piece.drop()).filter(pieceItem => pieceItem.count > 0);

            this.swordStorage.remove(id, 1);
            pieces.forEach(piece => this.save(piece));

            return pieces;
        }

        return [];
    }

    public getPieces(): StorageInfo<PieceItem> {
        return this.pieceStorage;
    }

    public getSwords(): StorageInfo<SwordItem> {
        return this.swordStorage;
    }
}
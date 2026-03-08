import { MoneyChangeReason, ScreenRenderingContextType } from '../context/rendering/screen_rendering_context.js';
import { ScreenShowingContextType } from '../context/rendering/screen_showing_context.js';
import { InventoryUpdateContext, InventoryUpdateContextType } from '../context/updating/inventory_update_context.js';
import { Observer, Storage, Item, SwordItem, PieceItem, MoneyItem, RepairPaperItem, StorageInfo } from '../other/entity.js';

export class InventoryManager extends Observer {

    private _swordStorage: Storage<SwordItem> = new Storage<SwordItem>(SwordItem);
    private _pieceStorage: Storage<PieceItem> = new Storage<PieceItem>(PieceItem);

    private _money: number = 0;

    private _repairPaperCount: number = 0;

    public update(context: InventoryUpdateContext) {

        switch(context.type) {
        case InventoryUpdateContextType.SWORD_UPGRADE:
            this.takeMoney(context.cost);
            this.notify({
                type: ScreenRenderingContextType.MONEY_DISPLAY_RENDERING_CONTEXT,
                deltaMoney: -context.cost,
                havingMoney: this.getMoney()
            });
            this.notify({
                type: ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT,
                reason: MoneyChangeReason.SWORD_UPGRADE,
                cost: context.cost,
                name: context.name
            });
            break;
        case InventoryUpdateContextType.SWORD_RESTORE:
            this.saveMoney(context.cost);
            this.notify({
                type: ScreenRenderingContextType.MONEY_DISPLAY_RENDERING_CONTEXT,
                deltaMoney: context.cost,
                havingMoney: this.getMoney()
            });
            this.notify({
                type: ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT,
                reason: MoneyChangeReason.SWORD_RESTORE,
                cost: context.cost,
                name: context.name
            });
            break;
        case InventoryUpdateContextType.SWORD_BREAK:
            context.pieces.forEach(piece => this.save(piece));
            this.takeMoney(context.cost);
            this.notify({
                type: ScreenRenderingContextType.MONEY_DISPLAY_RENDERING_CONTEXT,
                deltaMoney: -context.cost,
                havingMoney: this.getMoney()
            });
            this.notify({
                type: ScreenRenderingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT,
                pieceStorage: this.getPieces(),
                repairPapers: this.getRepairPaper(),
                swordStorage: this.getSwords()
            });
            this.notify({
                type: ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT,
                reason: MoneyChangeReason.SWORD_UPGRADE,
                cost: context.cost,
                name: context.name
            });
            break;
        case InventoryUpdateContextType.SWORD_SELL:
            this.saveMoney(context.price);
            this.notify({
                type: ScreenRenderingContextType.MONEY_DISPLAY_RENDERING_CONTEXT,
                deltaMoney: context.price,
                havingMoney: this.getMoney()
            });
            this.notify({
                type: ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT,
                reason: MoneyChangeReason.SWORD_SELL,
                price: context.price,
                name: context.name
            });
            break;
        case InventoryUpdateContextType.ITEM_SAVE:
            this.save(context.item);
            this.notify({
                type: ScreenRenderingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT,
                pieceStorage: this.getPieces(),
                repairPapers: this.getRepairPaper(),
                swordStorage: this.getSwords()
            });
            break;
        case InventoryUpdateContextType.ITEM_TAKE:
            this.take(context.item);
            this.notify({
                type: ScreenRenderingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT,
                pieceStorage: this.getPieces(),
                repairPapers: this.getRepairPaper(),
                swordStorage: this.getSwords()
            });
            break;
        case InventoryUpdateContextType.BUY_USING_MONEY:
            this.takeMoney(context.price);
            this.notify({
                type: ScreenRenderingContextType.MONEY_DISPLAY_RENDERING_CONTEXT,
                deltaMoney: -context.price,
                havingMoney: this.getMoney()
            });
            this.notify({
                type: ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT,
                reason: MoneyChangeReason.BUY_USING_MONEY,
                price: context.price,
                count: context.count,
                resultName: context.resultName
            });
            break;
        case InventoryUpdateContextType.SWORD_ITEM_SELL:
            this._money += context.price;
            this._swordStorage.remove(context.id, 1);
            this.notify({
                type: ScreenRenderingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT,
                pieceStorage: this.getPieces(),
                repairPapers: this.getRepairPaper(),
                swordStorage: this.getSwords()
            });
            this.notify({
                type: ScreenRenderingContextType.MONEY_DISPLAY_RENDERING_CONTEXT,
                deltaMoney: context.price,
                havingMoney: this.getMoney()
            });
            this.notify({
                type: ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT,
                reason: MoneyChangeReason.SWORD_SELL,
                price: context.price,
                name: context.name
            });
            break;
        case InventoryUpdateContextType.SWORD_ITEM_BREAK:
            this.take(context.swordItem);
            context.pieceItems.forEach(pieceitem => this.save(pieceitem));
            this.notify({
                type: ScreenRenderingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT,
                pieceStorage: this.getPieces(),
                repairPapers: this.getRepairPaper(),
                swordStorage: this.getSwords()
            });
            break;
        case InventoryUpdateContextType.SWORD_ITEM_SWAP:
            if(context.sword.canSave) this.save(context.sword.toItem());
            this.take(context.swordItem);

            this.notify({
                type: ScreenRenderingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT,
                pieceStorage: this.getPieces(),
                repairPapers: this.getRepairPaper(),
                swordStorage: this.getSwords()
            });
            break;
        case InventoryUpdateContextType.SYSTEM_MONEY_GIFT:
            this.setMoney(context.money);
            this.notify({
                type: ScreenRenderingContextType.MONEY_DISPLAY_RENDERING_CONTEXT,
                deltaMoney: context.money,
                havingMoney: context.money
            });
            this.notify({
                type: ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT,
                reason: MoneyChangeReason.SYSTEM_MONEY_GIFT,
                money: context.money
            });
            break;
        }
    }

    public hasMoney(money: number): boolean {
        return this._money >= money;
    }
    public getMoney(): number {
        return this._money;
    }
    private setMoney(money: number) {
        this._money = money;
    }
    private saveMoney(money: number) {
        this._money += money;
    }
    private takeMoney(money: number) {
        this._money -= money;
    }
 

    public hasRepairPaper(repair_paper: number): boolean {
        return this._repairPaperCount >= repair_paper;
    }
    public getRepairPaper(): number {
        return this._repairPaperCount;
    }
    private saveRepairPaper(repair_paper: number) {
        this._repairPaperCount += repair_paper;
    }
    private takeRepairPaper(repair_paper: number) {
        this._repairPaperCount -= repair_paper;
    }

    public hasItem(item: Item): boolean {
        if(
            item instanceof MoneyItem
            && !this.hasMoney(item.count)
        ) return false;
        else if (
            item instanceof SwordItem
            && !this._swordStorage.hasEnough(item.id, item.count)
        ) return false;
        else if (
            item instanceof PieceItem
            && !this._pieceStorage.hasEnough(item.id, item.count)
        ) return false;
        else if (
            item instanceof RepairPaperItem
            && !this.hasRepairPaper(item.count)
        ) return false;

        return true;
    }

    public hasItems(items: readonly Item[]): boolean {
        return items.every(item => this.hasItem(item));
    }

    private take(item: SwordItem | PieceItem | RepairPaperItem) {
        if (item instanceof SwordItem) this._swordStorage.remove(item.id, item.count);
        else if (item instanceof PieceItem) this._pieceStorage.remove(item.id, item.count);
        else if (item instanceof RepairPaperItem) this.takeRepairPaper(item.count);
    }

    private save(item: SwordItem | PieceItem | RepairPaperItem) {
        if (item instanceof SwordItem) this._swordStorage.add(item);
        else if (item instanceof PieceItem) this._pieceStorage.add(item);
        else if (item instanceof RepairPaperItem) this.saveRepairPaper(item.count);
    }

    public getPieces(): StorageInfo<PieceItem> {
        return this._pieceStorage;
    }

    public getSwords(): StorageInfo<SwordItem> {
        return this._swordStorage;
    }
}
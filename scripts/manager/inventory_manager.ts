import { MoneyChangeReason, ScreenDrawingContextType } from '../context/rendering/screen_rendering_context.js';
import { BuyUsingMoneyContext, InventoryUpdateContext, InventoryUpdateContextType, ItemSaveContext, ItemTakeContext, SwordBreakContext, SwordItemBreakContext, SwordItemSellContext, SwordItemSwapContext, SwordRestoreContext, SwordSellContext, SwordUpgradeContext, SystemMoneyGiftContext } from '../context/updating/inventory_update_context.js';
import { Observer, Storage, Item, SwordItem, PieceItem, MoneyItem, RepairPaperItem, StorageInfo } from '../other/entity.js';

export class InventoryManager extends Observer {

    readonly target: ReadonlySet<ScreenDrawingContextType> = new Set([
        ScreenDrawingContextType.MONEY_DISPLAY_RENDERING_CONTEXT,
        ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT,
        ScreenDrawingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT
    ]);
    

    private _swordStorage: Storage<SwordItem> = new Storage<SwordItem>(SwordItem);
    private _pieceStorage: Storage<PieceItem> = new Storage<PieceItem>(PieceItem);

    private _money: number = 0;

    private _repairPaperCount: number = 0;

    private notifyMoneyChanged(deltaMoney: number) {
        this.notifyDrawing({
            type: ScreenDrawingContextType.MONEY_DISPLAY_RENDERING_CONTEXT,
            deltaMoney: deltaMoney,
            havingMoney: this.getMoney()
        });
    }
    private notifyInventoryChanged() {
        this.notifyDrawing({
            type: ScreenDrawingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT,
            pieceStorage: this.getPieces(),
            repairPapers: this.getRepairPaper(),
            swordStorage: this.getSwords()
        });
    }

    private handlers: Partial<Record<InventoryUpdateContextType, (context: any) => void>> = {
        [InventoryUpdateContextType.SWORD_UPGRADE]: (context: SwordUpgradeContext) => {
            this.takeMoney(context.cost);
            this.notifyMoneyChanged(-context.cost);
            this.notifyDrawing({
                type: ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT,
                reason: MoneyChangeReason.SWORD_UPGRADE,
                cost: context.cost,
                name: context.name
            });
        },
        [InventoryUpdateContextType.SWORD_RESTORE]: (context: SwordRestoreContext) => {
            this.saveMoney(context.cost);
            this.notifyMoneyChanged(context.cost);
            this.notifyDrawing({
                type: ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT,
                reason: MoneyChangeReason.SWORD_RESTORE,
                cost: context.cost,
                name: context.name
            });
        },
        [InventoryUpdateContextType.SWORD_BREAK]: (context: SwordBreakContext) => {
            context.pieces.forEach(piece => this.save(piece));
            this.takeMoney(context.cost);
            this.notifyMoneyChanged(-context.cost);
            this.notifyInventoryChanged();
            this.notifyDrawing({
                type: ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT,
                reason: MoneyChangeReason.SWORD_UPGRADE,
                cost: context.cost,
                name: context.name
            });
        },
        [InventoryUpdateContextType.SWORD_SELL]: (context: SwordSellContext) => {
            this.saveMoney(context.price);
            this.notifyMoneyChanged(context.price);
            this.notifyDrawing({
                type: ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT,
                reason: MoneyChangeReason.SWORD_SELL,
                price: context.price,
                name: context.name
            });
        },
        [InventoryUpdateContextType.ITEM_SAVE]: (context: ItemSaveContext) => {
            this.save(context.item);
            this.notifyInventoryChanged();
        },
        [InventoryUpdateContextType.ITEM_TAKE]: (context: ItemTakeContext) => {
            this.take(context.item);
            this.notifyInventoryChanged();
        },
        [InventoryUpdateContextType.BUY_USING_MONEY]: (context: BuyUsingMoneyContext) => {
            this.takeMoney(context.price);
            this.notifyMoneyChanged(-context.price);
            this.notifyDrawing({
                type: ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT,
                reason: MoneyChangeReason.BUY_USING_MONEY,
                price: context.price,
                count: context.count,
                resultName: context.resultName
            });
        },
        [InventoryUpdateContextType.SWORD_ITEM_SELL]: (context: SwordItemSellContext) => {
            this.saveMoney(context.price);
            this._swordStorage.remove(context.id, 1);
            this.notifyMoneyChanged(context.price);
            this.notifyInventoryChanged();
            this.notifyDrawing({
                type: ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT,
                reason: MoneyChangeReason.SWORD_SELL,
                price: context.price,
                name: context.name
            });
        },
        [InventoryUpdateContextType.SWORD_ITEM_BREAK]: (context: SwordItemBreakContext) => {
            this.take(context.swordItem);
            context.pieceItems.forEach(pieceitem => this.save(pieceitem));
            this.notifyInventoryChanged();

        },
        [InventoryUpdateContextType.SWORD_ITEM_SWAP]: (context: SwordItemSwapContext) => {
            if(context.sword.canSave) this.save(context.sword.toItem());
            this.take(context.swordItem);

            this.notifyInventoryChanged();

        },
        [InventoryUpdateContextType.SYSTEM_MONEY_GIFT]: (context: SystemMoneyGiftContext) => {
            this.setMoney(context.money);
            this.notifyMoneyChanged(context.money);
            this.notifyDrawing({
                type: ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT,
                reason: MoneyChangeReason.SYSTEM_MONEY_GIFT,
                money: context.money
            });
        }
    } as const;

    public update(context: InventoryUpdateContext) {
        this.handlers[context.type]?.(context);
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
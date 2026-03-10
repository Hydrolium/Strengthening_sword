import { ScreenRenderingContextType } from "../context/rendering/screen_rendering_context";
import { ScreenShowingContextType } from "../context/rendering/screen_showing_context";
import { InventoryUpdateContextType } from "../context/updating/inventory_update_context";
import { SwordUpdateContextType } from "../context/updating/sword_update_context";
import { InventoryManager } from "../manager/inventory_manager";
import { ScreenManager } from "../manager/screen_manager";
import { StatManager } from "../manager/stat_manager";
import { SwordManager } from "../manager/sword_manager";
import { PieceItem, SwordItem } from "../other/entity";
import { SwordDB } from "../db/sword_db";
import { InventoryScreen } from "../screen/inventory_screen";
import { MainScreen } from "../screen/main_screen";
import { CalculatedSwordDB } from "../db/calculated_sword_db";

export interface InventoryScreenActions {
    onSwordItemSell: (swordItem: SwordItem) => void;
    onSwordItemBreak: (swordItem: SwordItem) => void;
    onSwordSwap: (swordItem: SwordItem) => void;
    onSwordsByPieceSearch: (pieceItem: PieceItem) => void;
}


export class InventoryScreenEventController implements InventoryScreenActions { 

    private readonly _swordDB: CalculatedSwordDB;

    constructor(
        _swordDB: SwordDB,
        private readonly _swordManager: SwordManager,
        private readonly _inventoryManager: InventoryManager,
        _statManager: StatManager,
        private readonly _screenManager: ScreenManager,

        private readonly _mainScreen: MainScreen,
        private readonly _inventoryScreen: InventoryScreen,
    ) {
        this._swordDB = new CalculatedSwordDB(_swordDB, _swordManager, _statManager);
    }
    
    public onSwordItemSell = (swordItem: SwordItem) => {

        this._inventoryScreen.popupSwordItemSellMessage(this._swordDB.getCalculatedSwordbyId(swordItem.id), popup => {

            if(this._inventoryManager.hasItem(swordItem)) {
                const sword = this._swordDB.getCalculatedSwordbyId(swordItem.id);
                this._inventoryManager.update({
                    type: InventoryUpdateContextType.SWORD_ITEM_SELL,
                    id: sword.id,
                    name: sword.name,
                    price: sword.price
                })
            }
            popup.close();
        });
    }

    public onSwordItemBreak = (swordItem: SwordItem) => {

        this._inventoryScreen.popupSwordItemBreakMessage(this._swordDB.getCalculatedSwordbyId(swordItem.id), () => {

            let pieceItems: PieceItem[] = [];
            if(this._inventoryManager.hasItem(swordItem)) {
    
                pieceItems = this._swordDB.getCalculatedSwordbyId(swordItem.id).pieces.map(piece => piece.drop()).filter(pieceItem => pieceItem.count > 0);
    
                this._inventoryManager.update({
                    type: InventoryUpdateContextType.SWORD_ITEM_BREAK,
                    swordItem: swordItem,
                    pieceItems: pieceItems
                })
            }

            this._inventoryScreen.popupBreakMessage(pieceItems);
        });

    }

    public onSwordSwap = (swordItem: SwordItem) => {
    
        if(this._inventoryManager.hasItem(swordItem)) {

            const sword = this._swordDB.getCalculatedSwordbyIndex(this._swordManager.currentSwordIndex);

            this._inventoryManager.update({
                type: InventoryUpdateContextType.SWORD_ITEM_SWAP,
                swordItem: swordItem,
                sword: sword
            });
            
            this._swordManager.update({
                type: SwordUpdateContextType.SWORD_CHANGE,
                maxUpgradableIndex: this._swordDB.maxUpgradableIndex,
                sword: this._swordDB.getCalculatedSwordbyId(swordItem.id)
            });

            const cs = this._swordDB.getCalculatedSwordbyIndex(this._swordManager.currentSwordIndex);

            this._screenManager.update({
                type: ScreenShowingContextType.MAIN_SCREEN_SHOWING_CONTEXT,
                renderingContext: {
                    type: ScreenRenderingContextType.MAIN_SCREEN_RENDERING_CONTEXT,
                    isMax: cs.index >= this._swordDB.maxUpgradableIndex,
                    sword: cs
                }
            });
        }
    }

    public onSwordsByPieceSearch = (pieceItem: PieceItem) => {
        this._inventoryScreen.popupWherePieceDroppedMessage(
            pieceItem, this._swordDB.getCalculatedSwordsByPieceId(pieceItem.id), this._swordManager.getFoundSwordIndexes()
        );
    }

}
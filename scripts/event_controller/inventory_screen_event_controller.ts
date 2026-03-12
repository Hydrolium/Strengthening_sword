import { ScreenDrawingContextType } from "../context/rendering/screen_drawing_context";
import { ScreenShowingContextType } from "../context/rendering/screen_showing_context";
import { InventoryUpdateContextType } from "../context/updating/inventory_update_context";
import { SwordUpdateContextType } from "../context/updating/sword_update_context";
import { SwordItem } from "../define/object/item";
import { PieceItem } from "../define/object/item";
import { CalculatedSwordDB } from "../define/calculated_sword_db";
import { Managers } from "../manager/manager";

export interface InventoryScreenActions {
    onSwordItemSell: (swordItem: SwordItem) => void;
    onSwordItemBreak: (swordItem: SwordItem) => void;
    onSwordSwap: (swordItem: SwordItem) => void;
    onSwordsByPieceSearch: (pieceItem: PieceItem) => void;
}


export class InventoryScreenEventController implements InventoryScreenActions { 

    constructor(
        private readonly _swordDB: CalculatedSwordDB,
        private readonly _managers: Managers
    ) { }
    
    public onSwordItemSell = (swordItem: SwordItem) => {

        this._managers.screenManager.update({
            type: ScreenDrawingContextType.ASKING_SWORD_ITEM_SELL_CONTEXT,
            sword: this._swordDB.getCalculatedSwordbyId(swordItem.id),
            sellFunc: popup => {

                if(this._managers.inventoryManager.hasItem(swordItem)) {
                    const sword = this._swordDB.getCalculatedSwordbyId(swordItem.id);
                    this._managers.inventoryManager.update({
                        type: InventoryUpdateContextType.SWORD_ITEM_SELL,
                        id: sword.id,
                        name: sword.name,
                        price: sword.price
                    })
                }
                popup.close();
            }
        });

    }

    public onSwordItemBreak = (swordItem: SwordItem) => {

        this._managers.screenManager.update({
            type: ScreenDrawingContextType.ASKING_SWORD_ITEM_BREAK_CONTEXT,
            sword: this._swordDB.getCalculatedSwordbyId(swordItem.id),
            breakFunc: () => {

                let pieceItems: PieceItem[] = [];
                if(this._managers.inventoryManager.hasItem(swordItem)) {
        
                    pieceItems = this._swordDB.getCalculatedSwordbyId(swordItem.id).pieces.map(piece => piece.drop()).filter(pieceItem => pieceItem.count > 0);
        
                    this._managers.inventoryManager.update({
                        type: InventoryUpdateContextType.SWORD_ITEM_BREAK,
                        swordItem: swordItem,
                        pieceItems: pieceItems
                    });
                }
            }
        });

    }

    public onSwordSwap = (swordItem: SwordItem) => {
    
        if(this._managers.inventoryManager.hasItem(swordItem)) {

            const sword = this._swordDB.getCalculatedSwordbyIndex(this._managers.swordManager.currentSwordIndex);

            this._managers.inventoryManager.update({
                type: InventoryUpdateContextType.SWORD_ITEM_SWAP,
                swordItem: swordItem,
                sword: sword
            });
            
            this._managers.swordManager.update({
                type: SwordUpdateContextType.SWORD_CHANGE,
                maxUpgradableIndex: this._swordDB.maxUpgradableIndex,
                sword: this._swordDB.getCalculatedSwordbyId(swordItem.id)
            });

            const cs = this._swordDB.getCalculatedSwordbyIndex(this._managers.swordManager.currentSwordIndex);

            this._managers.screenManager.update({
                type: ScreenShowingContextType.MAIN_SCREEN_SHOWING_CONTEXT,
                renderingContext: {
                    type: ScreenDrawingContextType.MAIN_SCREEN_RENDERING_CONTEXT,
                    isMax: cs.index >= this._swordDB.maxUpgradableIndex,
                    sword: cs
                }
            });
        }
    }

    public onSwordsByPieceSearch = (pieceItem: PieceItem) => {
        this._managers.screenManager.update({
            type: ScreenDrawingContextType.WHERE_PIECE_DROPPED_CONTEXT,
            pieceItem: pieceItem,
            swords: this._swordDB.getCalculatedSwordsByPieceId(pieceItem.id),
            founds: this._managers.swordManager.getFoundSwordIndexes()
        });
    }
}
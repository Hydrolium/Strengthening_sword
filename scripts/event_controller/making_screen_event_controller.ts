import { ScreenDrawingContextType } from "../context/rendering/screen_drawing_context";
import { InventoryUpdateContextType } from "../context/updating/inventory_update_context";
import { MakingUpdateContextType } from "../context/updating/making_update_context";
import { StatUpdateContextType } from "../context/updating/stat_update_context";
import { SwordUpdateContextType } from "../context/updating/sword_update_context";
import { Recipe } from "../define/object/recipe";
import { MoneyItem, PieceItem } from "../define/object/item";
import { SwordItem } from "../define/object/item";
import { Managers } from "../manager/manager";
import { CalculatedSwordDB } from "../define/calculated_sword_db";

export interface MakingScreenActions {
    onMaking: (recipe: Recipe) => void;
    onClickListButton: () => void;
    onSwordInfoSearch: (swordId: string) => void;
    onPieceInfoSearch: (pieceItem: PieceItem) => void;
}

export class MakingScreenEventController implements MakingScreenActions {

    constructor(
        private readonly _swordDB: CalculatedSwordDB,
        private readonly _managers: Managers
    ) {}

    private make(recipe: Recipe) {

        if(!this._managers.inventoryManager.hasItems(recipe.materials)) return;

        if(recipe.result instanceof SwordItem) {
            const swordIndex = this._swordDB.getIndexById(recipe.result.id);
            if(!this._managers.swordManager.isFound(swordIndex)) {

                this._managers.swordManager.update({
                    type: SwordUpdateContextType.FINDING_NEW_SWORD_UPDATE,
                    index: swordIndex
                });

                this._managers.statManager.update({
                    type: StatUpdateContextType.GETTING_STAT_POINT
                });
            }
        }

        recipe.materials.forEach(material => {
            if(material instanceof MoneyItem)
                this._managers.inventoryManager.update({
                    type: InventoryUpdateContextType.BUY_USING_MONEY,
                    resultName: recipe.result.name,
                    count: recipe.result.count,
                    price: material.count
                });
            else
                this._managers.inventoryManager.update({
                    type: InventoryUpdateContextType.ITEM_TAKE,
                    item: material
                }); //나 한정훈 히히 
        });

        if(recipe.result instanceof SwordItem) {
            const swordIndex = this._swordDB.getIndexById(recipe.result.id)
            if(!this._managers.swordManager.isFound(swordIndex)) {
                this._managers.swordManager.update({
                    type: SwordUpdateContextType.FINDING_NEW_SWORD_UPDATE,
                    index: swordIndex
                });
                this._managers.statManager.update({
                    type: StatUpdateContextType.GETTING_STAT_POINT
                });
            }

        }

        this._managers.inventoryManager.update({
            type: InventoryUpdateContextType.ITEM_SAVE,
            item: recipe.result
        });

        this._managers.makingManager.update({
            type: MakingUpdateContextType.MAKING,
            foundSwordIds: new Set(Array.from(this._managers.swordManager.getFoundSwordIndexes(), index => this._swordDB.getIdByIndex(index))),
            havingPieces: this._managers.inventoryManager.getPieces(),
            havingSwords: this._managers.inventoryManager.getSwords(),
            money: this._managers.inventoryManager.getMoney(),
            repairPaperCount: this._managers.inventoryManager.getRepairPaper(),
            repairPaperRecipes: this._managers.makingManager.repairPaperRecipes,
            swordRecipes: this._managers.makingManager.swordRecipes
        });

    }
    
    public onMaking = (recipe: Recipe) => {

        if(this._managers.inventoryManager.hasItems(recipe.materials)) {
            this._managers.screenManager.update({
                type: ScreenDrawingContextType.MAKING_SCREEN_ANIMATING_CONTEXT,
                speed: (recipe.result instanceof SwordItem) ? 1200 : 700,
                onFinish: () => {
                        this.make(recipe);
                        if((recipe.result instanceof SwordItem)) this._managers.screenManager.update({ type: ScreenDrawingContextType.SWORD_CRAFTING_CONTEXT });
                    }
            });
        }
    }

    public onClickListButton = () => {
        this._managers.screenManager.update({
            type: ScreenDrawingContextType.MAKING_SCREEN_RENDERING_CONTEXT,
            foundSwordIds: new Set(Array.from(this._managers.swordManager.getFoundSwordIndexes(), index => this._swordDB.getIdByIndex(index))),
            havingPieces: this._managers.inventoryManager.getPieces(),
            havingSwords: this._managers.inventoryManager.getSwords(),
            money: this._managers.inventoryManager.getMoney(),
            repairPaperCount: this._managers.inventoryManager.getRepairPaper(),
            repairPaperRecipes: this._managers.makingManager.repairPaperRecipes,
            swordRecipes: this._managers.makingManager.swordRecipes
        })
    }

    public onSwordInfoSearch = (swordId: string) => {
        this._managers.screenManager.update({
            type: ScreenDrawingContextType.SWORD_INFO_CONTEXT,
            sword: this._swordDB.getCalculatedSwordbyId(swordId)
        });
    }

    public onPieceInfoSearch = (pieceItem: PieceItem) => {
        this._managers.screenManager.update({
            type: ScreenDrawingContextType.WHERE_PIECE_DROPPED_CONTEXT,
            pieceItem: pieceItem,
            swords: this._swordDB.getCalculatedSwordsByPieceId(pieceItem.id),
            founds: this._managers.swordManager.getFoundSwordIndexes()
        });
    }

}

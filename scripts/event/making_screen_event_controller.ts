import { ScreenDrawingContextType } from "../context/rendering/screen_rendering_context";
import { InventoryUpdateContextType } from "../context/updating/inventory_update_context";
import { MakingUpdateContextType } from "../context/updating/making_update_context";
import { StatUpdateContextType } from "../context/updating/stat_update_context";
import { SwordUpdateContextType } from "../context/updating/sword_update_context";
import { InventoryManager } from "../manager/inventory_manager";
import { MakingManager } from "../manager/making_manager";
import { ScreenManager } from "../manager/screen_manager";
import { StatManager } from "../manager/stat_manager";
import { SwordManager } from "../manager/sword_manager";
import { MoneyItem, Recipe, SwordItem } from "../other/entity";
import { SwordDB } from "../db/sword_db";
import { MakingScreen } from "../screen/screen/making_screen";

export interface MakingScreenActions {
    onMaking: (recipe: Recipe) => void;
    onClickListButton: () => void;
}

export class MakingScreenEventController implements MakingScreenActions {

    constructor(
        private readonly _swordDB: SwordDB,
        private readonly _swordManager: SwordManager,
        private readonly _inventoryManager: InventoryManager,
        private readonly _makingManager: MakingManager,
        private readonly _statManager: StatManager,
        private readonly _screenManager: ScreenManager,
        private readonly _makingScreen: MakingScreen,
    ) {}

    private make(recipe: Recipe) {

        if(!this._inventoryManager.hasItems(recipe.materials)) return;

        if(recipe.result instanceof SwordItem) {
            const swordIndex = this._swordDB.getIndexById(recipe.result.id);
            if(!this._swordManager.isFound(swordIndex)) {

                this._swordManager.update({
                    type: SwordUpdateContextType.FINDING_NEW_SWORD_UPDATE,
                    index: swordIndex
                });

                this._statManager.update({
                    type: StatUpdateContextType.GETTING_STAT_POINT
                });
            }
        }

        recipe.materials.forEach(material => {
            if(material instanceof MoneyItem)
                this._inventoryManager.update({
                    type: InventoryUpdateContextType.BUY_USING_MONEY,
                    resultName: recipe.result.name,
                    count: recipe.result.count,
                    price: material.count
                });
            else
                this._inventoryManager.update({
                    type: InventoryUpdateContextType.ITEM_TAKE,
                    item: material
                });
        });

        if(recipe.result instanceof SwordItem) {
            const swordIndex = this._swordDB.getIndexById(recipe.result.id)
            if(!this._swordManager.isFound(swordIndex)) {
                this._swordManager.update({
                    type: SwordUpdateContextType.FINDING_NEW_SWORD_UPDATE,
                    index: swordIndex
                });
                this._statManager.update({
                    type: StatUpdateContextType.GETTING_STAT_POINT
                });
            }

        }

        this._inventoryManager.update({
            type: InventoryUpdateContextType.ITEM_SAVE,
            item: recipe.result
        });

        this._makingManager.update({
            type: MakingUpdateContextType.MAKING,
            foundSwordIds: new Set(Array.from(this._swordManager.getFoundSwordIndexes(), index => this._swordDB.getIdByIndex(index))),
            havingPieces: this._inventoryManager.getPieces(),
            havingSwords: this._inventoryManager.getSwords(),
            money: this._inventoryManager.getMoney(),
            repairPaperCount: this._inventoryManager.getRepairPaper(),
            repairPaperRecipes: this._makingManager.repairPaperRecipes,
            swordRecipes: this._makingManager.swordRecipes
        });

    }
    
    public onMaking = (recipe: Recipe) => {

        if(this._inventoryManager.hasItems(recipe.materials)) {
            this._makingScreen.animateLoading(
                    (recipe.result instanceof SwordItem) ? 1200 : 700,
                    () => {
                        this.make(recipe);
                        if((recipe.result instanceof SwordItem)) this._screenManager.update({ type: ScreenDrawingContextType.SWORD_CRAFTING_CONTEXT });
                    }
                );
        }
    }

    public onClickListButton = () => {
        this._screenManager.update({
            type: ScreenDrawingContextType.MAKING_SCREEN_RENDERING_CONTEXT,
            foundSwordIds: new Set(Array.from(this._swordManager.getFoundSwordIndexes(), index => this._swordDB.getIdByIndex(index))),
            havingPieces: this._inventoryManager.getPieces(),
            havingSwords: this._inventoryManager.getSwords(),
            money: this._inventoryManager.getMoney(),
            repairPaperCount: this._inventoryManager.getRepairPaper(),
            repairPaperRecipes: this._makingManager.repairPaperRecipes,
            swordRecipes: this._makingManager.swordRecipes
        })
    }

}

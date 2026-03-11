 import { InventoryUpdateContextType } from "../context/updating/inventory_update_context";
import { StatUpdateContextType } from "../context/updating/stat_update_context";
import { SwordUpdateContextType } from "../context/updating/sword_update_context";
import { InventoryManager } from "../manager/inventory_manager";
import { StatManager } from "../manager/stat_manager";
import { SwordManager } from "../manager/sword_manager";
import { RepairPaperItem, Sword } from "../other/entity";
import { SwordDB } from "../db/sword_db";
import { SwordTestResult0, SwordTestResult1, SwordTestResultType } from "../other/test_result";
import { Popup } from "../popup/popup_message";
import { DeveloperMode } from "../screen/developer_mode";
import { MainScreen } from "../screen/screen/main_screen";
import { CalculatedSwordDB } from "../db/calculated_sword_db";
import { ScreenManager } from "../manager/screen_manager";
import { ScreenDrawingContextType } from "../context/rendering/screen_rendering_context";

export interface MainScreenActions {
    onUpgrade: () => void;
    onSell: () => void;
    onSave: () => void;
    onRepair: (sword: Sword, popup: Popup) => void;
    onInit: (popup: Popup) => void;
}

export class MainScreenEventController implements MainScreenActions {

    private readonly _swordDB: CalculatedSwordDB;

    constructor(
        _swordDB: SwordDB,
        private readonly _swordManager: SwordManager,
        private readonly _inventoryManager: InventoryManager,
        private readonly _statManager: StatManager,
        private readonly _screenManager: ScreenManager,
        private readonly _mainScreen: MainScreen,
        private readonly _developerMode: DeveloperMode,
    ) {
        this._swordDB = new CalculatedSwordDB(_swordDB, _swordManager, _statManager);
    }

    private updateSword(sword: Sword) {

        if(!this._swordManager.isFound(sword.index)) {
            this._swordManager.update({
                type: SwordUpdateContextType.FINDING_NEW_SWORD_UPDATE,
                index: sword.index
            });

            this._statManager.update({
                type: StatUpdateContextType.GETTING_STAT_POINT
            });
        }

        this._swordManager.update({
            type: SwordUpdateContextType.SWORD_CHANGE,
            maxUpgradableIndex: this._swordDB.maxUpgradableIndex,
            sword: sword
        });

    }

    private onGreatSuccess(testResult: SwordTestResult1) {
        this._screenManager.update({
            type: ScreenDrawingContextType.GOD_HAND_CONTEXT,
            newSwordIndex: testResult.resultSwordIdx
        });
        if(testResult.resultSwordIdx >= this._swordDB.maxUpgradableIndex)
            this._screenManager.update({
                type: ScreenDrawingContextType.GAME_END_CONTEXT
            });

        this.updateSword(this._swordDB.getCalculatedSwordbyIndex(testResult.resultSwordIdx));

        this._inventoryManager.update({
            type: InventoryUpdateContextType.SWORD_UPGRADE,
            name: testResult.oldSword.name,
            cost: testResult.oldSword.cost
        });
    }

    private onSuccess(testResult: SwordTestResult1) {
        if(testResult.resultSwordIdx >= this._swordDB.maxUpgradableIndex)
            this._screenManager.update({
                type: ScreenDrawingContextType.GAME_END_CONTEXT
            });

        this.updateSword(this._swordDB.getCalculatedSwordbyIndex(testResult.resultSwordIdx));

        this._inventoryManager.update({
            type: InventoryUpdateContextType.SWORD_UPGRADE,
            name: testResult.oldSword.name,
            cost: testResult.oldSword.cost
        });
    }

    private onFailButInvalidated(testResult: SwordTestResult0) {
        const dropped_pieces = testResult.result.pieces.map(
            piece => piece.drop()
        ).filter(piece => piece.count > 0);

        this._screenManager.update({
            type: ScreenDrawingContextType.INVALIDATION_CONTEXT,
            pieces: dropped_pieces
        });

        this.updateSword(this._swordDB.getCalculatedSwordbyIndex(0));

        this._inventoryManager.update({
            type: InventoryUpdateContextType.SWORD_BREAK,
            name: testResult.result.name,
            cost: testResult.result.cost,
            pieces: dropped_pieces
        });

        this._inventoryManager.update({
            type: InventoryUpdateContextType.SWORD_RESTORE,
            name: testResult.result.name,
            cost: testResult.result.cost
        });

    }

    private onFail(testResult: SwordTestResult0) {
        const dropped_pieces = testResult.result.pieces.map(
            piece => piece.drop()
        ).filter(piece => piece.count > 0);

        this._screenManager.update({
            type: ScreenDrawingContextType.UPGRADE_FAILURE_CONTEXT,
            sword: testResult.result,
            loss: this._swordDB.calculateLoss(testResult.result.index),
            pieces: dropped_pieces,
            havingRepairPaper: this._inventoryManager.getRepairPaper(),
            requiredRepairPaper: testResult.result.requiredRepairs,
            onRepair: (sword: Sword, popup: Popup) => this.onRepair(sword, popup),
            onInit: (popup: Popup) => this.onInit(popup)
        })
        
        this._inventoryManager.update({
            type: InventoryUpdateContextType.SWORD_BREAK,
            name: testResult.result.name,
            cost: testResult.result.cost,
            pieces: dropped_pieces
        });
    }

    public onUpgrade = () => {

        const sword = this._swordDB.getCalculatedSwordbyIndex(this._swordManager.currentSwordIndex);
        const testResult = this._swordManager.test(sword, this._swordDB.maxUpgradableIndex, this._inventoryManager, this._statManager, this._developerMode);
        
        switch(testResult.type) {
        case SwordTestResultType.REJECTED_BY_MAX_UPGRADE: 
            this._screenManager.update({ type: ScreenDrawingContextType.MAX_UPGRADE_CONTEXT }); break;
        case SwordTestResultType.REJECTED_BY_MONEY_LACK:
            this._screenManager.update({ type: ScreenDrawingContextType.MONEY_LACK_CONTEXT }); break;
        case SwordTestResultType.GREAT_SUCCESS: this.onGreatSuccess(testResult); break;
        case SwordTestResultType.SUCCESS: this.onSuccess(testResult); break;
        case SwordTestResultType.FAIL_BUT_INVALIDATED: this.onFailButInvalidated(testResult); break;
        case SwordTestResultType.FAIL: this.onFail(testResult); break;
        }
    }

    public onSell = () => {

        const sword = this._swordDB.getCalculatedSwordbyIndex(this._swordManager.currentSwordIndex);;
    
        this._inventoryManager.update({
            type: InventoryUpdateContextType.SWORD_SELL,
            name: sword.name,
            price: sword.price
        });

        this.updateSword(this._swordDB.getCalculatedSwordbyIndex(0));
    }

    public onSave = () => {
    
        this._inventoryManager.update({
            type: InventoryUpdateContextType.ITEM_SAVE,
            item: this._swordDB.getCalculatedSwordbyIndex(this._swordManager.currentSwordIndex).toItem()
        });

        this.updateSword(this._swordDB.getCalculatedSwordbyIndex(0));
    }

    public onRepair = (sword: Sword, popup: Popup) => {
    
        if(this._inventoryManager.hasRepairPaper(sword.requiredRepairs)) {
            this._inventoryManager.update({
                type: InventoryUpdateContextType.ITEM_SAVE,
                item: new RepairPaperItem(sword.requiredRepairs)
            });

            this.updateSword(sword);

            popup.close();
        }
    }

    public onInit = (popup: Popup) => {
        this.updateSword(this._swordDB.getCalculatedSwordbyIndex(0));
        
        popup.close();
    }
    
}
 import { InventoryUpdateContextType } from "../context/updating/inventory_update_context";
import { StatUpdateContextType } from "../context/updating/stat_update_context";
import { SwordUpdateContextType } from "../context/updating/sword_update_context";
import { Sword } from "../define/object/sword";
import { RepairPaperItem } from "../define/object/item";
import { SwordTestResult0, SwordTestResult1, SwordTestResultType } from "../define/object/test_result";
import { Popup } from "../element/popup_message";
import { DeveloperMode } from "../define/developer_mode";
import { CalculatedSwordDB } from "../define/db/calculated_sword_db";
import { ScreenDrawingContextType } from "../context/rendering/screen_drawing_context";
import { Managers } from "../manager/manager";
import { StatID } from "../manager/stat_manager";

export interface MainScreenActions {
    onUpgrade: () => void;
    onSell: () => void;
    onSave: () => void;
    onRepair: (sword: Sword, popup: Popup) => void;
    onInit: (popup: Popup) => void;
    onSwordInfoSearch: (id: string) => void;
}

export class MainScreenEventController implements MainScreenActions {

    constructor(
        private readonly _swordDB: CalculatedSwordDB,
        private readonly _managers: Managers
    ) { }

    private updateSword(sword: Sword) {

        if(!this._managers.swordManager.isFound(sword.index)) {
            this._managers.swordManager.update({
                type: SwordUpdateContextType.FINDING_NEW_SWORD_UPDATE,
                index: sword.index
            });

            this._managers.statManager.update({
                type: StatUpdateContextType.GETTING_STAT_POINT
            });
        }

        this._managers.swordManager.update({
            type: SwordUpdateContextType.SWORD_CHANGE,
            maxUpgradableIndex: this._swordDB.maxUpgradableIndex,
            sword: sword
        });

    }

    private onGreatSuccess(testResult: SwordTestResult1) {
        this._managers.screenManager.update({
            type: ScreenDrawingContextType.GOD_HAND_CONTEXT,
            newSwordIndex: testResult.resultSwordIdx
        });
        if(testResult.resultSwordIdx >= this._swordDB.maxUpgradableIndex)
            this._managers.screenManager.update({
                type: ScreenDrawingContextType.GAME_END_CONTEXT
            });

        this.updateSword(this._swordDB.getCalculatedSwordbyIndex(testResult.resultSwordIdx));

        this._managers.inventoryManager.update({
            type: InventoryUpdateContextType.SWORD_UPGRADE,
            name: testResult.oldSword.name,
            cost: testResult.oldSword.cost
        });
    }

    private onSuccess(testResult: SwordTestResult1) {
        if(testResult.resultSwordIdx >= this._swordDB.maxUpgradableIndex)
            this._managers.screenManager.update({
                type: ScreenDrawingContextType.GAME_END_CONTEXT
            });

        this.updateSword(this._swordDB.getCalculatedSwordbyIndex(testResult.resultSwordIdx));

        this._managers.inventoryManager.update({
            type: InventoryUpdateContextType.SWORD_UPGRADE,
            name: testResult.oldSword.name,
            cost: testResult.oldSword.cost
        });
    }

    private onFailButInvalidated(testResult: SwordTestResult0) {
        const dropped_pieces = testResult.result.pieces.map(
            piece => piece.drop()
        ).filter(piece => piece.count > 0);

        this._managers.screenManager.update({
            type: ScreenDrawingContextType.INVALIDATION_CONTEXT,
            pieces: dropped_pieces
        });

        this.updateSword(this._swordDB.getCalculatedSwordbyIndex(testResult.result.index));

        this._managers.inventoryManager.update({
            type: InventoryUpdateContextType.SWORD_BREAK,
            name: testResult.result.name,
            cost: testResult.result.cost,
            pieces: dropped_pieces
        });

        this._managers.inventoryManager.update({
            type: InventoryUpdateContextType.SWORD_RESTORE,
            name: testResult.result.name,
            cost: testResult.result.cost
        });

    }

    private onFail(testResult: SwordTestResult0) {
        const dropped_pieces = testResult.result.pieces.map(
            piece => piece.drop()
        ).filter(piece => piece.count > 0);

        this._managers.screenManager.update({
            type: ScreenDrawingContextType.UPGRADE_FAILURE_CONTEXT,
            sword: testResult.result,
            loss: this._swordDB.calculateLoss(testResult.result.index),
            pieces: dropped_pieces,
            havingRepairPaper: this._managers.inventoryManager.getRepairPaper(),
            requiredRepairPaper: testResult.result.requiredRepairs,
            onRepair: (sword: Sword, popup: Popup) => this.onRepair(sword, popup),
            onInit: (popup: Popup) => this.onInit(popup)
        })
        
        this._managers.inventoryManager.update({
            type: InventoryUpdateContextType.SWORD_BREAK,
            name: testResult.result.name,
            cost: testResult.result.cost,
            pieces: dropped_pieces
        });
    }

    public onUpgrade = () => {

        const sword = this._swordDB.getCalculatedSwordbyIndex(this._managers.swordManager.currentSwordIndex);
        const testResult = this._managers.swordManager.test(sword, this._swordDB.maxUpgradableIndex, this._managers.inventoryManager.getMoney(), this._managers.statManager.calculate(StatID.GOD_HAND), this._managers.statManager.calculate(StatID.INVALIDATED_SPHERE));
        
        switch(testResult.type) {
        case SwordTestResultType.REJECTED_BY_MAX_UPGRADE: 
            this._managers.screenManager.update({ type: ScreenDrawingContextType.MAX_UPGRADE_CONTEXT }); break;
        case SwordTestResultType.REJECTED_BY_MONEY_LACK:
            this._managers.screenManager.update({ type: ScreenDrawingContextType.MONEY_LACK_CONTEXT }); break;
        case SwordTestResultType.GREAT_SUCCESS: this.onGreatSuccess(testResult); break;
        case SwordTestResultType.SUCCESS: this.onSuccess(testResult); break;
        case SwordTestResultType.FAIL_BUT_INVALIDATED: this.onFailButInvalidated(testResult); break;
        case SwordTestResultType.FAIL: this.onFail(testResult); break;
        }
    }

    public onSell = () => {

        const sword = this._swordDB.getCalculatedSwordbyIndex(this._managers.swordManager.currentSwordIndex);;
    
        this._managers.inventoryManager.update({
            type: InventoryUpdateContextType.SWORD_SELL,
            name: sword.name,
            price: sword.price
        });

        this.updateSword(this._swordDB.getCalculatedSwordbyIndex(0));
    }

    public onSave = () => {
    
        this._managers.inventoryManager.update({
            type: InventoryUpdateContextType.ITEM_SAVE,
            item: this._swordDB.getCalculatedSwordbyIndex(this._managers.swordManager.currentSwordIndex).toItem()
        });

        this.updateSword(this._swordDB.getCalculatedSwordbyIndex(0));
    }

    public onRepair = (sword: Sword, popup: Popup) => {
    
        if(this._managers.inventoryManager.hasRepairPaper(sword.requiredRepairs)) {
            this._managers. inventoryManager.update({
                type: InventoryUpdateContextType.ITEM_TAKE,
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

    onSwordInfoSearch = (id: string) => {
        this._managers.screenManager.update({
            type: ScreenDrawingContextType.SWORD_INFO_CONTEXT,
            sword: this._swordDB.getCalculatedSwordbyId(id)
        });
    }
    
}
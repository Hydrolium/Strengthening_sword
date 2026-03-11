import { ScreenDrawingContextType } from '../context/rendering/screen_rendering_context.js';
import { SwordUpdateContext, SwordUpdateContextType } from '../context/updating/sword_update_context.js';
import { Observer,  Sword } from '../other/entity.js';
import { SwordTestResult, SwordTestResultType } from '../other/test_result.js';
import { DeveloperMode } from '../screen/developer_mode.js';
import { InventoryManager } from './inventory_manager.js';
import { StatID, StatManager } from './stat_manager.js';

export class SwordManager extends Observer {

    readonly target: ReadonlySet<ScreenDrawingContextType> = new Set([
        ScreenDrawingContextType.MAIN_SCREEN_RENDERING_CONTEXT
    ]);

    private _currentSwordIndex: number = 0;

    public get currentSwordIndex() {
        return this._currentSwordIndex;
    }

    private readonly _foundSwordIndexes = new Set<number>();

    public update(swordUpdateContext: SwordUpdateContext) {

        switch(swordUpdateContext.type) {
            case SwordUpdateContextType.SWORD_CHANGE:

                this._currentSwordIndex = swordUpdateContext.sword.index;

                this.notifyDrawing({
                    type: ScreenDrawingContextType.MAIN_SCREEN_RENDERING_CONTEXT,
                    isMax: this.currentSwordIndex >= swordUpdateContext.maxUpgradableIndex,
                    sword: swordUpdateContext.sword
                });

                break;
            case SwordUpdateContextType.FINDING_NEW_SWORD_UPDATE:
                this._foundSwordIndexes.add(swordUpdateContext.index);
                break;
        }
    }

    public isFound(index: number): boolean {
        return this._foundSwordIndexes.has(index);
    }

    public getFoundSwordIndexes() : ReadonlySet<number> {
        return this._foundSwordIndexes;
    }

    public test(sword: Sword, maxUpgradableIndex: number, inventoryManager: InventoryManager, statManager: StatManager, developerMode: DeveloperMode): SwordTestResult {

        if(this._currentSwordIndex >= maxUpgradableIndex) return {type: SwordTestResultType.REJECTED_BY_MAX_UPGRADE, result: sword};
        if(!inventoryManager.hasMoney(sword.cost)) return {type: SwordTestResultType.REJECTED_BY_MONEY_LACK, result: sword};

        if(developerMode.alwaysSuccess || Math.random() < sword.prob) {
            if(Math.random() < statManager.calculate(StatID.GOD_HAND)) {
                return {
                    type: SwordTestResultType.GREAT_SUCCESS,
                    resultSwordIdx: Math.min(this._currentSwordIndex + 2, maxUpgradableIndex),
                    oldSword: sword
                };
            } else {
                return {type: SwordTestResultType.SUCCESS, resultSwordIdx: this._currentSwordIndex + 1, oldSword: sword};
            }
        } else {
            if(Math.random() < statManager.calculate(StatID.INVALIDATED_SPHERE)/100 ) {
                return {type: SwordTestResultType.FAIL_BUT_INVALIDATED, result: sword};
            } else return {type: SwordTestResultType.FAIL, result: sword};
        }
    }
}
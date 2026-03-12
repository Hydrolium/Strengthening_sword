import { ScreenDrawingContextType } from '../context/rendering/screen_drawing_context.js';
import { SwordUpdateContext, SwordUpdateContextType } from '../context/updating/sword_update_context.js';
import { Sword } from "../define/object/sword.js";
import { Observer } from "../define/observer.js";
import { SwordTestResult, SwordTestResultType } from '../define/object/test_result.js';

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

    public test(
        sword: Sword,
        maxUpgradableIndex: number,
        havingMoney: number,
        godHandProb: number,
        invalidatedSphereProb: number
    ): SwordTestResult {

        if(this._currentSwordIndex >= maxUpgradableIndex) return {type: SwordTestResultType.REJECTED_BY_MAX_UPGRADE, result: sword};
        if(havingMoney < sword.cost) return {type: SwordTestResultType.REJECTED_BY_MONEY_LACK, result: sword};

        if(Math.random() < sword.prob) {
            if(Math.random() < godHandProb) {
                return {
                    type: SwordTestResultType.GREAT_SUCCESS,
                    resultSwordIdx: Math.min(this._currentSwordIndex + 2, maxUpgradableIndex),
                    oldSword: sword
                };
            } else {
                return {type: SwordTestResultType.SUCCESS, resultSwordIdx: this._currentSwordIndex + 1, oldSword: sword};
            }
        } else {
            if(Math.random() < invalidatedSphereProb ) {
                return {type: SwordTestResultType.FAIL_BUT_INVALIDATED, result: sword};
            } else return {type: SwordTestResultType.FAIL, result: sword};
        }
    }
}
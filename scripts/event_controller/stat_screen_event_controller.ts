import { ScreenDrawingContextType } from "../context/rendering/screen_drawing_context";
import { StatUpdateContextType } from "../context/updating/stat_update_context";
import { Managers } from "../manager/manager";
import { StatID } from "../manager/stat_manager";
import { StatTestResult } from "../define/object/test_result";

export interface StatScreenActions {
    onStatUp: (statId: string) => void;
}

export class StatScreenEventController implements StatScreenActions {

    constructor(
        private readonly _managers: Managers
    ) {}

    public onStatUp = (statId: string) => {

        const statID = StatID[statId.toUpperCase() as keyof typeof StatID];

        const result = this._managers.statManager.tryUpgrade(statID);

        switch (result) {
        case StatTestResult.SUCCESS:
            this._managers.statManager.update({
                type: StatUpdateContextType.STAT_UPGRADE,
                id: statID
            });
            break;
        case StatTestResult.SUCCESS_AND_ALL_MAX:
            this._managers.screenManager.update({ type: ScreenDrawingContextType.GAME_ALL_STAT_CONTEXT });
            this._managers.statManager.update({
                type: StatUpdateContextType.STAT_UPGRADE,
                id: statID
            });
            break;
        case StatTestResult.REJECTED_BY_MAX_UPGRADE:
            this._managers.screenManager.update({ type: ScreenDrawingContextType.MAX_STAT_CONTEXT });
            break;
        case StatTestResult.REJECTED_BY_POINT_LACK:
            this._managers.screenManager.update({ type: ScreenDrawingContextType.STAT_POINT_LACK_CONTEXT });
            break;
        }
    }
}
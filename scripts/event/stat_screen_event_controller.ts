import { ScreenDrawingContextType } from "../context/rendering/screen_rendering_context";
import { StatUpdateContextType } from "../context/updating/stat_update_context";
import { ScreenManager } from "../manager/screen_manager";
import { StatID, StatManager } from "../manager/stat_manager";
import { StatTestResult } from "../other/test_result";
import { StatScreen } from "../screen/screen/stat_screen";

export interface StatScreenActions {
    onStatUp: (statId: string) => void;
}

export class StatScreenEventController implements StatScreenActions {

    constructor(
        private readonly _statManager: StatManager,
        private readonly _screenManager: ScreenManager,
        private readonly _statScreen: StatScreen
    ) {}

    public onStatUp = (statId: string) => {

        const statID = StatID[statId.toUpperCase() as keyof typeof StatID];

        const result = this._statManager.tryUpgrade(statID);

        switch (result) {
        case StatTestResult.SUCCESS:
            this._statManager.update({
                type: StatUpdateContextType.STAT_UPGRADE,
                id: statID
            });
            break;
        case StatTestResult.SUCCESS_AND_ALL_MAX:
            this._screenManager.update({ type: ScreenDrawingContextType.GAME_ALL_STAT_CONTEXT });
            this._statManager.update({
                type: StatUpdateContextType.STAT_UPGRADE,
                id: statID
            });
            break;
        case StatTestResult.REJECTED_BY_MAX_UPGRADE:
            this._screenManager.update({ type: ScreenDrawingContextType.MAX_STAT_CONTEXT });
            break;
        case StatTestResult.REJECTED_BY_POINT_LACK:
            this._screenManager.update({ type: ScreenDrawingContextType.STAT_POINT_LACK_CONTEXT });
            break;
        }
    }
}
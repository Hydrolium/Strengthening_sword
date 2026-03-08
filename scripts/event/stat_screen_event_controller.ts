import { StatUpdateContextType } from "../context/updating/stat_update_context";
import { StatID, StatManager } from "../manager/stat_manager";
import { StatTestResult } from "../other/test_result";
import { StatScreen } from "../screen/stat_screen";

export interface StatScreenActions {
    onStatUp: (statId: string) => void;
}

export class StatScreenEventController implements StatScreenActions {

    constructor(
        private readonly _statManager: StatManager,
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
            this._statScreen.popupGameAllStatMessage();
            
            this._statManager.update({
                type: StatUpdateContextType.STAT_UPGRADE,
                id: statID
            });
            break;
        case StatTestResult.REJECTED_BY_MAX_UPGRADE:
            this._statScreen.popupMaxStatMessage();
            break;
        case StatTestResult.REJECTED_BY_POINT_LACK:
            this._statScreen.popupStatPointLackMessage();
            break;
        }
    }
}
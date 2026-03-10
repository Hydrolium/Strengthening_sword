import { StatManager } from "../manager/stat_manager";
import { SwordManager } from "../manager/sword_manager";
import { SwordDB } from "../db/sword_db";
import { InformationScreen } from "../screen/information_screen";
import { CalculatedSwordDB } from "../db/calculated_sword_db";

export interface InformationScreenActions {
    onSwordInfoSearch: (id: string) => void;
}

export class InformationScreenEventController implements InformationScreenActions {

    private readonly _swordDB: CalculatedSwordDB;

    constructor(
        _swordDB: SwordDB,
        _swordManager: SwordManager,
        _statManager: StatManager,
        private readonly _informationScreen: InformationScreen,
    ) {
        this._swordDB = new CalculatedSwordDB(_swordDB, _swordManager, _statManager);
    }

    onSwordInfoSearch = (id: string) => {
        this._informationScreen.popupSwordInfoMessage(this._swordDB.getCalculatedSwordbyId(id));
    }
}
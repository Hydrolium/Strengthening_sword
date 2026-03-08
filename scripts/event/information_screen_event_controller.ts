import { SwordDB } from "../other/sword_db";
import { InformationScreen } from "../screen/information_screen";

export interface InformationScreenActions {
    onSwordInfoSearch: (id: string) => void;
}

export class InformationScreenEventController implements InformationScreenActions {
    constructor(
        private readonly _swordDB: SwordDB,
        private readonly _informationScreen: InformationScreen,
    ) {}

    onSwordInfoSearch = (id: string) => {
        this._informationScreen.popupSwordInfoMessage(this._swordDB.getSwordById(id));
    }
}
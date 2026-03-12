import { CalculatedSwordDB } from "../define/calculated_sword_db";
import { ScreenDrawingContextType } from "../context/rendering/screen_drawing_context";
import { Managers } from "../manager/manager";

export interface InformationScreenActions {
    onSwordInfoSearch: (id: string) => void;
}

export class InformationScreenEventController implements InformationScreenActions {

    constructor(
        private readonly _swordDB: CalculatedSwordDB,
        private readonly _managers: Managers
    ) { }

    onSwordInfoSearch = (id: string) => {
        this._managers.screenManager.update({
            type: ScreenDrawingContextType.SWORD_INFO_CONTEXT,
            sword: this._swordDB.getCalculatedSwordbyId(id)
        });
    }
}
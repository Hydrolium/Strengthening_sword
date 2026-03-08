import { ScreenContext } from "../context/rendering/screen_context.js";
import { MoneyChangeReason, ScreenRenderingContextType } from "../context/rendering/screen_rendering_context.js";
import { $, createElementWith } from "../other/element_controller.js";
import { Refreshable } from "./screen.js";

export class RecordStorage extends Refreshable {
    
    private _records: string[] = [];
    private readonly _maxRecordableCount: number = 10;

    private add(record: string) {
        this._records.push(record);
        if(this._records.length > this._maxRecordableCount) this._records = this._records.slice(1);
    }

    private render() {
        const ret = this._records.map(rec => createElementWith("p", {text: rec}));
        $("#records").replaceChildren(...ret);
    }

    public refresh = (context?: ScreenContext) => {

        if(context?.type != ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT) return

        switch(context?.reason) {
            case MoneyChangeReason.SYSTEM_MONEY_GIFT :
                this.add(`기본금 지급 +${context.money}`);
                this.render();
                break;

            case MoneyChangeReason.SWORD_UPGRADE:

                this.add(`${context.name} 강화 -${context.cost}`);
                this.render();
                break;

            case MoneyChangeReason.SWORD_SELL:
                this.add(`${context.name} 판매 +${context.price}`);
                this.render();
                break;

            case MoneyChangeReason.SWORD_RESTORE:
                this.add(`${context.name} 복구 +${context.cost}`);
                this.render();
                break;
                
            case MoneyChangeReason.BUY_USING_MONEY:
                this.add(`${context.resultName} x ${context.count} 구매 -${context.price}`);
                this.render();
                break;
        }
    }
}
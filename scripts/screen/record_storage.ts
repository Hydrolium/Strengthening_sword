import { ContextType, GameContext } from "../other/context.js";
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

    public refresh = (event?: GameContext) => {

        switch(event?.type) {
            case ContextType.SYSTEM_MONEY_GIFT :
                this.add(`기본금 지급 +${event.money}`);
                this.render();
                break;

            case ContextType.SWORD_UPGRADE:

                this.add(`${event.name} 강화 -${event.cost}`);
                this.render();
                break;

            case ContextType.SWORD_SELL:
                this.add(`${event.name} 판매 +${event.price}`);
                this.render();
                break;

            case ContextType.SWORD_RESTORE:
                this.add(`${event.name} 복구 +${event.cost}`);
                this.render();
                break;
                
            case ContextType.BUY_USING_MONEY:
                this.add(`${event.resultName} x ${event.count} 구매 -${event.price}`);
                this.render();
                break;
        }
    }
}
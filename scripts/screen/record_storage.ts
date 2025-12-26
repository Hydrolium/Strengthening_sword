import { ContextType, GameContext } from "../other/context.js";
import { $, createElementWith } from "../other/element_controller.js";
import { Refreshable } from "./screen.js";

export class RecordStorage extends Refreshable {
    
    private records: string[] = [];
    private maxRecordableCount: number = 10;

    private add(record: string) {
        this.records.push(record);
        if(this.records.length > this.maxRecordableCount) this.records = this.records.slice(1);
    }

    private render() {
        const ret = this.records.map(rec => createElementWith("p", {text: rec}));
        $("#records").replaceChildren(...ret);
    }

    refresh = (event?: GameContext) => {

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
                
            case ContextType.BYE_USING_MONEY:
                this.add(`${event.result_name} x ${event.count} 구매 -${event.price}`);
                this.render();
                break;
        }
    }
}
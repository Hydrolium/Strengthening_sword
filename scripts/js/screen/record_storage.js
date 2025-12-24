import { $, createElementWith } from "../other/element_controller.js";
import { ContextType } from "../other/entity.js";
import { Refreshable } from "./screen.js";
export class RecordStorage extends Refreshable {
    constructor() {
        super(...arguments);
        this.records = [];
        this.max_recordable_count = 10;
        this.refresh = (event) => {
            switch (event === null || event === void 0 ? void 0 : event.type) {
                case ContextType.SYSTEM_MONEY_GIFT:
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
        };
    }
    add(record) {
        this.records.push(record);
        if (this.records.length > this.max_recordable_count)
            this.records = this.records.slice(1);
    }
    render() {
        const ret = this.records.map(rec => createElementWith("p", { text: rec }));
        $("#records").replaceChildren(...ret);
    }
}

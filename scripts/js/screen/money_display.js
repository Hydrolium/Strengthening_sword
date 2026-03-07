import { ContextType } from "../other/context.js";
import { $ } from "../other/element_controller.js";
import { Keyframes, Refreshable } from "./screen.js";
export class MoneyDisplay extends Refreshable {
    constructor() {
        super(...arguments);
        this.refresh = (event) => {
            if ((event === null || event === void 0 ? void 0 : event.type) != ContextType.MONEY_CHANGE)
                return;
            if (event.changedMoney == 0)
                return;
            this.animateChangingMoney(event.changedMoney);
            $("#money-number").textContent = `${event.havingMoney}`;
        };
    }
    animateChangingMoney(money) {
        const element_moneyChange = $("#money-change");
        element_moneyChange.textContent = `${((money >= 0) ? "+" + money : money)}원`;
        element_moneyChange.animate(Keyframes.moneyChangeKef, { duration: 300, fill: "both" });
    }
}

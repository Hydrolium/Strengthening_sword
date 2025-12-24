import { ContextType, GameContext } from "../other/context.js";
import { $, write } from "../other/element_controller.js";
import { Keyframes, Refreshable } from "./screen.js";

export class MoneyDisplay extends Refreshable {

    animateChangingMoney(money: number) {

        const element_money_change = $("#money-change")

        write(element_money_change, ((money >= 0) ? "+" + money : money) + "원");

        element_money_change.animate(Keyframes.money_change_kef, {duration: 300, fill: "both"});

    }

    refresh = (event?: GameContext) => {

        if(event?.type != ContextType.MONEY_CHANGE) return;

        if(event.changed_money == 0) return;

        this.animateChangingMoney(event.changed_money);
        write($("#money-number"), event.having_money);
        
    }

}
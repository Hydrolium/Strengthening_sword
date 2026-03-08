import { ScreenContext } from "../context/rendering/screen_context.js";
import { ScreenRenderingContextType } from "../context/rendering/screen_rendering_context.js";
import { $ } from "../other/element_controller.js";
import { Keyframes, Refreshable } from "./screen.js";

export class MoneyDisplay extends Refreshable {

    private animateChangingMoney(money: number) {

        const element_moneyChange = $("#money-change")

        element_moneyChange.textContent = `${((money >= 0) ? "+" + money : money)}원`;

        element_moneyChange.animate(Keyframes.moneyChangeKef, {duration: 300, fill: "both"});

    }

    public refresh = (context?: ScreenContext) => {

        if(context?.type != ScreenRenderingContextType.MONEY_DISPLAY_RENDERING_CONTEXT) return;

        if(context.deltaMoney == 0) return;

        this.animateChangingMoney(context.deltaMoney);
        $("#money-number").textContent = `${context.havingMoney}`;
        
    }

}
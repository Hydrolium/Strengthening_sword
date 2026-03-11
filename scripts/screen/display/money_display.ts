import { ScreenDrawingContext } from "../../context/rendering/screen_context";
import { ScreenDrawingContextType } from "../../context/rendering/screen_rendering_context";
import { $ } from "../../other/element_controller";
import { Keyframes } from "../refreshable";
import { Display } from "./display";

export class MoneyDisplay extends Display {

    private animateChangingMoney(money: number) {

        const element_moneyChange = $("#money-change")

        element_moneyChange.textContent = `${((money >= 0) ? "+" + money : money)}원`;

        element_moneyChange.animate(Keyframes.moneyChangeKef, {duration: 300, fill: "both"});

    }

    public refresh = (context: ScreenDrawingContext) => {

        if(context?.type != ScreenDrawingContextType.MONEY_DISPLAY_RENDERING_CONTEXT) return;

        if(context.deltaMoney == 0) return;

        this.animateChangingMoney(context.deltaMoney);
        $("#money-number").textContent = `${context.havingMoney}`;
        
    }

}
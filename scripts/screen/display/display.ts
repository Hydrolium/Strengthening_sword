import { ScreenDrawingContext } from "../../context/rendering/screen_rendering_context";
import { ScreenShowingContext } from "../../context/rendering/screen_showing_context";
import { Refreshable } from "../refreshable";
import { MoneyDisplay } from "./money_display";
import { PopupDisplay } from "./popup_display";
import { RecordDisplay } from "./record_display";

export abstract class Display implements Refreshable {

    public show = (context: ScreenShowingContext) => {
        throw Error("Display의 show는 호출할 수 없습니다.");
    }

    public abstract refresh: (context: ScreenDrawingContext) => void;

}

export interface Display {
    readonly moneyDisplay: MoneyDisplay,
    readonly popupDisplay: PopupDisplay,
    readonly recordDisplay: RecordDisplay
}
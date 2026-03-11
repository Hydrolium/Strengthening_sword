import { ScreenDrawingContext } from "../../context/rendering/screen_rendering_context";
import { ScreenShowingContext, ScreenShowingContextType } from "../../context/rendering/screen_showing_context";
import { $ } from "../../other/element_controller";
import { Refreshable } from "../refreshable";
import { InformationScreen } from "./information_screen";
import { InventoryScreen } from "./inventory_screen";
import { MainScreen } from "./main_screen";
import { MakingScreen } from "./making_screen";
import { StatScreen } from "./stat_screen";

export interface Screen {
    readonly mainScreen: MainScreen,
    readonly informationScreen: InformationScreen,
    readonly inventoryScreen: InventoryScreen,
    readonly makingScreen: MakingScreen,
    readonly statScreen: StatScreen
}

export abstract class Screen implements Refreshable {

    private static currentScreenId: ScreenShowingContextType;

    protected abstract readonly _id: ScreenShowingContextType;

    protected changeBody = () => {
        Screen.currentScreenId = this._id;

        const element_template = $<HTMLTemplateElement>("#" + this._id);
        document.querySelector("#main-body")?.replaceChildren(document.importNode(element_template.content, true));

        this.init();
    }

    protected abstract init(): void;

    public show = (context: ScreenShowingContext) => {
        if(this._id == context.type) {
            this.changeBody();
            this.render(context.renderingContext);
        }
    }

    public refresh = (context: ScreenDrawingContext) => {
        if (Screen.currentScreenId == this._id) this.render(context);
    }

    protected abstract render(context: ScreenDrawingContext): void;
}

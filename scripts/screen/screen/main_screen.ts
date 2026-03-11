import { ScreenDrawingContext, ScreenDrawingContextType } from "../../context/rendering/screen_rendering_context";
import { ScreenShowingContextType } from "../../context/rendering/screen_showing_context";
import { MainScreenActions } from "../../event/main_screen_event_controller";
import { $, invisible, setOnClick, visible, write } from "../../other/element_controller";
import { Screen } from "./screen";

export class MainScreen extends Screen {

    protected readonly _id = ScreenShowingContextType.MAIN_SCREEN_SHOWING_CONTEXT;

    private readonly _elements : {
        swordImage?: HTMLImageElement,
        swordNumber?: HTMLSpanElement,
        swordName?: HTMLSpanElement,
        swordProb?: HTMLSpanElement,
        swordCost?: HTMLSpanElement,
        swordPrice?: HTMLSpanElement,
        sellButton?: HTMLAnchorElement,
        upgradeButton?: HTMLAnchorElement,
        saveButton?: HTMLAnchorElement
    } = {};

    private _actions?: MainScreenActions;

    public setActions(actions: MainScreenActions) {
        this._actions = actions;
    }

    protected init() {

        this._elements.swordImage = $<HTMLImageElement>("#sword-image");

        this._elements.swordNumber = $<HTMLSpanElement>("#sword-number");
        this._elements.swordName = $<HTMLSpanElement>("#sword-name");
        this._elements.swordProb = $<HTMLSpanElement>("#sword-prob");
        this._elements.swordCost = $<HTMLSpanElement>("#sword-cost");
        this._elements.swordPrice = $<HTMLSpanElement>("#sword-price");

        this._elements.sellButton = $<HTMLAnchorElement>("#sell-button");
        this._elements.upgradeButton = $<HTMLAnchorElement>("#upgrade-button");
        this._elements.saveButton = $<HTMLAnchorElement>("#save-button");

        setOnClick(this._elements.sellButton, this._actions?.onSell);
        setOnClick(this._elements.upgradeButton, this._actions?.onUpgrade);
        setOnClick(this._elements.saveButton, this._actions?.onSave);

    }

    protected render(context?: ScreenDrawingContext) {

        if(context?.type != ScreenDrawingContextType.MAIN_SCREEN_RENDERING_CONTEXT) return;

        this._elements.swordImage!.src = context.sword.imgSrc;

        write(this._elements.swordNumber, context.sword.index);

        if(context.isMax) this._elements.swordNumber?.classList.add("hightlight");

        write(this._elements.swordName, context.sword.name);

        this._elements.swordProb?.setAttribute("enabled", `${!context.isMax}`);
        this._elements.swordCost?.setAttribute("enabled", `${!context.isMax}`);

        if(!context.isMax) {

            const prob = context.sword.prob;

            write(this._elements.swordProb, Math.floor(prob*100));
            write(this._elements.swordCost, `${context.sword.cost}`);
        } else {
            write(this._elements.swordProb, "");
            write(this._elements.swordCost, "");
        }

        if(context.sword.price > 0) {
            write(this._elements.swordPrice, `${context.sword.price}`);
            visible(this._elements.swordPrice);
            visible(this._elements.sellButton);
        } else {
            invisible(this._elements.swordPrice);
            invisible(this._elements.sellButton);
        }

        if(context.sword.canSave) visible(this._elements.saveButton);
        else invisible(this._elements.saveButton);
    }
}

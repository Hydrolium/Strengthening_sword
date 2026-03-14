import { ScreenDrawingContext, ScreenDrawingContextType } from "../../context/rendering/screen_drawing_context";
import { ScreenShowingContextType } from "../../context/rendering/screen_showing_context";
import { MainScreenActions } from "../../event_controller/main_screen_event_controller";
import { $, setOnClick, setVisibility, write } from "../../element/element_controller";
import { Screen } from "./screen";

export class MainScreen extends Screen {

    protected readonly _id = ScreenShowingContextType.MAIN_SCREEN_SHOWING_CONTEXT;

    private readonly _elements : {
        swordImage?: HTMLImageElement,
        swordNumber?: HTMLParagraphElement,
        swordName?: HTMLParagraphElement,
        swordProb?: HTMLParagraphElement,
        swordInfo1?: HTMLParagraphElement,
        swordInfo2?: HTMLParagraphElement,
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

        this._elements.swordNumber = $<HTMLParagraphElement>("#sword-number");
        this._elements.swordName = $<HTMLParagraphElement>("#sword-name");
        this._elements.swordProb = $<HTMLParagraphElement>("#sword-prob");
        this._elements.swordInfo1 = $<HTMLParagraphElement>("#sword-info-1");
        this._elements.swordInfo2 = $<HTMLParagraphElement>("#sword-info-2");

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
        this._elements.swordImage!.onclick = () => this._actions?.onSwordInfoSearch(context.sword.id);

        write(this._elements.swordName, context.sword.name);

        if(!context.isMax) {
            write(this._elements.swordNumber, `${context.sword.index}강`);
            this._elements.swordNumber?.classList.remove("isMax")

            write(this._elements.swordProb, `강화 성공 확률: ${Math.floor(context.sword.prob * 100)}%`);
            write(this._elements.swordInfo1, `강화 비용: ${context.sword.cost}원`);
            write(this._elements.swordInfo2, (context.sword.price > 0) ? `판매 가격: ${context.sword.price}원` : " ");

        } else {
            write(this._elements.swordNumber, `${context.sword.index}강 (MAX)`);
            this._elements.swordNumber?.classList.add("isMax");

            write(this._elements.swordProb, " ");
            write(this._elements.swordInfo1, (context.sword.price > 0) ? `판매 가격: ${context.sword.price}원` : " ");
            write(this._elements.swordInfo2, " ");
        }

        setVisibility(this._elements.sellButton, context.sword.price > 0);
        setVisibility(this._elements.saveButton, context.sword.canSave);
    }
}

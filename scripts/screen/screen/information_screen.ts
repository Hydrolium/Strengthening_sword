import { $, createElementWith, createImageWithSrc, write } from "../../element/element_controller.js";
import { UnknownItem } from "../../define/object/item.js";
import { SwordItem } from "../../define/object/item.js";
import { ScreenDrawingContext, ScreenDrawingContextType } from "../../context/rendering/screen_drawing_context.js";
import { ScreenShowingContextType } from "../../context/rendering/screen_showing_context.js";
import { InformationScreenActions } from "../../event_controller/information_screen_event_controller.js";
import { Screen } from "./screen.js";

export class InformationScreen extends Screen {

    protected readonly _id = ScreenShowingContextType.INFORMATION_SCREEN_SHOWING_CONTEXT;

    private readonly _elements: {
        foundSwords?: HTMLDivElement,
        swordCount?: HTMLSpanElement
    } = {};

    private _actions?: InformationScreenActions;

    public setActions(actions: InformationScreenActions) {
        this._actions = actions;
    }

    protected init() {
        this._elements.foundSwords = $<HTMLDivElement>("#found-swords");
        this._elements.swordCount = $<HTMLSpanElement>("#found-sword-count");
    }

    private makeIcon(item: SwordItem | UnknownItem): HTMLDivElement {
        const created_div = createElementWith<HTMLDivElement>("div", {classes: ["sword_icon", (item instanceof SwordItem) ? "sword" : "unknown"]});

        created_div.appendChild(createImageWithSrc(item.imgSrc, item.name));

        if(item instanceof SwordItem) {
            created_div.appendChild(createElementWith("span", {classes: ["sword_name"], text: item.name}));

            created_div.addEventListener("click", () => this._actions?.onSwordInfoSearch(item.id));
        }
        return created_div;
    }

    protected render(context?: ScreenDrawingContext) {

        if(context?.type != ScreenDrawingContextType.INFORMATION_SCREEN_RENDERING_CONTEXT) return;

        const created_found = context.swords.map((sword, index) => {
            if(context.founds.has(index)) return this.makeIcon(sword);
            return this.makeIcon(UnknownItem.instance);
        });

        this._elements.foundSwords?.replaceChildren(...created_found);

        write(this._elements.swordCount, context.founds.size);
    }
}
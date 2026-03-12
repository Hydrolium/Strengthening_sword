import {  ScreenDrawingContext, ScreenDrawingContextType } from "../../context/rendering/screen_drawing_context.js";
import { ScreenShowingContextType } from "../../context/rendering/screen_showing_context.js";
import { StatScreenActions } from "../../event_controller/stat_screen_event_controller.js";
import { $, createElement, createElementWith, createImageWithSrc, write } from "../../element/element_controller.js";
import { StatInfo } from "../../define/object/stat.js";
import { Screen } from "./screen.js";

export class StatScreen extends Screen {

    protected readonly _id = ScreenShowingContextType.STAT_SCREEN_SHOWING_CONTEXT;

    private readonly _elements: {
        statBox?: HTMLDivElement,
        statPointCount?: HTMLSpanElement
    } = {};

    private _actions?: StatScreenActions;

    public setActions(actions: StatScreenActions) {
        this._actions = actions;
    }

    protected init() {
        this._elements.statBox = $<HTMLDivElement>("#stat_box");
        this._elements.statPointCount = $<HTMLSpanElement>("#stat-point-count");
    }

    private makeIconDiv(src: string, onclick: () => void): HTMLDivElement {
        const created_iconBox = createElementWith<HTMLDivElement>("div", {classes: ["icon"]});
        created_iconBox.addEventListener("click", onclick);

        const created_statUpDiv = createElementWith("div", {classes: ["stat_up"]});
        created_iconBox.appendChild(createImageWithSrc(src))
        created_iconBox.appendChild(created_statUpDiv);

        return created_iconBox;
    };

    private makeLevelDiv(stat: StatInfo): HTMLDivElement {

        const created_levelBox = createElementWith<HTMLDivElement>("div", {classes: ["level"]});
        const created_ul = createElement("ul");

        for(let i = 0;i < stat.getMaxLevel(); i++) {
            const created_liPoint = createElementWith("li", {classes: ["point"]});
            if(i < stat.getCurrentLevel()) created_liPoint.classList.add("active");
            created_ul.appendChild(created_liPoint);
        }
        created_levelBox.appendChild(created_ul);
        return created_levelBox;
    };

    private makeInfoDiv(stat: StatInfo): HTMLDivElement {
        const created_infoBox = createElementWith<HTMLDivElement>("div", {classes: ["info"]});

        const created_pName = createElementWith("p", {classes: ["name"], text: stat.name});

        const created_pDescription = createElementWith("p", {classes: ["description"], text: stat.description});

        const created_details = createElementWith("ul", {classes: ["detail"]});

        for(let i = 0; i < stat.getMaxLevel(); i++) {
            const stat_li = createElementWith("li", {text: stat.prefix + stat.values[i] + stat.suffix});

            if(stat.getCurrentLevel() == i + 1) stat_li.classList.add("active");
            created_details.appendChild(stat_li);
        }

        created_infoBox.appendChild(created_pName);
        created_infoBox.appendChild(created_pDescription);
        created_infoBox.appendChild(created_details);

        return created_infoBox;
    };


    private makeStatSection(stat: StatInfo): HTMLElement {

        const created_section = createElementWith("section", {classes: ["stat", stat.color]});

        created_section.appendChild(
            this.makeIconDiv(
                stat.imgSrc,
                () => this._actions?.onStatUp(stat.id)
            )
        );

        created_section.appendChild(
            this.makeLevelDiv(stat));
        
        created_section.appendChild(this.makeInfoDiv(stat));
        return created_section;
    };

    protected render(context: ScreenDrawingContext) {

        if(context.type != ScreenDrawingContextType.STAT_SCREEN_RENDERING_CONTEXT) return;

        this._elements.statBox?.replaceChildren(...context.stats.map(stat => this.makeStatSection(stat)));
        write(this._elements.statPointCount, context.statPoint);
    }

}
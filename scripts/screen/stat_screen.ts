import { ScreenRenderingContext, ScreenRenderingContextType } from "../context/rendering/screen_rendering_context.js";
import { ScreenShowingContextType } from "../context/rendering/screen_showing_context.js";
import { StatScreenActions } from "../event/stat_screen_event_controller.js";
import { $, createElement, createElementWith, createImageWithSrc, write } from "../other/element_controller.js";
import { Color, StatInfo } from "../other/entity.js";
import { Popup } from "../popup/popup_message.js";
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

    protected render(context: ScreenRenderingContext) {

        if(context.type != ScreenRenderingContextType.STAT_SCREEN_RENDERING_CONTEXT) return;

        this._elements.statBox?.replaceChildren(...context.stats.map(stat => this.makeStatSection(stat)));
        write(this._elements.statPointCount, context.statPoint);
    }

    public popupMaxStatMessage() {
        const popup = new Popup();
        popup.setTitle("이미 최대로 강화된 스탯입니다!", Color.PURPLE);
        popup.setSubTitle("다른 스탯을 강화해 보세요.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
    
    public popupStatPointLackMessage() {
        const popup = new Popup();
        popup.setTitle("스탯 포인트가 부족합니다!", Color.RED);
        popup.setSubTitle("새로운 검을 발견해 스탯 포인트를 얻어보세요.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    public popupGameAllStatMessage() {
        const popup = new Popup();
        popup.setTitle("모든 스탯을 끝까지 업그레이드 했습니다", Color.GOLD);
        popup.setSubTitle("고대 룬의 마법이 당신과 함께합니다!");
        popup.addParagraphText("창을 닫아도 게임은 계속됩니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
}
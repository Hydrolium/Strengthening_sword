import { StatID } from "../manager/stat_manager.js";
import { onStatUp } from "../other/click_events.js";
import { $, createElement, createElementWith, createImageWithSrc, write } from "../other/element_controller.js";
import { Color } from "../other/entity.js";
import { Game } from "../other/main.js";
import { Popup } from "../popup/popup_message.js";
import { Screen } from "./screen.js";
export class StatScreen extends Screen {
    constructor() {
        super(...arguments);
        this.id = "game-stat";
        this.elements = {};
    }
    changeBody() {
        super.changeBody();
        this.elements.statBox = $("#stat_box");
        this.elements.statPointCount = $("#stat-point-count");
    }
    makeIconDiv(src, onclick) {
        const created_iconBox = createElementWith("div", { classes: ["icon"] });
        created_iconBox.addEventListener("click", onclick);
        const created_statUpDiv = createElementWith("div", { classes: ["stat_up"] });
        created_iconBox.appendChild(createImageWithSrc(src));
        created_iconBox.appendChild(created_statUpDiv);
        return created_iconBox;
    }
    ;
    makeLevelDiv(stat) {
        const created_levelBox = createElementWith("div", { classes: ["level"] });
        const created_ul = createElement("ul");
        for (let i = 0; i < stat.getMaxLevel(); i++) {
            const created_liPoint = createElementWith("li", { classes: ["point"] });
            if (i < stat.getCurrentLevel())
                created_liPoint.classList.add("active");
            created_ul.appendChild(created_liPoint);
        }
        created_levelBox.appendChild(created_ul);
        return created_levelBox;
    }
    ;
    makeInfoDiv(stat) {
        const created_infoBox = createElementWith("div", { classes: ["info"] });
        const created_pName = createElementWith("p", { classes: ["name"], text: stat.name });
        const created_pDescription = createElementWith("p", { classes: ["description"], text: stat.description });
        const created_details = createElementWith("ul", { classes: ["detail"] });
        for (let i = 0; i < stat.getMaxLevel(); i++) {
            const stat_li = createElementWith("li", { text: stat.prefix + stat.values[i] + stat.suffix });
            if (stat.getCurrentLevel() == i + 1)
                stat_li.classList.add("active");
            created_details.appendChild(stat_li);
        }
        created_infoBox.appendChild(created_pName);
        created_infoBox.appendChild(created_pDescription);
        created_infoBox.appendChild(created_details);
        return created_infoBox;
    }
    ;
    makeStatSection(stat) {
        const created_section = createElementWith("section", { classes: ["stat", stat.color] });
        created_section.appendChild(this.makeIconDiv(stat.imgSrc, () => onStatUp(stat.id)));
        created_section.appendChild(this.makeLevelDiv(stat));
        created_section.appendChild(this.makeInfoDiv(stat));
        return created_section;
    }
    ;
    render() {
        var _a;
        const created_stb = Object.keys(StatID).map(stat => this.makeStatSection(Game.statManager.getStat(stat)));
        (_a = this.elements.statBox) === null || _a === void 0 ? void 0 : _a.replaceChildren(...created_stb);
        write(this.elements.statPointCount, Game.statManager.getStatPoint());
    }
    popupMaxStatMessage() {
        const popup = new Popup();
        popup.setTitle("이미 최대로 강화된 스탯입니다!", Color.PURPLE);
        popup.setSubTitle("다른 스탯을 강화해 보세요.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
    popupStatPointLackMessage() {
        const popup = new Popup();
        popup.setTitle("스탯 포인트가 부족합니다!", Color.RED);
        popup.setSubTitle("새로운 검을 발견해 스탯 포인트를 얻어보세요.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
    popupGameAllStatMessage() {
        const popup = new Popup();
        popup.setTitle("모든 스탯을 끝까지 업그레이드 했습니다", Color.GOLD);
        popup.setSubTitle("고대 룬의 마법이 당신과 함께합니다!");
        popup.addParagraphText("창을 닫아도 게임은 계속됩니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
}

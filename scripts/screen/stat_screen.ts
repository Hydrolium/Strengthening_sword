import { Stat, StatID } from "../manager/stat_manager.js";
import { onStatUp } from "../other/click_events.js";
import { $, createElement, createElementWith, createImageWithSrc, write } from "../other/element_controller.js";
import { Color } from "../other/entity.js";
import { Game } from "../other/main.js";
import { Popup } from "../popup/popup_message.js";
import { Screen } from "./screen.js";

export class StatScreen extends Screen {

    id = "game-stat";

    private makeIconDiv(img_src: string, onclick: () => void): HTMLDivElement {
        const created_icon_box = createElementWith<HTMLDivElement>("div", {classes: ["icon"]});
        created_icon_box.addEventListener("click", onclick);

        const created_stat_up = createElementWith("div", {classes: ["stat_up"]});
        created_icon_box.appendChild(createImageWithSrc(img_src))
        created_icon_box.appendChild(created_stat_up);

        return created_icon_box;
    };

    private  makeLevelDiv(stat: Stat): HTMLDivElement {

        const created_level_box = createElementWith<HTMLDivElement>("div", {classes: ["level"]});
        const created_ul = createElement("ul");


        for(let i = 0;i < stat.getMaxLevel(); i++) {
            const created_li_point = createElementWith("li", {classes: ["point"]});
            if(i < stat.getCurrentLevel()) created_li_point.classList.add("active");
            created_ul.appendChild(created_li_point);
        }
        created_level_box.appendChild(created_ul);
        return created_level_box;
    };

    private makeInfoDiv(stat: Stat): HTMLDivElement {
        const created_info_box = createElementWith<HTMLDivElement>("div", {classes: ["info"]});

        const created_pname = createElementWith("p", {classes: ["name"]})
        write(created_pname, stat.name);

        const created_pdescription = createElementWith("p", {classes: ["description"]})
        write(created_pdescription, stat.description);

        const created_details = createElementWith("ul", {classes: ["detail"]});

        for(let i = 0; i < stat.getMaxLevel(); i++) {
            const stat_li = createElement("li")
            write(stat_li, stat.prefix + stat.values[i] + stat.suffix);

            if(stat.getCurrentLevel() == i + 1) stat_li.classList.add("active");
            created_details.appendChild(stat_li);
        }

        created_info_box.appendChild(created_pname);
        created_info_box.appendChild(created_pdescription);
        created_info_box.appendChild(created_details);

        return created_info_box;
    };


    private makeStatSection(stat: Stat): HTMLElement {

        const created_section = createElementWith("section", {classes: ["stat", stat.color]});

        created_section.appendChild(
            this.makeIconDiv(
                Game.Path[stat.id],
                () => onStatUp(stat.id)
            )
        );

        created_section.appendChild(
            this.makeLevelDiv(stat));
        
        created_section.appendChild(this.makeInfoDiv(stat));
        return created_section;
    };


    render() {

        const element_stat_box = $<HTMLDivElement>("#stat_box");
        const element_stat_point_count = $<HTMLSpanElement>("#stat-point-count");

        const created_stb = (Object.keys(StatID) as Array<keyof typeof StatID>).map(
            stat => this.makeStatSection(Game.statManager.getStat(stat))
        );

        element_stat_box.replaceChildren(...created_stb);
        write(element_stat_point_count, Game.statManager.getStatPoint());

    }

    popupMaxStatMessage() {
        const popup = new Popup();
        popup.setTitlte("이미 최대로 강화된 스탯입니다!", Color.PURPLE);
        popup.setSubTitle("다른 스탯을 강화해 보세요.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
    
    popupStatPointLackMessage() {
        const popup = new Popup();
        popup.setTitlte("스탯 포인트가 부족합니다!", Color.RED);
        popup.setSubTitle("새로운 검을 발견해 스탯 포인트를 얻어보세요.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    popupGameAllStatMessage() {
        const popup = new Popup();
        popup.setTitlte("모든 스탯을 끝까지 업그레이드 했습니다", Color.GOLD);
        popup.setSubTitle("고대 룬의 마법이 당신과 함께합니다!");
        popup.addParagraphText("창을 닫아도 게임은 계속됩니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
}
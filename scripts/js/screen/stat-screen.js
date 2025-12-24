import { onStatUp } from "../other/click_events.js";
import { $, createElement, createElementWith, createImageWithSrc, write } from "../other/element_controller.js";
import { Game } from "../other/main.js";
import { Screen } from "./screen.js";
export class StatScreen extends Screen {
    constructor() {
        super(...arguments);
        this.id = "game-stat";
    }
    makeIconDiv(img_src, onclick) {
        const created_icon_box = createElementWith("div", { classes: ["icon"] });
        created_icon_box.addEventListener("click", onclick);
        const created_stat_up = createElementWith("div", { classes: ["stat_up"] });
        created_icon_box.appendChild(createImageWithSrc(img_src));
        created_icon_box.appendChild(created_stat_up);
        return created_icon_box;
    }
    ;
    makeLevelDiv(stat) {
        const created_level_box = createElementWith("div", { classes: ["level"] });
        const created_ul = createElement("ul");
        for (let i = 0; i < stat.getMaxLevel(); i++) {
            const li_point = createElementWith("li", { classes: ["point"] });
            if (i < stat.getCurrent())
                li_point.classList.add("active");
            created_ul.appendChild(li_point);
        }
        created_level_box.appendChild(created_ul);
        return created_level_box;
    }
    ;
    makeInfoDiv(stat) {
        const created_info_box = createElementWith("div", { classes: ["info"] });
        const created_pname = createElementWith("p", { classes: ["name"] });
        write(created_pname, stat.id);
        const created_pdescription = createElementWith("p", { classes: ["description"] });
        write(created_pdescription, stat.description);
        const created_details = createElementWith("ul", { classes: ["detail"] });
        for (let i = 0; i < stat.getMaxLevel(); i++) {
            const stat_li = createElement("li");
            write(stat_li, stat.prefix + stat.values[i] + stat.suffix);
            if (stat.getCurrent() == i + 1)
                stat_li.classList.add("active");
            created_details.appendChild(stat_li);
        }
        created_info_box.appendChild(created_pname);
        created_info_box.appendChild(created_pdescription);
        created_info_box.appendChild(created_details);
        return created_info_box;
    }
    ;
    makeStatSection(stat) {
        const created_section = createElementWith("section", { classes: ["stat", stat.color] });
        created_section.appendChild(this.makeIconDiv(Game.Path[stat.id], () => onStatUp(stat.id)));
        created_section.appendChild(this.makeLevelDiv(stat));
        created_section.appendChild(this.makeInfoDiv(stat));
        return created_section;
    }
    ;
    render() {
        var _a;
        const element_stat_box = $("#stat_box");
        const element_stat_point_count = $("#stat-point-count");
        const created_stb = Object.values((_a = Game.statManager.stats) !== null && _a !== void 0 ? _a : []).map(this.makeStatSection);
        element_stat_box.replaceChildren(...created_stb);
        write(element_stat_point_count, Game.statManager.getStatPoint());
    }
}

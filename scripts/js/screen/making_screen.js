import { onClickRepairPaperMakingButton, onClickSwordMakingButton } from "../other/click_events.js";
import { $, createElementWith, createImageWithSrc, display, hide } from "../other/element_controller.js";
import { Color, MoneyItem, PieceItem, RepairPaperItem, SwordItem, UnknownItem } from "../other/entity.js";
import { Game } from "../other/main.js";
import { Popup } from "../popup/popup_message.js";
import { Keyframes, Screen } from "./screen.js";
export class MakingScreen extends Screen {
    constructor() {
        super(...arguments);
        this.id = "making";
    }
    makeMaterialDiv(item, having_count) {
        let required_count = item.count;
        const created_div = createElementWith("div", { classes: ["item"] });
        const created_img = createImageWithSrc(Game.Path[item.id]);
        created_div.appendChild(created_img);
        if (!(item instanceof MoneyItem))
            created_div.appendChild(createElementWith("span", { classes: ["name"], text: item.name }));
        const count_span = createElementWith("span", { classes: ["count"], text: (item instanceof MoneyItem) ? required_count + "원" : having_count + "/" + required_count });
        if (having_count < required_count)
            count_span.classList.add("unable");
        created_div.appendChild(count_span);
        return created_div;
    }
    ;
    makeMaterialSection(materials) {
        const created_materials = createElementWith("section", { classes: ["material"] });
        if (materials.length == 1)
            created_materials.classList.add("one");
        for (const material of materials) {
            let having_count;
            if (material instanceof MoneyItem) {
                having_count = Game.inventoryManager.getMoney();
                created_materials.appendChild(this.makeMaterialDiv(material, having_count));
            }
            else if (material instanceof SwordItem) {
                having_count = Game.inventoryManager.getSwords().getCount(material.id);
                if (Game.swordManager.isFound(material.id))
                    created_materials.appendChild(this.makeMaterialDiv(material, having_count));
                else
                    created_materials.appendChild(this.makeMaterialDiv(new UnknownItem(), having_count));
            }
            else if (material instanceof PieceItem) {
                having_count = Game.inventoryManager.getPieces().getCount(material.id);
                created_materials.appendChild(this.makeMaterialDiv(material, having_count));
            }
        }
        return created_materials;
    }
    makeResultSection(item) {
        const created_result = createElementWith("section", { classes: ["result"] });
        const created_img_div = createElementWith("div", { classes: ["item"] });
        created_img_div.appendChild(createImageWithSrc(Game.Path[item.id]));
        created_img_div.appendChild(createElementWith("span", { classes: ["name"], text: item.name }));
        if (!(item instanceof UnknownItem))
            created_img_div.appendChild(createElementWith("span", { classes: ["count"], text: "+" + item.count }));
        created_result.appendChild(created_img_div);
        return created_result;
    }
    makeGroupArticle(material_section, result_section, color, canMake, clickFunction) {
        const created_article = createElementWith("article", { classes: ["group"] });
        created_article.appendChild(material_section);
        created_article.appendChild(result_section);
        const btn = createElementWith("button", { classes: [color], text: "제작" });
        btn.addEventListener("click", clickFunction);
        btn.disabled = canMake;
        created_article.appendChild(btn);
        return created_article;
    }
    makeRepairPaperGroup(amount = 1) {
        var _a;
        const recipe = (_a = Game.makingManager.getMultipliedItems(Game.makingManager.repair_paper_recipes, amount)) !== null && _a !== void 0 ? _a : [];
        return this.makeGroupArticle(this.makeMaterialSection(recipe), this.makeResultSection(new RepairPaperItem(amount)), "blue", !Game.inventoryManager.hasItems(recipe), () => onClickRepairPaperMakingButton(amount, recipe));
    }
    makeRepairPaperPage() {
        const inner = [];
        inner.push(this.makeRepairPaperGroup(1));
        for (let i = 1; i <= 3; i++)
            inner.push(this.makeRepairPaperGroup(i * 5));
        return inner;
    }
    makeSwordPage() {
        return Game.makingManager.recipes.map(recipe => this.makeGroupArticle(this.makeMaterialSection(recipe.materials), (Game.swordManager.isFound(recipe.result.id))
            ? this.makeResultSection(recipe.result)
            : this.makeResultSection(new UnknownItem()), "purple", !(Game.inventoryManager.hasItems(recipe.materials)), () => onClickSwordMakingButton(recipe)));
    }
    animateLodding(speed, onfinish) {
        const element_loadding = $("#maker-window-lodding");
        const element_hammer = $("#maker-window-lodding div");
        display(element_loadding);
        element_loadding.animate(Keyframes.lodding_kef, { duration: speed / 2 });
        element_hammer.animate(Keyframes.hammer_kef, { duration: speed, fill: "both" }).onfinish = () => {
            onfinish();
            element_loadding.animate(Keyframes.lodding_kef, { duration: speed / 2, direction: "reverse" }).onfinish = () => hide(element_loadding);
        };
    }
    render() {
        const element_recipes = document.querySelectorAll(".recipes");
        const element_making_recipes = $("#making-recipes");
        const element_making_swords = $("#making-swords");
        const element_repair_recipes = $("#repair-recipes");
        const element_sword_recipes = $("#sword-recipes");
        if (element_making_recipes.checked)
            element_recipes.forEach(element => element.classList.remove("active"));
        else if (element_making_swords.checked)
            element_recipes.forEach(element => element.classList.add("active"));
        element_repair_recipes.replaceChildren(...this.makeRepairPaperPage());
        element_sword_recipes.replaceChildren(...this.makeSwordPage());
        element_making_recipes.addEventListener("click", () => {
            Game.makingScreen.render();
        });
        element_making_swords.addEventListener("click", () => {
            Game.makingScreen.render();
        });
    }
    popupCreatedSwordMessage() {
        const popup = new Popup();
        popup.setTitlte("검을 제작했습니다.", Color.SKY);
        popup.setSubTitle("보관함으로 검이 지급되었습니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
}

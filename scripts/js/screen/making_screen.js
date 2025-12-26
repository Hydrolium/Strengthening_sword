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
        this.elements = {};
    }
    changeBody() {
        super.changeBody();
        this.elements.recipes = document.querySelectorAll(".recipes");
        this.elements.makingRecipes = $("#making-recipes");
        this.elements.makingSwords = $("#making-swords");
        this.elements.repairRecipes = $("#repair-recipes");
        this.elements.swordRecipes = $("#sword-recipes");
        this.elements.makingRecipes.onclick = () => this.render();
        this.elements.makingSwords.onclick = () => this.render();
    }
    makeMaterialDiv(material, havingCount) {
        const created_div = createElementWith("div", { classes: ["item"] });
        const created_img = createImageWithSrc(material.imgSrc);
        created_div.appendChild(created_img);
        if (!(material instanceof MoneyItem))
            created_div.appendChild(createElementWith("span", { classes: ["name"], text: material.name }));
        const count_span = createElementWith("span", { classes: ["count"], text: (material instanceof MoneyItem) ? material.count + "원" : havingCount + "/" + material.count });
        if (havingCount < material.count)
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
            if (material instanceof MoneyItem) {
                created_materials.appendChild(this.makeMaterialDiv(material, Game.inventoryManager.getMoney()));
            }
            else if (material instanceof SwordItem) {
                const havingCount = Game.inventoryManager.getSwords().getCount(material.id);
                if (Game.swordManager.isFound(material.id))
                    created_materials.appendChild(this.makeMaterialDiv(material, havingCount));
                else
                    created_materials.appendChild(this.makeMaterialDiv(new UnknownItem(), havingCount));
            }
            else if (material instanceof PieceItem) {
                created_materials.appendChild(this.makeMaterialDiv(material, Game.inventoryManager.getPieces().getCount(material.id)));
            }
        }
        return created_materials;
    }
    makeResultSection(item) {
        const created_result = createElementWith("section", { classes: ["result"] });
        const created_imgDiv = createElementWith("div", { classes: ["item"] });
        created_imgDiv.appendChild(createImageWithSrc(item.imgSrc));
        created_imgDiv.appendChild(createElementWith("span", { classes: ["name"], text: item.name }));
        if (!(item instanceof UnknownItem))
            created_imgDiv.appendChild(createElementWith("span", { classes: ["count"], text: "+" + item.count }));
        created_result.appendChild(created_imgDiv);
        return created_result;
    }
    makeGroupArticle(material_section, resultSection, color, canMake, clickFunction) {
        const created_article = createElementWith("article", { classes: ["group"] });
        created_article.appendChild(material_section);
        created_article.appendChild(resultSection);
        const btn = createElementWith("button", { classes: [color], text: "제작" });
        btn.addEventListener("click", clickFunction);
        btn.disabled = canMake;
        created_article.appendChild(btn);
        return created_article;
    }
    makeRepairPaperGroup(amount = 1) {
        var _a;
        const recipe = (_a = Game.makingManager.getMultipliedItems(Game.makingManager.repairPaperRecipes, amount)) !== null && _a !== void 0 ? _a : [];
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
    render() {
        var _a, _b, _c, _d, _e, _f;
        if ((_a = this.elements.makingRecipes) === null || _a === void 0 ? void 0 : _a.checked)
            (_b = this.elements.recipes) === null || _b === void 0 ? void 0 : _b.forEach(element => element.classList.remove("active"));
        else if ((_c = this.elements.makingSwords) === null || _c === void 0 ? void 0 : _c.checked)
            (_d = this.elements.recipes) === null || _d === void 0 ? void 0 : _d.forEach(element => element.classList.add("active"));
        (_e = this.elements.repairRecipes) === null || _e === void 0 ? void 0 : _e.replaceChildren(...this.makeRepairPaperPage());
        (_f = this.elements.swordRecipes) === null || _f === void 0 ? void 0 : _f.replaceChildren(...this.makeSwordPage());
    }
    animateLoading(speed, onfinish) {
        const element_loadding = $("#maker-window-lodding");
        const element_hammer = $("#maker-window-lodding div");
        display(element_loadding);
        element_loadding.animate(Keyframes.loadingKef, { duration: speed / 2 });
        element_hammer.animate(Keyframes.hammerKef, { duration: speed, fill: "both" }).onfinish = () => {
            onfinish();
            element_loadding.animate(Keyframes.loadingKef, { duration: speed / 2, direction: "reverse" }).onfinish = () => hide(element_loadding);
        };
    }
    popupCreatedSwordMessage() {
        const popup = new Popup();
        popup.setTitle("검을 제작했습니다.", Color.SKY);
        popup.setSubTitle("보관함으로 검이 지급되었습니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
}

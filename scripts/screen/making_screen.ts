import { onClickRepairPaperMakingButton, onClickSwordMakingButton } from "../other/click_events.js";
import { $, createElementWith, createImageWithSrc, display, hide } from "../other/element_controller.js";
import { Color, Item, MoneyItem, PieceItem, RepairPaperItem, SwordItem, UnknownItem } from "../other/entity.js";
import { Game } from "../other/main.js";
import { Popup } from "../popup/popup_message.js";
import { Keyframes, Screen } from "./screen.js";

type ItemType = "money" | "unknown" | "piece" | "sword";
type ButtonColor = "blue" | "purple";

export class MakingScreen extends Screen {

    protected id = "making";

    private elements: {
        recipes?: NodeListOf<HTMLElement>,
        makingRecipes?: HTMLInputElement,
        makingSwords?:  HTMLInputElement,
        repairRecipes?: HTMLElement,
        swordRecipes?: HTMLElement
    } = {};

    override changeBody(): void {
        super.changeBody();

        this.elements.recipes = document.querySelectorAll(".recipes");
        
        this.elements.makingRecipes = $<HTMLInputElement>("#making-recipes");
        this.elements.makingSwords = $<HTMLInputElement>("#making-swords");
        this.elements.repairRecipes = $("#repair-recipes");
        this.elements.swordRecipes = $("#sword-recipes");

        

        this.elements.makingRecipes.onclick = () => this.render();

        this.elements.makingSwords.onclick = () => this.render();
    }

    private makeMaterialDiv(material: Item, havingCount: number): HTMLDivElement {

        const created_div = createElementWith<HTMLDivElement>("div", {classes: ["item"]});

        const created_img = createImageWithSrc(material.imgSrc);

        created_div.appendChild(created_img);

        if(!(material instanceof MoneyItem)) created_div.appendChild(createElementWith("span", {classes: ["name"], text: material.name}));

        const count_span = createElementWith("span", {classes: ["count"], text: (material instanceof MoneyItem) ? material.count + "원" : havingCount + "/" + material.count });
        if(havingCount < material.count) count_span.classList.add("unable");
        created_div.appendChild(count_span);
        return created_div;
    };
    
    private makeMaterialSection(materials: Item[]): HTMLElement {
        const created_materials = createElementWith("section", {classes: ["material"]});

        if(materials.length == 1) created_materials.classList.add("one");

        for(const material of materials) {
            
            if(material instanceof MoneyItem) {

                created_materials.appendChild(this.makeMaterialDiv(material, Game.inventoryManager.getMoney()));
            } 
            else if(material instanceof SwordItem) {
                const havingCount = Game.inventoryManager.getSwords().getCount(material.id);

                if(Game.swordManager.isFound(material.id))
                    created_materials.appendChild(this.makeMaterialDiv(material, havingCount));
                else
                    created_materials.appendChild(this.makeMaterialDiv(new UnknownItem(), havingCount));
            }
            else if(material instanceof PieceItem) {
                created_materials.appendChild(this.makeMaterialDiv(material, Game.inventoryManager.getPieces().getCount(material.id)));
            }

        }
        return created_materials;
    }
    
    private makeResultSection(item: Item): HTMLElement  {
        const created_result = createElementWith("section", {classes: ["result"]});
        const created_imgDiv = createElementWith("div", {classes: ["item"]});

        created_imgDiv.appendChild(createImageWithSrc(item.imgSrc));
        created_imgDiv.appendChild(createElementWith("span", {classes: ["name"], text: item.name}));

        if(!(item instanceof UnknownItem)) created_imgDiv.appendChild(createElementWith("span", {classes: ["count"], text: "+" + item.count}));
        created_result.appendChild(created_imgDiv);

        return created_result;
    }

    private makeGroupArticle(material_section: HTMLElement, resultSection: HTMLElement, color: ButtonColor, canMake: boolean, clickFunction: () => void) {

        const created_article = createElementWith("article", {classes: [ "group"]});

        created_article.appendChild(material_section);
        created_article.appendChild(resultSection);
        
        const btn = createElementWith<HTMLButtonElement>("button", {classes: [color], text: "제작"});
        btn.addEventListener("click", clickFunction);
        btn.disabled = canMake;

        created_article.appendChild(btn);

        return created_article;
    }
    
        
    private makeRepairPaperGroup(amount: number = 1): HTMLElement {

        const recipe = Game.makingManager.getMultipliedItems(Game.makingManager.repairPaperRecipes, amount) ?? [];

        return this.makeGroupArticle(
            this.makeMaterialSection(recipe), 
            this.makeResultSection(new RepairPaperItem(amount)),
            "blue",
            !Game.inventoryManager.hasItems(recipe), 
            () => onClickRepairPaperMakingButton(amount, recipe));
    }

    private makeRepairPaperPage(): HTMLElement[] {

        const inner: HTMLElement[] = [];

        inner.push(this.makeRepairPaperGroup(1));
        for(let i=1;i<=3;i++) inner.push(this.makeRepairPaperGroup(i*5));

        return inner;
    }

    private makeSwordPage(): HTMLElement[] {

        return Game.makingManager.recipes.map(
            recipe => this.makeGroupArticle(
                    this.makeMaterialSection(recipe.materials), 
                    (Game.swordManager.isFound(recipe.result.id))
                    ? this.makeResultSection(recipe.result)
                    : this.makeResultSection(new UnknownItem()),
                    "purple",
                    !(Game.inventoryManager.hasItems(recipe.materials)),
                    () => onClickSwordMakingButton(recipe)
                )
        );

    }

    protected render() {

        if(this.elements.makingRecipes?.checked) this.elements.recipes?.forEach(element => element.classList.remove("active"));
        else if(this.elements.makingSwords?.checked) this.elements.recipes?.forEach(element => element.classList.add("active"));

        this.elements.repairRecipes?.replaceChildren(...this.makeRepairPaperPage());
        this.elements.swordRecipes?.replaceChildren(...this.makeSwordPage());
    }

    animateLoading(speed: number, onfinish: () => void) {

        const element_loadding = $<HTMLDivElement>("#maker-window-lodding");
        const element_hammer = $<HTMLDivElement>("#maker-window-lodding div");
        
        display(element_loadding);
        element_loadding.animate(Keyframes.loadingKef, {duration: speed/2});
        element_hammer.animate(Keyframes.hammerKef, {duration: speed, fill: "both"}).onfinish = () => {
            onfinish();
            element_loadding.animate(Keyframes.loadingKef, {duration: speed/2, direction: "reverse"}).onfinish = () => hide(element_loadding);
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
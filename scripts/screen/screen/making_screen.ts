import { MakingScreenRenderingContext, ScreenDrawingContext, ScreenDrawingContextType } from "../../context/rendering/screen_rendering_context.js";
import { ScreenShowingContextType } from "../../context/rendering/screen_showing_context.js";
import { MakingScreenActions } from "../../event/making_screen_event_controller.js";
import { $, createElementWith, createImageWithSrc, display, hide, setOnClick } from "../../other/element_controller.js";
import { Item, MoneyItem, PieceItem, Recipe, RepairPaperItem,  SwordItem, UnknownItem } from "../../other/entity.js";
import { Keyframes } from "../refreshable.js";
import { Screen } from "./screen.js";

type ButtonColor = "blue" | "purple";

export class MakingScreen extends Screen {

    protected readonly _id = ScreenShowingContextType.MAKING_SCREEN_SHOWING_CONTEXT;

    private readonly _elements: {
        recipes?: NodeListOf<HTMLElement>,
        makingRecipes?: HTMLInputElement,
        makingSwords?:  HTMLInputElement,
        repairRecipes?: HTMLElement,
        swordRecipes?: HTMLElement
    } = {};

    private _actions?: MakingScreenActions;

    public setActions(actions: MakingScreenActions) {
        this._actions = actions;
    }


    protected init(): void {
        this._elements.recipes = document.querySelectorAll(".recipes");
        
        this._elements.makingRecipes = $<HTMLInputElement>("#making-recipes");
        this._elements.makingSwords = $<HTMLInputElement>("#making-swords");
        this._elements.repairRecipes = $("#repair-recipes");
        this._elements.swordRecipes = $("#sword-recipes");
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
    
    private makeMaterialSection(materials: readonly Item[], info: MakingScreenRenderingContext): HTMLElement {
        const created_materials = createElementWith("section", {classes: ["material"]});

        if(materials.length == 1) created_materials.classList.add("one");

        for(const material of materials) {
            
            if(material instanceof MoneyItem) {

                created_materials.appendChild(this.makeMaterialDiv(material, info.money));
            } 
            else if(material instanceof SwordItem) {
                const havingCount = info.havingSwords.getCount(material.id);

                if(info.foundSwordIds.has(material.id))
                    created_materials.appendChild(this.makeMaterialDiv(material, havingCount));
                else
                    created_materials.appendChild(this.makeMaterialDiv(UnknownItem.instance, havingCount));
            }
            else if(material instanceof PieceItem) {
                created_materials.appendChild(this.makeMaterialDiv(material, info.havingPieces.getCount(material.id)));
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

        public hasItem(item: Item, info: MakingScreenRenderingContext): boolean {
    
            if(
                item instanceof MoneyItem
                && info.money < item.count
            ) return false;
            else if (
                item instanceof SwordItem
                && !info.havingSwords.hasEnough(item.id, item.count)
            ) return false;
            else if (
                item instanceof PieceItem
                && !info.havingPieces.hasEnough(item.id, item.count)
            ) return false;
            else if (
                item instanceof RepairPaperItem
                && info.repairPaperCount < item.count
            ) return false;

            return true;
        }

        public hasItems(items: readonly Item[], info: MakingScreenRenderingContext): boolean {
            return items.every(item => this.hasItem(item, info));
        }
    
    private makeRepairPaperPage(recipes: readonly Recipe[], info: MakingScreenRenderingContext): readonly HTMLElement[] {

        return recipes.map(
            recipe =>
                this.makeGroupArticle(
                    this.makeMaterialSection(recipe.materials, info), 
                    this.makeResultSection(recipe.result),
                    "blue",
                    !this.hasItems(recipe.materials, info), 
                    () => this._actions?.onMaking(recipe))
        );
    }

    private makeSwordPage(recipes: readonly Recipe[], info: MakingScreenRenderingContext): readonly HTMLElement[] {
        info
        return recipes.map(
            recipe => this.makeGroupArticle(
                    this.makeMaterialSection(recipe.materials, info), 
                    (info.foundSwordIds.has(recipe.result.id))
                    ? this.makeResultSection(recipe.result)
                    : this.makeResultSection(UnknownItem.instance),
                    "purple",
                    !this.hasItems(recipe.materials, info),
                    () => this._actions?.onMaking(recipe)
                )
        );

    }

    protected render(context: ScreenDrawingContext) {

        if(context.type != ScreenDrawingContextType.MAKING_SCREEN_RENDERING_CONTEXT) return;
    
        if(this._elements.makingRecipes?.checked) this._elements.recipes?.forEach(element => element.classList.remove("active"));
        else if(this._elements.makingSwords?.checked) this._elements.recipes?.forEach(element => element.classList.add("active"));

        this._elements.repairRecipes?.replaceChildren(...this.makeRepairPaperPage(context.repairPaperRecipes, context));
        this._elements.swordRecipes?.replaceChildren(...this.makeSwordPage(context.swordRecipes, context));


        setOnClick(this._elements.makingRecipes, () => this._actions?.onClickListButton());
        setOnClick(this._elements.makingSwords, () => this._actions?.onClickListButton());

    }

    public animateLoading(speed: number, onfinish: () => void) {

        const element_loadding = $<HTMLDivElement>("#maker-window-lodding");
        const element_hammer = $<HTMLDivElement>("#maker-window-lodding div");
        
        display(element_loadding);
        element_loadding.animate(Keyframes.loadingKef, {duration: speed/2});
        element_hammer.animate(Keyframes.hammerKef, {duration: speed, fill: "both"}).onfinish = () => {
            onfinish();
            element_loadding.animate(Keyframes.loadingKef, {duration: speed/2, direction: "reverse"}).onfinish = () => hide(element_loadding);
        };
    }
}
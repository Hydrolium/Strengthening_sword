import { MakingScreenRenderingContext, ScreenDrawingContext, ScreenDrawingContextType } from "../../context/rendering/screen_drawing_context.js";
import { ScreenShowingContextType } from "../../context/rendering/screen_showing_context.js";
import { MakingScreenActions } from "../../event_controller/making_screen_event_controller.js";
import { $, createElementWith, createImageWithSrc, display, hide, setOnClick } from "../../element/element_controller.js";
import { Recipe } from "../../define/object/recipe.js";
import { UnknownItem } from "../../define/object/item.js";
import { RepairPaperItem } from "../../define/object/item.js";
import { MoneyItem } from "../../define/object/item.js";
import { SwordItem } from "../../define/object/item.js";
import { PieceItem } from "../../define/object/item.js";
import { Item } from "../../define/object/item.js";
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

    private makeMaterialDiv(material: Item, havingCount: number, clickable: boolean): HTMLDivElement {

        const created_div = createElementWith<HTMLDivElement>("div", {classes: ["item"]});
        if(clickable) created_div.classList.add("clickable");

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
                const created_materialDiv = this.makeMaterialDiv(material, info.money, true);
                created_materialDiv.addEventListener("click", () => this._actions?.onItemInfoSearch(material));
                created_materials.appendChild(created_materialDiv);
            }
            else if(material instanceof SwordItem) {
                const havingCount = info.havingSwords.getCount(material.id);
                if(info.foundSwordIds.has(material.id)) {
                    const created_materialDiv = this.makeMaterialDiv(material, havingCount, true);
                    created_materialDiv.addEventListener("click", () => this._actions?.onSwordInfoSearch(material.id));
                    created_materials.appendChild(created_materialDiv);
                } else
                    created_materials.appendChild(this.makeMaterialDiv(UnknownItem.instance, havingCount, false));
            }
            else if(material instanceof PieceItem) {
                const created_materialDiv = this.makeMaterialDiv(material, info.havingPieces.getCount(material.id), true);
                created_materialDiv.addEventListener("click", () => this._actions?.onPieceInfoSearch(material));
                created_materials.appendChild(created_materialDiv);
            }

        }
        return created_materials;
    }
    
    private makeResultSection(item: Item): HTMLElement  {
        const created_result = createElementWith("section", {classes: ["result"]});
        const created_imgDiv = createElementWith("div", {classes: ["item"]});

        if(item instanceof SwordItem) {
            created_imgDiv.classList.add("clickable");
            created_imgDiv.addEventListener("click", () => this._actions?.onSwordInfoSearch(item.id));
        } else if(item instanceof RepairPaperItem) {
            created_imgDiv.classList.add("clickable");
            created_imgDiv.addEventListener("click", () => this._actions?.onItemInfoSearch(item));
        }

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
        
        const btn = createElementWith<HTMLButtonElement>("button", {classes: [color], text: (canMake) ? "제작" : "제작 불가"});
        btn.addEventListener("click", clickFunction);
        btn.disabled = !canMake;

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
                    this.hasItems(recipe.materials, info), 
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
                    this.hasItems(recipe.materials, info),
                    () => this._actions?.onMaking(recipe)
                )
        );

    }

    protected render(context: ScreenDrawingContext) {

        if(context.type == ScreenDrawingContextType.MAKING_SCREEN_ANIMATING_CONTEXT) {
            this.animateLoading(context.speed, context.onFinish);
            return;
        }

        if(context.type != ScreenDrawingContextType.MAKING_SCREEN_RENDERING_CONTEXT) return;
    
        if(this._elements.makingRecipes?.checked) this._elements.recipes?.forEach(element => element.classList.remove("active"));
        else if(this._elements.makingSwords?.checked) this._elements.recipes?.forEach(element => element.classList.add("active"));

        this._elements.repairRecipes?.replaceChildren(...this.makeRepairPaperPage(context.repairPaperRecipes, context));
        this._elements.swordRecipes?.replaceChildren(...this.makeSwordPage(context.swordRecipes, context));

        setOnClick(this._elements.makingRecipes, () => this._actions?.onClickListButton());
        setOnClick(this._elements.makingSwords, () => this._actions?.onClickListButton());

    }

    private animateLoading(speed: number, onFinish: () => void) {

        const element_loadding = $<HTMLDivElement>("#maker-window-lodding");
        const element_hammer = $<HTMLDivElement>("#maker-window-lodding div");
        
        display(element_loadding);
        element_loadding.animate(Keyframes.loadingKef, {duration: speed/2});
        element_hammer.animate(Keyframes.hammerKef, {duration: speed, fill: "both"}).onfinish = () => {
            onFinish();
            element_loadding.animate(Keyframes.loadingKef, {duration: speed/2, direction: "reverse"}).onfinish = () => hide(element_loadding);
        };
    }
}
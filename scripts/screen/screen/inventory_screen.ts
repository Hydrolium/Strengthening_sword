import { $, createElementWith, createImageWithSrc } from "../../element/element_controller";
import { RepairPaperItem } from "../../define/object/item";
import { SwordItem } from "../../define/object/item";
import { PieceItem } from "../../define/object/item";
import { Item } from "../../define/object/item";
import { ScreenDrawingContext, ScreenDrawingContextType } from "../../context/rendering/screen_drawing_context";
import { ScreenShowingContextType } from "../../context/rendering/screen_showing_context";
import { InventoryScreenActions } from "../../event_controller/inventory_screen_event_controller";
import { Screen } from "./screen";
import { ColoredTextElement } from "../../element/colored_text";
import { Color } from "../../element/popup_info";

export class InventoryScreen extends Screen {

    protected readonly _id = ScreenShowingContextType.INVENTORY_SCREEN_SHOWING_CONTEXT;

    private readonly _elements: {
        inventoryItems?: HTMLDivElement,
        windowMain?: HTMLElement
    } = {}

    private _actions?: InventoryScreenActions;

    public setActions(actions: InventoryScreenActions) {
        this._actions = actions;
    }

    protected init() {
        this._elements.inventoryItems = $("#inventory-items");
        this._elements.windowMain = $(".inventory_window main");
    }

    private makeSwordHoverMenuDiv(sword: SwordItem): HTMLDivElement {
        const created_div = createElementWith<HTMLDivElement>("div", {classes: ["hover_menu", "hover_menu_3"]});

        const created_sellButton = createElementWith("span", {text : "판매하기"});
        const created_moveButton = createElementWith("span", {text : "꺼내기"});
        const created_breakButton = createElementWith("span", {text : "파괴하기"});

        created_sellButton.addEventListener("click", () => this._actions?.onSwordItemSell(sword));
        created_moveButton.addEventListener("click", () => this._actions?.onSwordSwap(sword));
        created_breakButton.addEventListener("click", () => this._actions?.onSwordItemBreak(sword));

        created_div.appendChild(created_sellButton);
        created_div.appendChild(created_moveButton);
        created_div.appendChild(created_breakButton);
        
        return created_div;
    }

    private makePieceHoverMenuDiv(piece: PieceItem): HTMLDivElement {
        const created_div = createElementWith<HTMLDivElement>("div", {classes: ["hover_menu", "hover_menu_1"]});

        const created_whereButton = createElementWith("span", {text : "획득처"});

        created_whereButton.addEventListener("click", () => this._actions?.onSwordsByPieceSearch(piece));

        created_div.appendChild(created_whereButton);

        
        return created_div;
    }

    private makeInventoryArticle(item: Item): HTMLElement {

        const created_article = createElementWith("article", {classes: ["group"]});

        const created_div = createElementWith("div", {classes: ["item"]});
        const created_img = createImageWithSrc(item.imgSrc);

        if(item instanceof SwordItem) created_div.appendChild(this.makeSwordHoverMenuDiv(item));
        if(item instanceof PieceItem) created_div.appendChild(this.makePieceHoverMenuDiv(item))

        created_div.appendChild(created_img);

        created_article.appendChild(created_div);
        created_article.appendChild(createElementWith("p", {classes: ["item_name"], text: item.name}));
        created_article.appendChild(createElementWith("p", {classes: ["item_count"], text: `x ${item.count}`}));

        return created_article;
    }

    private makeRepairGroupSection(repairPaperCount: number): HTMLElement {
        const created_repairGroup = createElementWith("section", {classes: ["item_group"]});

        const created_group_title = createElementWith("div", {classes: [ "underline", "bok"]});
        created_group_title.replaceChildren(...new ColoredTextElement().add("복구권", Color.GOLD).build());

        created_repairGroup.appendChild(created_group_title);
        created_repairGroup.appendChild(
            this.makeInventoryArticle(new RepairPaperItem(repairPaperCount)),
        )
        return created_repairGroup;
    }

    private makePieceGroupSection(pieceItemList: readonly PieceItem[]): HTMLElement {
        const created_pieceGroup = createElementWith("section", {classes: ["item_group"]});

        const created_group_title = createElementWith("div", {classes: [ "underline", "pie"]});
        created_group_title.replaceChildren(...new ColoredTextElement().add("조각", Color.GREEN).add(" (마우스를 아이콘 위에 올려 메뉴 확인)", Color.DARK_GRAY).build());

        created_pieceGroup.appendChild(created_group_title);
        pieceItemList.forEach(
            pieceItem => created_pieceGroup.appendChild(this.makeInventoryArticle(pieceItem)));
        return created_pieceGroup;
    }

    private makeSwordGroupSection(swordItemList: readonly SwordItem[]): HTMLElement {
        const created_swordGroup = createElementWith("section", {classes: ["item_group"]});

        const created_group_title = createElementWith("div", {classes: [ "underline", "swo"]});
        created_group_title.replaceChildren(...new ColoredTextElement().add("검", Color.BLUE).add(" (마우스를 아이콘 위에 올려 메뉴 확인)", Color.DARK_GRAY).build());

        created_swordGroup.appendChild(created_group_title);

        swordItemList.forEach(
            swordItem => {
                created_swordGroup.appendChild(
                    this.makeInventoryArticle(swordItem)
                );
            });

        return created_swordGroup;
    }   

    protected render(context?: ScreenDrawingContext) {

        if(context?.type != ScreenDrawingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT) return;

        const inner = [];   

        if(context.repairPapers > 0) inner.push(this.makeRepairGroupSection(context.repairPapers));

        if(context.pieceStorage.size != 0) inner.push(this.makePieceGroupSection(context.pieceStorage.sorted((a, b) => a.count - b.count)));
        
        if(context.swordStorage.size != 0) inner.push(this.makeSwordGroupSection(Array.from(context.swordStorage.getAll())));
        
        if(context.pieceStorage.size == 0 && context.swordStorage.size == 0) {
            this._elements.windowMain?.classList.add("empty_inventory");
            
            if(context.repairPapers <= 0) inner.push(createElementWith("p", {classes: ["no_item"], text: "보관된 아이템이 없습니다."}));
        } else this._elements.windowMain?.classList.remove("empty_inventory");

        this._elements.inventoryItems?.replaceChildren(...inner);


    }
}
import { onClickSwordBreakButton, onClickSwordItemSellButton, onClickSwordSwapButton } from "../other/click_events.js";
import { ContextType, GameContext } from "../other/context.js";
import { $, createElementWith, createImageWithSrc } from "../other/element_controller.js";
import { Color, Item, PieceItem, RepairPaperItem, Sword, SwordItem } from "../other/entity.js";
import { Game } from "../other/main.js";
import { ButtonType, ColoredText, HoverEffect, Popup } from "../popup/popup_message.js";
import { Screen } from "./screen.js";

export class InventoryScreen extends Screen {

    protected id = "inventory";

    private elements: {
        inventoryItems?: HTMLDivElement,
        windowMain?: HTMLElement
    } = {}

    override changeBody() {
        super.changeBody();

        this.elements.inventoryItems = $("#inventory-items");
        this.elements.windowMain = $(".inventory_window main");
    }

    private makeSwordHoverMenuDiv(sword: Item): HTMLDivElement {
        const created_div = createElementWith<HTMLDivElement>("div", {classes: ["hover_sell"]});

        const created_sellButton = createElementWith("span", {text : "판매하기"});
        const created_moveButton = createElementWith("span", {text : "꺼내기"});
        const created_breakButton = createElementWith("span", {text : "파괴하기"});

        created_sellButton.addEventListener("click", () => onClickSwordItemSellButton(sword.id));
        created_moveButton.addEventListener("click", () => onClickSwordSwapButton(sword.id));
        created_breakButton.addEventListener("click", () => onClickSwordBreakButton(sword.id));

        created_div.appendChild(created_sellButton);
        created_div.appendChild(created_moveButton);
        created_div.appendChild(created_breakButton);
        
        return created_div;
    }

    private makeInventoryArticle(item: Item): HTMLElement {

        const created_article = createElementWith("article", {classes: ["group"]});

        const created_div = createElementWith("div", {classes: ["item"]});
        const created_img = createImageWithSrc(item.imgSrc);

        if(item instanceof SwordItem) created_div.appendChild(this.makeSwordHoverMenuDiv(item));

        created_div.appendChild(created_img);

        created_article.appendChild(created_div);
        created_article.appendChild(createElementWith("p", {classes: ["item_name"], text: item.name}));
        created_article.appendChild(createElementWith("p", {classes: ["item_count"], text: `${item.count}`}));

        return created_article;
    }

    private makeRepairGroupSection(): HTMLElement {
        const created_repairGroup = createElementWith("section", {classes: ["item_group"]});
        created_repairGroup.appendChild(createElementWith("div", {classes: [ "underline", "bok"]}));
        created_repairGroup.appendChild(
            this.makeInventoryArticle(new RepairPaperItem(Game.inventoryManager.getRepairPaper())),
        )
        return created_repairGroup;
    }

    private makePieceGroupSection(pieceList: PieceItem[]): HTMLElement {
        const created_pieceGroup = createElementWith("section", {classes: ["item_group"]});
        created_pieceGroup.appendChild(createElementWith("div", {classes: ["underline", "pie"]}));
        pieceList.forEach(
            piece => created_pieceGroup.appendChild(this.makeInventoryArticle(piece)));
        return created_pieceGroup;
    }

    private makeSwordGroupSection(swordList: SwordItem[]): HTMLElement {
        const created_swordGroup = createElementWith("section", {classes: ["item_group"]});
        created_swordGroup.appendChild(createElementWith("div", {classes: ["underline", "swo"]}));

        swordList.forEach(
            sword => {
                created_swordGroup.appendChild(
                    this.makeInventoryArticle(sword)
                );
            });



        return created_swordGroup;
    }   

    protected render(context?: GameContext) {

        if(context?.type != ContextType.INVENTORY) return;

        const inner = [];   

        if(context.repairPapers > 0) inner.push(this.makeRepairGroupSection());

        if(context.pieces.length != 0) inner.push(this.makePieceGroupSection(context.pieces.sorted((a, b) => a.count - b.count)));
        
        if(context.swords.length != 0) inner.push(this.makeSwordGroupSection(context.swords.sorted((a, b) => Game.swordManager.getIndex(a.id) - Game.swordManager.getIndex(b.id))));
        
        if(context.pieces.length == 0 && context.swords.length == 0) {
            this.elements.windowMain?.classList.add("empty_inventory");
            
            if(context.repairPapers <= 0) inner.push(createElementWith("p", {classes: ["no_item"], text: "보관된 아이템이 없습니다."}));
        } else this.elements.windowMain?.classList.remove("empty_inventory");

        this.elements.inventoryItems?.replaceChildren(...inner);


    }

    popupSwordItemBreakMessage(sword: Sword, breakFunc: () => void) {
        const popup = new Popup();
        popup.setTitle("정말로 검을 파괴하시겠습니까?", Color.BROWN);

        // popup.setSubTitle("")

        if(sword.pieces.length > 0) {

            popup.addParagraphText("다음 조각이 확률적으로 떨어집니다.");
            sword.pieces.forEach(
                piece => {
                    const created_div = createElementWith("div", {classes: ["dropped_piece_info"]});
                    created_div.appendChild(createImageWithSrc(piece.imgSrc));
                    created_div.appendChild(createElementWith("span", {classes: ["name"], text: piece.name}));
                    created_div.appendChild(createElementWith("span", {classes: ["count"], text: `0~${piece.maxDrop}개`}));

                    popup.addParagraphElement(created_div);
                }
            )

        } else {
            popup.addParagraphText("해당 검은 아무런 조각도 떨어뜨리지 않습니다.");
        }

        popup.addButton(
            "파괴하기", Color.BROWN, ButtonType.MAKE, HoverEffect.DECREASE, breakFunc
        )
        popup.addCloseButton();

        popup.build();
        popup.show();
    }

    popupBreakMessage(pieces: PieceItem[]) {
        
        const popup = new Popup();
        popup.setTitle("검을 파괴했습니다.", Color.BLUE);

        if(pieces.length > 0) {
            popup.addParagraphText("<떨어진 조각 목록>");
            pieces.forEach(
                pieceItem => {
                    const created_div = createElementWith("div", {classes: ["dropped_piece_info"]});
                    created_div.appendChild(createImageWithSrc(pieceItem.imgSrc));
                    created_div.appendChild(createElementWith("span", {classes: ["name"], text: pieceItem.name}));
                    created_div.appendChild(createElementWith("span", {classes: ["count"], text: pieceItem.count}));

                    popup.addParagraphElement(created_div);
                }
            );
        } else popup.addParagraphText("이런! 아무런 조각도 떨어지지 않았습니다.");

        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    popupSwordItemSellMessage(sword: Sword, sellFunc: (popup: Popup) => void) {
        const popup = new Popup();
        popup.setTitle("정말로 검을 판매하시겠습니까?", Color.BROWN);

        popup.addParagraphElement(
            new ColoredText<HTMLParagraphElement>("p").add("획득 가능한 금액: ", Color.DARK_GRAY).add(sword.price, Color.GOLD).add("원", Color.DARK_GRAY).build()
        );

        popup.addButton(
            "판매하기", Color.BROWN, ButtonType.SELL, HoverEffect.INCREASE, sellFunc
        )
        popup.addCloseButton();

        popup.build();
        popup.show();
    }
}
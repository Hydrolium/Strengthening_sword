import { onClickSwordBreakButton, onClickSwordItemSellButton, onClickSwordSwapButton } from "../other/click_events.js";
import { $, createElementWith, createImageWithSrc } from "../other/element_controller.js";
import { Color, ContextType, RepairPaperItem, SwordItem } from "../other/entity.js";
import { Game } from "../other/main.js";
import { ButtonType, ColoredText, HoverEffect, Popup } from "../popup/popup_message.js";
import { Screen } from "./screen.js";
export class InventoryScreen extends Screen {
    constructor() {
        super(...arguments);
        this.id = "inventory";
    }
    makeSwordHoverMenuDiv(sword) {
        const created_div = createElementWith("div", { classes: ["hover_sell"] });
        const created_sell_button = createElementWith("span", { text: "판매하기" });
        const created_move_button = createElementWith("span", { text: "꺼내기" });
        const created_break_button = createElementWith("span", { text: "파괴하기" });
        created_sell_button.addEventListener("click", () => onClickSwordItemSellButton(sword.id));
        created_move_button.addEventListener("click", () => onClickSwordSwapButton(sword.id));
        created_break_button.addEventListener("click", () => onClickSwordBreakButton(sword.id));
        created_div.appendChild(created_sell_button);
        created_div.appendChild(created_move_button);
        created_div.appendChild(created_break_button);
        return created_div;
    }
    makeInventoryArticle(item) {
        const created_article = createElementWith("article", { classes: ["group"] });
        const created_div = createElementWith("div", { classes: ["item"] });
        const created_img = createImageWithSrc(Game.Path[item.id]);
        if (item instanceof SwordItem)
            created_div.appendChild(this.makeSwordHoverMenuDiv(item));
        created_div.appendChild(created_img);
        created_article.appendChild(created_div);
        created_article.appendChild(createElementWith("p", { classes: ["item_name"], text: item.name }));
        created_article.appendChild(createElementWith("p", { classes: ["item_count"], text: `${item.count}` }));
        return created_article;
    }
    makeRepairGroupSection() {
        const created_repair_group = createElementWith("section", { classes: ["item_group"] });
        created_repair_group.appendChild(createElementWith("div", { classes: ["underline", "bok"] }));
        created_repair_group.appendChild(this.makeInventoryArticle(new RepairPaperItem(Game.inventoryManager.getRepairPaper())));
        return created_repair_group;
    }
    makePieceGroupSection(pieceList) {
        const created_piece_group = createElementWith("section", { classes: ["item_group"] });
        created_piece_group.appendChild(createElementWith("div", { classes: ["underline", "pie"] }));
        pieceList.forEach(piece => created_piece_group.appendChild(this.makeInventoryArticle(piece)));
        return created_piece_group;
    }
    makeSwordGroupSection(swordList) {
        const created_sword_group = createElementWith("section", { classes: ["item_group"] });
        created_sword_group.appendChild(createElementWith("div", { classes: ["underline", "swo"] }));
        swordList.forEach(sword => {
            created_sword_group.appendChild(this.makeInventoryArticle(sword));
        });
        return created_sword_group;
    }
    render(context) {
        if ((context === null || context === void 0 ? void 0 : context.type) != ContextType.INVENTORY)
            return;
        const element_inventory_items = $("#inventory-items");
        const element_window_main = $(".inventory_window main");
        const inner = [];
        if (context.repair_papers > 0)
            inner.push(this.makeRepairGroupSection());
        if (context.pieces.length != 0)
            inner.push(this.makePieceGroupSection(context.pieces.sorted((a, b) => a.count - b.count)));
        if (context.swords.length != 0)
            inner.push(this.makeSwordGroupSection(context.swords.sorted((a, b) => Game.swordManager.getIndex(a.id) - Game.swordManager.getIndex(b.id))));
        if (context.pieces.length == 0 && context.swords.length == 0) {
            element_window_main.classList.add("empty_inventory");
            if (context.repair_papers <= 0)
                inner.push(createElementWith("p", { classes: ["no_item"], text: "보관된 아이템이 없습니다." }));
        }
        else
            element_window_main.classList.remove("empty_inventory");
        element_inventory_items.replaceChildren(...inner);
    }
    popupSwordItemBreakMessage(sword, breakFunc) {
        const popup = new Popup();
        popup.setTitlte("정말로 검을 파괴하시겠습니까?", Color.BROWN);
        // popup.setSubTitle("")
        if (sword.pieces.length > 0) {
            popup.addParagraphText("다음 조각이 확률적으로 떨어집니다.");
            sword.pieces.forEach(piece => {
                const created_div = createElementWith("div", { classes: ["dropped_piece_info"] });
                created_div.appendChild(createImageWithSrc(Game.Path[piece.id]));
                created_div.appendChild(createElementWith("span", { classes: ["name"], text: piece.name }));
                created_div.appendChild(createElementWith("span", { classes: ["count"], text: `0~${piece.max_drop}개` }));
                popup.addParagraphElement(created_div);
            });
        }
        else {
            popup.addParagraphText("해당 검은 아무런 조각도 떨어뜨리지 않습니다.");
        }
        popup.addButton("파괴하기", Color.BROWN, ButtonType.MAKE, HoverEffect.DECREASE, breakFunc);
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
    popupBreakMessage(pieces) {
        const popup = new Popup();
        popup.setTitlte("검을 파괴했습니다.", Color.BLUE);
        if (pieces.length > 0) {
            popup.addParagraphText("<떨어진 조각 목록>");
            pieces.forEach(pieceItem => {
                const created_div = createElementWith("div", { classes: ["dropped_piece_info"] });
                created_div.appendChild(createImageWithSrc(Game.Path[pieceItem.id]));
                created_div.appendChild(createElementWith("span", { classes: ["name"], text: pieceItem.name }));
                created_div.appendChild(createElementWith("span", { classes: ["count"], text: pieceItem.count }));
                popup.addParagraphElement(created_div);
            });
        }
        else
            popup.addParagraphText("이런! 아무런 조각도 떨어지지 않았습니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
    popupSwordItemSellMessage(sword, sellFunc) {
        const popup = new Popup();
        popup.setTitlte("정말로 검을 판매하시겠습니까?", Color.BROWN);
        popup.addParagraphElement(new ColoredText("p").add("획득 가능한 금액: ", Color.DARK_GRAY).add(sword.price, Color.GOLD).add("원", Color.DARK_GRAY).build());
        popup.addButton("판매하기", Color.BROWN, ButtonType.SELL, HoverEffect.INCREASE, sellFunc);
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
}

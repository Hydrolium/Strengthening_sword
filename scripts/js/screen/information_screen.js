import { onClickSwordInfoButton } from "../other/click_events.js";
import { ContextType } from "../other/context.js";
import { $, createElementWith, createImageWithSrc, write } from "../other/element_controller.js";
import { Color, SwordItem, UnknownItem } from "../other/entity.js";
import { ColoredTextElement, Popup } from "../popup/popup_message.js";
import { Screen } from "./screen.js";
export class InformationScreen extends Screen {
    constructor() {
        super(...arguments);
        this.id = "game-information";
        this.elements = {};
    }
    changeBody() {
        super.changeBody();
        this.elements.foundSwords = $("#found-swords");
        this.elements.swordCount = $("#found-sword-count");
    }
    makeIcon(item) {
        const created_div = createElementWith("div", { classes: ["sword_icon", (item instanceof SwordItem) ? "sword" : "unknown"] });
        created_div.appendChild(createImageWithSrc(item.imgSrc, item.name));
        if (item instanceof SwordItem) {
            created_div.appendChild(createElementWith("span", { classes: ["sword_name"], text: item.name }));
            created_div.addEventListener("click", () => onClickSwordInfoButton(item.id));
        }
        return created_div;
    }
    render(context) {
        var _a;
        if ((context === null || context === void 0 ? void 0 : context.type) != ContextType.FOUND_SWORDS)
            return;
        const created_found = context.swords.map((sword, index) => {
            if (context.founds.has(index))
                return this.makeIcon(sword.toItem());
            return this.makeIcon(UnknownItem.instance);
        });
        (_a = this.elements.foundSwords) === null || _a === void 0 ? void 0 : _a.replaceChildren(...created_found);
        write(this.elements.swordCount, context.founds.size);
    }
    popupSwordInfoMessage(sword) {
        const popup = new Popup();
        popup.setIcon(sword.imgSrc);
        popup.setTitle(`${sword.index}강: ${sword.name}`, Color.PURPLE);
        if (sword.prob > 0)
            popup.addColoredParagraph(new ColoredTextElement().add("강화 확률: ", Color.DARK_GRAY).add(sword.prob * 100, Color.GOLD).add("%", Color.DARK_GRAY));
        if (sword.cost > 0)
            popup.addColoredParagraph(new ColoredTextElement().add("강화 비용: ", Color.DARK_GRAY).add(sword.cost, Color.GOLD).add("원", Color.DARK_GRAY));
        if (sword.price > 0)
            popup.addColoredParagraph(new ColoredTextElement().add("판매 가격: ", Color.DARK_GRAY).add(sword.price, Color.GOLD).add("원", Color.DARK_GRAY));
        else
            popup.addColoredParagraph(new ColoredTextElement().add("판매 가격: ", Color.DARK_GRAY).add("판매 불가.", Color.RED));
        if (sword.requiredRepairs > 0)
            popup.addColoredParagraph(new ColoredTextElement().add("복구 시 필요한 복구권 갯수: ", Color.DARK_GRAY).add(sword.requiredRepairs, Color.GOLD).add("개", Color.DARK_GRAY));
        popup.addParagraphText("");
        if (sword.pieces.length > 0) {
            popup.addParagraphText("파괴 시 획득 가능한 조각 목록");
            sword.pieces.forEach(piece => {
                const created_div = createElementWith("div", { classes: ["img_name_count_paragraph"] });
                created_div.appendChild(createImageWithSrc(piece.imgSrc));
                new ColoredTextElement()
                    .add(`${piece.name}`, Color.DARK_BLUE)
                    .add(`이(가) `, Color.DARK_GRAY)
                    .add(`${piece.prob * 100}`, Color.PURPLE)
                    .add(`% 확률로 `, Color.DARK_GRAY)
                    .add((piece.maxDrop == 1) ? "1" : `1~${piece.maxDrop}`, Color.GOLD)
                    .add(`개`, Color.DARK_GRAY)
                    .build()
                    .forEach(element => created_div.appendChild(element));
                popup.addParagraphElement(created_div);
            });
        }
        else
            popup.addParagraphText("파괴 시 획득 가능한 조각이 없습니다.");
        popup.setFooter("*해당 정보는 강화소의 스탯이 계산되지 않은 정보입니다*", Color.RED);
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
}

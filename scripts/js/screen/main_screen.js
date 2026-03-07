import { onClickInitButton, onClickRepairButton, onClickSaveButton, onClickSellButton, onClickUpgradeButton } from "../other/click_events.js";
import { ContextType } from "../other/context.js";
import { $, createElementWith, createImageWithSrc, invisible, visible } from "../other/element_controller.js";
import { Color } from "../other/entity.js";
import { ButtonType, HoverEffect, Popup } from "../popup/popup_message.js";
import { Screen } from "./screen.js";
import { write } from "../other/element_controller.js";
import { ColoredTextElement } from "../other/colored_text.js";
export class MainScreen extends Screen {
    constructor() {
        super(...arguments);
        this._id = "game-interface";
        this._elements = {};
    }
    changeBody() {
        super.changeBody();
        this._elements.swordImage = $("#sword-image");
        this._elements.swordNumber = $("#sword-number");
        this._elements.swordName = $("#sword-name");
        this._elements.swordProb = $("#sword-prob");
        this._elements.swordCost = $("#sword-cost");
        this._elements.swordPrice = $("#sword-price");
        this._elements.sellButton = $("#sell-button");
        this._elements.upgradeButton = $("#upgrade-button");
        this._elements.saveButton = $("#save-button");
        this._elements.sellButton.onclick = () => onClickSellButton();
        this._elements.upgradeButton.onclick = () => onClickUpgradeButton();
        this._elements.saveButton.onclick = () => onClickSaveButton();
    }
    render(context) {
        var _a, _b, _c;
        if ((context === null || context === void 0 ? void 0 : context.type) != ContextType.SWORD)
            return;
        this._elements.swordImage.src = context.sword.imgSrc;
        write(this._elements.swordNumber, context.index);
        if (context.isMax)
            (_a = this._elements.swordNumber) === null || _a === void 0 ? void 0 : _a.classList.add("hightlight");
        write(this._elements.swordName, context.sword.name);
        (_b = this._elements.swordProb) === null || _b === void 0 ? void 0 : _b.setAttribute("enabled", `${!context.isMax}`);
        (_c = this._elements.swordCost) === null || _c === void 0 ? void 0 : _c.setAttribute("enabled", `${!context.isMax}`);
        if (!context.isMax) {
            const prob = context.sword.prob;
            write(this._elements.swordProb, Math.round(prob * 100));
            write(this._elements.swordCost, `${context.sword.cost}`);
        }
        else {
            write(this._elements.swordProb, "");
            write(this._elements.swordCost, "");
        }
        if (context.sword.price > 0) {
            write(this._elements.swordPrice, `${context.sword.price}`);
            visible(this._elements.sellButton);
            visible(this._elements.swordPrice);
        }
        else {
            invisible(this._elements.swordPrice);
            invisible(this._elements.sellButton);
        }
        if (context.sword.canSave)
            visible(this._elements.saveButton);
        else
            invisible(this._elements.saveButton);
    }
    popupFallMessage(loss, pieces, havingRepairPaper, requiredRepairPaper) {
        const popup = new Popup();
        popup.setTitle("파괴되었습니다", Color.RED);
        popup.setSubTitle(`손실: ${loss}원`);
        if (pieces.length > 0) {
            popup.addParagraphText("<떨어진 조각 목록>");
            pieces.forEach(pieceItem => {
                const created_div = createElementWith("div", { classes: ["img_name_count_paragraph"] });
                created_div.appendChild(createImageWithSrc(pieceItem.imgSrc));
                new ColoredTextElement()
                    .add(`${pieceItem.name}`, Color.DARK_BLUE)
                    .add(` x `, Color.DARK_GRAY)
                    .add(`${pieceItem.count}`, Color.GOLD)
                    .add(`개`, Color.DARK_GRAY)
                    .build()
                    .forEach(element => created_div.appendChild(element));
                popup.addParagraphElement(created_div);
            });
        }
        else
            popup.addParagraphText("이런! 아무런 조각도 떨어지지 않았습니다.");
        if (havingRepairPaper >= requiredRepairPaper) {
            popup.addButton("복구하기", Color.GREEN, ButtonType.REPAIR, HoverEffect.INCREASE, () => onClickRepairButton());
            popup.setFooter(`복구권 ${requiredRepairPaper}개로 복구할 수 있습니다. (${havingRepairPaper}/${requiredRepairPaper})`, Color.SKY);
        }
        else {
            popup.setFooter(`복구권이 부족하여 복구할 수 없습니다. (${havingRepairPaper}/${requiredRepairPaper})`, Color.RED);
        }
        popup.addButton("다시하기", Color.DARK_BLUE, ButtonType.REGAME, HoverEffect.TURNING, () => onClickInitButton());
        popup.build();
        popup.show();
    }
    popupMaxUpgradeMessage() {
        const popup = new Popup();
        popup.setTitle("축하합니다!", Color.GOLD);
        popup.setSubTitle("최대 강화에 도달했습니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
    popupMoneyLackMessage() {
        const popup = new Popup();
        popup.setTitle("돈이 부족합니다.", Color.RED);
        popup.setSubTitle("다음을 통해 자금을 조달하세요.");
        popup.addParagraphText("현재 검 판매");
        popup.addParagraphText("인벤토리에 보관된 검 판매");
        popup.addParagraphText("제작소에서 검 제작");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
    popupInvalidationMessage(pieces) {
        const popup = new Popup();
        popup.setTitle("검이 파괴되었지만 복구되었습니다.", Color.BLUE);
        popup.setSubTitle("강화 비용 또한 반환되었습니다!");
        if (pieces.length > 0) {
            popup.addParagraphText("<떨어진 조각 목록>");
            pieces.forEach(pieceItem => {
                const created_div = createElementWith("div", { classes: ["img_name_count_paragraph"] });
                created_div.appendChild(createImageWithSrc(pieceItem.imgSrc));
                new ColoredTextElement()
                    .add(`${pieceItem.name}`, Color.DARK_BLUE)
                    .add(` x `, Color.DARK_GRAY)
                    .add(`${pieceItem.count}`, Color.GOLD)
                    .add(`개`, Color.DARK_GRAY)
                    .build()
                    .forEach(element => created_div.appendChild(element));
                popup.addParagraphElement(created_div);
            });
        }
        else
            popup.addParagraphText("아쉽게도 떨어진 조각은 없네요.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
    popupGodHandMessage(new_sword_index) {
        const popup = new Popup();
        popup.setTitle("신의 손 발동!", Color.GREEN);
        popup.setSubTitle("검이 2단계 상승했습니다.");
        popup.addParagraphText(`${new_sword_index} 강이 되었습니다!`);
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
    popupGameEndMessage() {
        const popup = new Popup();
        popup.setTitle("검을 최종 단계까지 업그레이드 했습니다.", Color.GOLD);
        popup.setSubTitle("충만한 검의 기운이 당신과 함께합니다!");
        popup.addParagraphText("창을 닫아도 게임은 계속됩니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
}

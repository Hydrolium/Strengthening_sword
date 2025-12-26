import { onClickInitButton, onClickRepairButton, onClickSaveButton, onClickSellButton, onClickUpgradeButton } from "../other/click_events.js";
import { ContextType, GameContext } from "../other/context.js";
import { $, createElementWith, createImageWithSrc, invisible, visible } from "../other/element_controller.js";
import { Color, PieceItem } from "../other/entity.js";
import { Game } from "../other/main.js";
import { ButtonType, HoverEffect, Popup } from "../popup/popup_message.js";
import { Screen } from "./screen.js";
import { write } from "../other/element_controller.js";

export class MainScreen extends Screen {

    protected id = "game-interface";

    private elements : {
        swordImage?: HTMLImageElement,
        swordNumber?: HTMLSpanElement,
        swordName?: HTMLSpanElement,
        swordProb?: HTMLSpanElement,
        swordCost?: HTMLSpanElement,
        swordPrice?: HTMLSpanElement,
        sellButton?: HTMLAnchorElement,
        upgradeButton?: HTMLAnchorElement,
        saveButton?: HTMLAnchorElement
    } = {};

    override changeBody() {
        super.changeBody();
        
        this.elements.swordImage = $<HTMLImageElement>("#sword-image");

        this.elements.swordNumber = $<HTMLSpanElement>("#sword-number");
        this.elements.swordName = $<HTMLSpanElement>("#sword-name");
        this.elements.swordProb = $<HTMLSpanElement>("#sword-prob");
        this.elements.swordCost = $<HTMLSpanElement>("#sword-cost");
        this.elements.swordPrice = $<HTMLSpanElement>("#sword-price");

        this.elements.sellButton = $<HTMLAnchorElement>("#sell-button");
        this.elements.upgradeButton = $<HTMLAnchorElement>("#upgrade-button");
        this.elements.saveButton = $<HTMLAnchorElement>("#save-button");

        this.elements.sellButton.onclick = () => onClickSellButton();
        this.elements.upgradeButton.onclick = () => onClickUpgradeButton();
        this.elements.saveButton.onclick = () => onClickSaveButton();
    }

    protected render(context?: GameContext) {

        if(context?.type != ContextType.SWORD) return;


        this.elements.swordImage!.src = context.sword.imgSrc;

        write(this.elements.swordNumber, context.index);

        if(context.isMax) this.elements.swordNumber?.classList.add("hightlight");

        write(this.elements.swordName, context.sword.name);

        this.elements.swordProb?.setAttribute("enabled", `${!context.isMax}`);
        this.elements.swordCost?.setAttribute("enabled", `${!context.isMax}`);

        if(!context.isMax) {

            const prob = context.sword.prob;

            write(this.elements.swordProb, Math.round(prob*100));
            write(this.elements.swordCost, `${context.sword.cost}`);
        } else {
            write(this.elements.swordProb, "");
            write(this.elements.swordCost, "");
        }

        if(context.sword.price > 0) {
            write(this.elements.swordPrice, `${context.sword.price}`);
            visible(this.elements.sellButton);
            visible(this.elements.swordPrice);
        } else {
            invisible(this.elements.swordPrice);
            invisible(this.elements.sellButton);
        }

        if(context.sword.canSave) visible(this.elements.saveButton);
        else invisible(this.elements.saveButton);
    }

    popupFallMessage(loss: number, pieces: PieceItem[], havingRepairPaper: number, requiredRepairPaper: number) {


        const popup = new Popup();
        popup.setTitle("파괴되었습니다", Color.RED);
        popup.setSubTitle(`손실: ${loss}원`);

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
        
        if(havingRepairPaper >= requiredRepairPaper) {
            popup.addButton(
                "복구하기", Color.GREEN, ButtonType.REPAIR, HoverEffect.INCREASE, () => onClickRepairButton()
            );
            popup.setFooter(
                `복구권 ${requiredRepairPaper}개로 복구할 수 있습니다. (${havingRepairPaper}/${requiredRepairPaper})`, Color.SKY
            );
        } else {
            popup.setFooter(
                `복구권이 부족하여 복구할 수 없습니다. (${havingRepairPaper}/${requiredRepairPaper})`, Color.RED
            );
        }

        popup.addButton(
            "다시하기", Color.DARK_BLUE, ButtonType.REGAME, HoverEffect.TURNING, () => onClickInitButton()
        );

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

    popupInvalidationMessage(pieces: PieceItem[]) {

        const popup = new Popup();
        popup.setTitle("검이 파괴되었지만 복구되었습니다.", Color.BLUE);
        popup.setSubTitle("강화 비용 또한 반환되었습니다!");

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

    popupGodHandMessage(new_sword_index: number) {
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

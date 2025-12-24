import { onClickInitButton, onClickRepairButton, onClickSaveButton, onClickSellButton, onClickUpgradeButton } from "../other/click_events.js";
import { ContextType, GameContext } from "../other/context.js";
import { $, createElementWith, createImageWithSrc, invisible, visible, write } from "../other/element_controller.js";
import { Color, PieceItem } from "../other/entity.js";
import { Game } from "../other/main.js";
import { ButtonType, HoverEffect, Popup } from "../popup/popup_message.js";
import { Screen } from "./screen.js";

export class MainScreen extends Screen {

    id = "game-interface";

    render(context?: GameContext) {

        if(context?.type != ContextType.SWORD) return;

        const element_sword_image = $<HTMLImageElement>("#sword-image");

        const element_sword_number = $<HTMLSpanElement>("#sword-number");
        const element_sword_name = $<HTMLSpanElement>("#sword-name");
        const element_sword_prob = $<HTMLSpanElement>("#sword-prob");
        const element_sword_cost = $<HTMLSpanElement>("#sword-cost");
        const element_sword_price = $<HTMLSpanElement>("#sword-price");

        const element_sell_button = $<HTMLAnchorElement>("#sell-button");
        const element_save_button = $<HTMLAnchorElement>("#save-button");

        element_sword_image.src = Game.Path[context.sword.id];

        write(element_sword_number, context.index);

        if(context.isMax) element_sword_number?.classList.add("hightlight");

        write(element_sword_name, context.sword.name);

        element_sword_prob?.setAttribute("enabled", `${!context.isMax}`);
        element_sword_cost?.setAttribute("enabled", `${!context.isMax}`);

        if(!context.isMax) {

            const prob = context.sword.prob;

            write(element_sword_prob, Math.floor(prob*100));
            write(element_sword_cost, context.sword.cost);
        } else {
            write(element_sword_prob, "");
            write(element_sword_cost, "");
        }

        if(context.sword.price > 0) {
            write(element_sword_price, context.sword.price);
            visible(element_sell_button);
            visible(element_sword_price);
        } else {
            invisible(element_sword_price);
            invisible(element_sell_button);
        }

        if(context.sword.canSave) visible(element_save_button);
        else invisible(element_save_button);

        this.addEventListender();

    }

    private addEventListender() {

        $("#save-button").addEventListener("click", () => onClickSaveButton());
        $("#upgrade-button").addEventListener("click", () => onClickUpgradeButton());
        $("#sell-button").addEventListener("click", () => onClickSellButton());

        // $("#max-upgrade-close-button").addEventListener("click", () => onClickCloseButton("max-message"));
        // $("#money-lack-close-button").addEventListener("click", () => onClickCloseButton("money-lack-message"));
        // $("#invalidation-close-button").addEventListener("click", () => onClickCloseButton("invalidation-message"));
        // $("#god-hand-close-button").addEventListener("click", () => onClickCloseButton("great-success-message"));
        // $("#game-end-close-button").addEventListener("click", () => onClickCloseButton("game-end-message"));
        // $("#making-last-sword-close-button").addEventListener("click", () => onClickCloseButton("game-making-last-sword-message"));
    }

    popupFallMessage(loss: number, pieces: PieceItem[], having_repair_paper: number, required_repair_paper: number) {


        const popup = new Popup();
        popup.setTitlte("파괴되었습니다", Color.RED);
        popup.setSubTitle(`손실: ${loss}원`);

        if(pieces.length > 0) {
            popup.addParagraphText("<떨어진 조각 목록>");
            pieces.forEach(
                pieceItem => {
                    const created_div = createElementWith("div", {classes: ["dropped_piece_info"]});
                    created_div.appendChild(createImageWithSrc(Game.Path[pieceItem.id]));
                    created_div.appendChild(createElementWith("span", {classes: ["name"], text: pieceItem.name}));
                    created_div.appendChild(createElementWith("span", {classes: ["count"], text: pieceItem.count}));

                    popup.addParagraphElement(created_div);
                }
            );
        } else popup.addParagraphText("이런! 아무런 조각도 떨어지지 않았습니다.");
        
        if(having_repair_paper >= required_repair_paper) {
            popup.addButton(
                "복구하기", Color.GREEN, ButtonType.REPAIR, HoverEffect.INCREASE, () => onClickRepairButton()
            );
            popup.setFooter(
                `복구권 ${required_repair_paper}개로 복구할 수 있습니다. (${having_repair_paper}/${required_repair_paper})`, Color.SKY
            );
        } else {
            popup.setFooter(
                `복구권이 부족하여 복구할 수 없습니다. (${having_repair_paper}/${required_repair_paper})`, Color.RED
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
        popup.setTitlte("축하합니다!", Color.GOLD);
        popup.setSubTitle("최대 강화에 도달했습니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    popupMoneyLackMessage() {
        const popup = new Popup();
        popup.setTitlte("돈이 부족합니다.", Color.RED);
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
        popup.setTitlte("검이 파괴되었지만 복구되었습니다.", Color.BLUE);
        popup.setSubTitle("강화 비용 또한 반환되었습니다!");

        if(pieces.length > 0) {
            popup.addParagraphText("<떨어진 조각 목록>");
            pieces.forEach(
                pieceItem => {
                    const created_div = createElementWith("div", {classes: ["dropped_piece_info"]});
                    created_div.appendChild(createImageWithSrc(Game.Path[pieceItem.id]));
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
        popup.setTitlte("신의 손 발동!", Color.GREEN);
        popup.setSubTitle("검이 2단계 상승했습니다.");
        popup.addParagraphText(`${new_sword_index} 강이 되었습니다!`);
        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    popupGameEndMessage() {
        const popup = new Popup();
        popup.setTitlte("검을 최종 단계까지 업그레이드 했습니다.", Color.GOLD);
        popup.setSubTitle("충만한 검의 기운이 당신과 함께합니다!");
        popup.addParagraphText("창을 닫아도 게임은 계속됩니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
}

import { $, display, createImageWithSrc, createElementWith, write, hide, createElement } from "../other/element_controller.js";
import { Game } from "../other/main.js";
import { Keyframes } from "./screen.js";
export class MessageWindow {
    constructor() {
        this.renderGreatSuccessMessage = function () {
            write($("#what_count"), Game.swordManager.current_sword_index + "강이 되었습니다!");
        };
    }
    popupMessage(element_message_box) {
        display(element_message_box);
        element_message_box.animate(Keyframes.popup_kef, { duration: 300, fill: "both" });
    }
    popupMaxMessage() {
        this.popupMessage($("#max-message"));
    }
    popupMoneyLackMessage() {
        this.popupMessage($("#money-lack-message"));
    }
    makeDroppedPieceDiv(piece) {
        const div = createElement("div");
        div.appendChild(createImageWithSrc(Game.Path[piece.id]));
        div.appendChild(createElementWith("span", { classes: ["name"], text: piece.name }));
        div.appendChild(createElementWith("span", { classes: ["count"], text: piece.count }));
        return div;
    }
    renderFallMessage(...pieces) {
        const element_loss = $("#loss");
        const element_fall_pieces = $("#fall-pieces");
        const element_fix_button = $("#fix-button");
        const element_required_count = $("#required-count");
        write(element_loss, `손실: ${Game.swordManager.calculateLoss(Game.swordManager.current_sword_index)}원`);
        if (pieces.length > 0) {
            const created_ret = pieces.map(piece => this.makeDroppedPieceDiv(piece));
            element_fall_pieces.replaceChildren(...created_ret);
        }
        else {
            const created_p = createElementWith("p", { text: "아무런 조각도 떨어지지 않았습니다." });
            element_fall_pieces.replaceChildren(created_p);
        }
        const current_sword = Game.swordManager.getCurrentSword();
        const paper_range = `${Game.inventoryManager.getRepairPaper()}/${current_sword.requiredRepairs}`;
        if (Game.inventoryManager.hasRepairPaper(current_sword.requiredRepairs)) {
            display(element_fix_button);
            write(element_required_count, `복구권 ${current_sword.requiredRepairs}개로 복구할 수 있습니다. (${paper_range})`);
            element_required_count.classList.remove("red-text");
        }
        else {
            hide(element_fix_button);
            write(element_required_count, `복구권이 부족하여 복구할 수 없습니다. (${paper_range})`);
            element_required_count.classList.add("red-text");
        }
    }
    popupFallMessage(...pieces) {
        this.renderFallMessage(...pieces);
        this.popupMessage($("#fall-message"));
    }
    renderInvalidationMessage(...pieces) {
        const element_downgrade = $("#downgrade");
        const element_invalidation_pieces = $("#invalidation-pieces");
        write(element_downgrade, Game.swordManager.current_sword_index + "강으로 떨어졌습니다!");
        const ret = pieces.map(piece => this.makeDroppedPieceDiv(piece));
        element_invalidation_pieces.replaceChildren(...ret);
    }
    popupInvalidationMessage(...pieces) {
        this.renderInvalidationMessage(...pieces);
        this.popupMessage($("#invalidation-message"));
    }
    popupGreatSuccessMessage() {
        this.renderGreatSuccessMessage();
        this.popupMessage($("#great-success-message"));
    }
    popupGameEndMessage() {
        this.popupMessage($("#game-end-message"));
    }
    renderBreakMessage(...pieces) {
        const element_break_title = $("#break-title");
        const element_fall_pieces = $("#fall-pieces");
        if (pieces.length > 0) {
            element_break_title.classList.add("happy");
            element_break_title.textContent = "검을 파괴했습니다.";
            const created_ret = pieces.map(piece => this.makeDroppedPieceDiv(piece));
            element_fall_pieces.replaceChildren(...created_ret);
        }
        else {
            element_break_title.classList.remove("happy");
            element_break_title.textContent = "검을 파괴했습니만...";
            const created_p = createElementWith("p", { text: "아무런 조각도 떨어지지 않았습니다." });
            element_fall_pieces.replaceChildren(created_p);
        }
    }
    popupBreakMessage(...pieces) {
        this.renderBreakMessage(...pieces);
        this.popupMessage($("#break-message"));
    }
    popupSwordItemSellAskingMessage(sword) {
        const element_asking_title = $("#asking-title");
        const element_menu_details = $("#menu-details");
        const created_div = createElement("div");
        created_div.appendChild(createImageWithSrc(Game.Path[sword.id]));
        created_div.appendChild(createElementWith("span", { classes: ["name"], text: sword.name }));
        created_div.appendChild(createElementWith("span", { classes: ["count"], text: sword.cost }));
        element_asking_title.textContent = "검을 판매하시겠습니까?";
        element_menu_details.appendChild(created_div);
        this.popupMessage($("#sword-item-really-asking-message"));
    }
    popupMaxStatMessage() {
        this.popupMessage($("#max-stat-message"));
    }
    popupMakingLastSwordMessage() {
        this.popupMessage($("#game-making-last-sword-message"));
    }
    popupAllStatMessage() {
        this.popupMessage($("#game-all-stat-message"));
    }
    popupStatPointLackMessage() {
        this.popupMessage($("#statpoint-lack-message"));
    }
}

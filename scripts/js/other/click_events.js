import { StatID } from "../manager/stat_manager.js";
import { ContextType } from "./context.js";
import { $, hide } from "./element_controller.js";
import { StatTestResult, SwordTestResult } from "./entity.js";
import { Game } from "./main.js";
export const onClickCloseButton = (id) => hide($("#" + id));
(function onClickFooterIcon() {
    $("#main-game-button").addEventListener("click", () => Game.mainScreen.show(Game.swordManager.swordContext));
    $("#information-button").addEventListener("click", () => Game.informationScreen.show(Game.swordManager.foundSwordsContext));
    $("#inventory-button").addEventListener("click", () => Game.inventoryScreen.show(Game.inventoryManager.inventoryContext));
    $("#making-button").addEventListener("click", () => Game.makingScreen.show());
    $("#stat-button").addEventListener("click", () => Game.statScreen.show());
})();
let isClicking = false;
export function onClickUpgradeButton() {
    if (isClicking)
        return;
    isClicking = true;
    setTimeout(() => {
        isClicking = false;
    }, 100);
    const attempt = Game.swordManager.tryUpgrade();
    switch (attempt.result) {
        case SwordTestResult.REJECTED_BY_MAX_UPGRADE:
            Game.mainScreen.popupMaxUpgradeMessage();
            break;
        case SwordTestResult.REJECTED_BY_MONEY_LACK:
            Game.mainScreen.popupMoneyLackMessage();
            break;
        case SwordTestResult.GREAT_SUCCESS:
            Game.mainScreen.popupGodHandMessage(attempt.result_index);
        case SwordTestResult.SUCCESS:
            if (attempt.result_index >= Game.swordManager.maxUpgradableIndex)
                Game.mainScreen.popupGameEndMessage();
            break;
        case SwordTestResult.FAIL_BUT_INVALIDATED:
            Game.mainScreen.popupInvalidationMessage(attempt.dropped_pieces);
            break;
        case SwordTestResult.FAIL:
            Game.mainScreen.popupFallMessage(Game.swordManager.calculateLoss(attempt.result_index), attempt.dropped_pieces, Game.inventoryManager.getRepairPaper(), attempt.sword.requiredRepairs);
            break;
    }
}
export function onClickSellButton() {
    if (isClicking)
        return;
    isClicking = true;
    setTimeout(() => {
        isClicking = false;
    }, 100);
    const sword = Game.swordManager.getCalculatedCurrentSword();
    Game.inventoryManager.saveMoney(sword.price, {
        type: ContextType.SWORD_SELL,
        name: sword.name,
        price: sword.price
    }); // 돈 변경
    Game.init(); // 게임 초기화
}
export function onClickSaveButton() {
    if (isClicking)
        return;
    isClicking = true;
    setTimeout(() => {
        isClicking = false;
    }, 100);
    Game.inventoryManager.save(Game.swordManager.getCurrentSword().toItem()); // 검 저장
    Game.init(); // 게임 초기화
}
export function onClickRepairButton() {
    if (isClicking)
        return;
    isClicking = true;
    setTimeout(() => {
        isClicking = false;
    }, 100);
    const required = Game.swordManager.getCurrentSword().requiredRepairs;
    if (Game.inventoryManager.hasRepairPaper(required)) { // 복구권이 충분하면
        Game.inventoryManager.takeRepairPaper(required); // 복구권 차감
        Game.init(Game.swordManager.current_sword_index); // 복구한 검부터 재시작
    }
}
export function onClickInitButton() {
    if (isClicking)
        return;
    isClicking = true;
    setTimeout(() => {
        isClicking = false;
    }, 100);
    Game.init(); // 게임 초기화
}
export function onStatUp(statIdStr) {
    if (isClicking)
        return;
    isClicking = true;
    setTimeout(() => {
        isClicking = false;
    }, 100);
    const statID = StatID[statIdStr.toUpperCase()];
    const result = Game.statManager.tryUpgrade(statID);
    switch (result) {
        case StatTestResult.SUCCESS:
            break;
        case StatTestResult.SUCCESS_AND_ALL_MAX:
            Game.statScreen.popupGameAllStatMessage();
            break;
        case StatTestResult.REJECTED_BY_MAX_UPGRADE:
            Game.statScreen.popupMaxStatMessage();
            break;
        case StatTestResult.REJECTED_BY_POINT_LACK:
            Game.statScreen.popupStatPointLackMessage();
            break;
    }
}
export function onClickRepairPaperMakingButton(amount, materials) {
    if (isClicking)
        return;
    isClicking = true;
    setTimeout(() => {
        isClicking = false;
    }, 100);
    if (Game.inventoryManager.hasItems(materials)) {
        Game.makingScreen.animateLoading(700, () => {
            Game.makingManager.makeRepairPaper(amount);
        });
    }
}
export function onClickSwordMakingButton(recipe) {
    if (isClicking)
        return;
    isClicking = true;
    setTimeout(() => {
        isClicking = false;
    }, 100);
    if (Game.inventoryManager.hasItems(recipe.materials)) {
        Game.makingScreen.animateLoading(1200, () => {
            Game.makingManager.makeWithRecipe(recipe);
            Game.makingScreen.popupCreatedSwordMessage();
        });
    }
}
export function onClickSwordItemSellButton(id) {
    if (isClicking)
        return;
    isClicking = true;
    setTimeout(() => {
        isClicking = false;
    }, 100);
    Game.inventoryScreen.popupSwordItemSellMessage(Game.swordManager.getCalculatedSwordWithId(id), popup => {
        Game.inventoryManager.sellSword(id);
        popup.close();
    });
}
export function onClickSwordBreakButton(id) {
    if (isClicking)
        return;
    isClicking = true;
    setTimeout(() => {
        isClicking = false;
    }, 100);
    Game.inventoryScreen.popupSwordItemBreakMessage(Game.swordManager.getCalculatedSwordWithId(id), () => {
        Game.inventoryScreen.popupBreakMessage(Game.inventoryManager.breakSword(id));
    });
}
export function onClickSwordSwapButton(id) {
    if (isClicking)
        return;
    isClicking = true;
    setTimeout(() => {
        isClicking = false;
    }, 100);
    Game.inventoryManager.swapSword(id);
}
export function onClickSwordInfoButton(id) {
    if (isClicking)
        return;
    isClicking = true;
    setTimeout(() => {
        isClicking = false;
    }, 100);
    Game.informationScreen.popupSwordInfoMessage(id);
}

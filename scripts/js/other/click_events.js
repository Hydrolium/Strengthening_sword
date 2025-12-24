import { StatID } from "../manager/stat_manager.js";
import { ContextType } from "./context.js";
import { $, hide } from "./element_controller.js";
import { TestResult } from "./entity.js";
import { Game } from "./main.js";
export const onClickCloseButton = (id) => hide($("#" + id));
(function onClickFooterIcon() {
    $("#main-game-button").addEventListener("click", () => Game.mainScreen.show(Game.swordManager.getRenderEvent()));
    $("#information-button").addEventListener("click", () => Game.informationScreen.show(Game.inventoryManager.getRenderEvent()));
    $("#inventory-button").addEventListener("click", () => Game.inventoryScreen.show(Game.inventoryManager.getRenderEvent()));
    $("#making-button").addEventListener("click", () => Game.makingScreen.show(Game.makingManager.getRenderEvent()));
    $("#stat-button").addEventListener("click", () => Game.statScreen.show(Game.statManager.getRenderEvent()));
})();
let is_clicking = false;
export function onClickUpgradeButton() {
    if (is_clicking)
        return;
    is_clicking = true;
    setTimeout(() => {
        is_clicking = false;
    }, 100);
    const sword = Game.swordManager.getCalculatedCurrentSword();
    const result = Game.swordManager.test();
    if (result == TestResult.SUCCESS) { // 강화 가능 상태일 때
        Game.inventoryManager.takeMoney(sword.cost, {
            type: ContextType.SWORD_UPGRADE,
            name: sword.name,
            cost: sword.cost
        }); // 돈 변경
        if (Math.random() < sword.prob) { // 성공하면
            if (Math.random() < Game.statManager.calculate(StatID.GOD_HAND) / 100) { // 대성공 계산
                Game.swordManager.upgradeSword(2); // +2강
                Game.mainScreen.popupGodHandMessage(Game.swordManager.current_sword_index); // 대성공 메세지
            }
            else { // 대성공이 실패하면
                Game.swordManager.upgradeSword(); // +1강
            }
            if (Game.swordManager.current_sword_index == Game.swordManager.max_upgradable_index)
                Game.mainScreen.popupGameEndMessage();
        }
        else {
            const dropped_pieces = sword.pieces.map(piece => piece.drop()).filter(piece => piece.count > 0); // 떨어진 조각 맵핑
            dropped_pieces.forEach(piece => Game.inventoryManager.save(piece)); // 조각 저장
            const percent = Game.statManager.calculate(StatID.INVALIDATED_SPHERE) / 100; // [ 무효화 구체 ] 스탯 확률
            if (Math.random() < percent) { // [ 무효화 구체 ] 성공시
                Game.swordManager.upgradeSword(0); // 제자리
                Game.inventoryManager.saveMoney(sword.cost, {
                    type: ContextType.SWORD_RESTORE,
                    name: sword.name,
                    cost: sword.cost
                }); // 돈 반환
                Game.mainScreen.popupInvalidationMessage(dropped_pieces); // 구체 발동 메세지
            }
            else {
                Game.mainScreen.popupFallMessage(Game.swordManager.calculateLoss(Game.swordManager.current_sword_index), dropped_pieces, Game.inventoryManager.getRepairPaper(), sword.requiredRepairs); // 실패 메세지
            }
        }
    }
    else if (result == TestResult.RESOURCES_LACK) { //돈 부족
        Game.mainScreen.popupMoneyLackMessage(); // 돈 부족 메세지
    }
    else if (result == TestResult.MAX_UPGRADE) { // 최대 강화 달성
        Game.mainScreen.popupMaxUpgradeMessage(); // 최대 강화 축하 메세지
    }
}
export function onClickSellButton() {
    if (is_clicking)
        return;
    is_clicking = true;
    setTimeout(() => {
        is_clicking = false;
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
    if (is_clicking)
        return;
    is_clicking = true;
    setTimeout(() => {
        is_clicking = false;
    }, 100);
    Game.inventoryManager.save(Game.swordManager.getCurrentSword().toItem()); // 검 저장
    Game.init(); // 게임 초기화
}
export function onClickRepairButton() {
    if (is_clicking)
        return;
    is_clicking = true;
    setTimeout(() => {
        is_clicking = false;
    }, 100);
    const required = Game.swordManager.getCurrentSword().requiredRepairs;
    if (Game.inventoryManager.hasRepairPaper(required)) { // 복구권이 충분하면
        Game.inventoryManager.takeRepairPaper(required); // 복구권 차감
        Game.init(Game.swordManager.current_sword_index); // 복구한 검부터 재시작
    }
}
export function onClickInitButton() {
    if (is_clicking)
        return;
    is_clicking = true;
    setTimeout(() => {
        is_clicking = false;
    }, 100);
    Game.init(); // 게임 초기화
}
export function onStatUp(statIdStr) {
    if (is_clicking)
        return;
    is_clicking = true;
    setTimeout(() => {
        is_clicking = false;
    }, 100);
    const statID = StatID[statIdStr.toUpperCase()];
    const result = Game.statManager.test(statID);
    switch (result) {
        case TestResult.SUCCESS: // 강화 가능 상태일 때
            Game.statManager.upgradeStat(statID); // 업그레이드
            break;
        case TestResult.MAX_UPGRADE: // 최대 강화 상태
            Game.statScreen.popupMaxStatMessage(); // 최대 강화 알림
            break;
        case TestResult.RESOURCES_LACK: // 스탯 포인트 부족
            Game.statScreen.popupStatPointLackMessage(); // 스탯 포인트 부족 알림
            break;
    }
}
export function onClickRepairPaperMakingButton(amount, materials) {
    if (is_clicking)
        return;
    is_clicking = true;
    setTimeout(() => {
        is_clicking = false;
    }, 100);
    if (Game.inventoryManager.hasItems(materials)) {
        Game.makingScreen.animateLodding(700, () => {
            Game.makingManager.makeRepairPaper(amount);
        });
    }
}
export function onClickSwordMakingButton(recipe) {
    if (is_clicking)
        return;
    is_clicking = true;
    setTimeout(() => {
        is_clicking = false;
    }, 100);
    if (Game.inventoryManager.hasItems(recipe.materials)) {
        Game.makingScreen.animateLodding(1200, () => {
            Game.makingManager.makeWithRecipe(recipe);
            Game.makingScreen.popupCreatedSwordMessage();
        });
    }
}
export function onClickSwordItemSellButton(id) {
    if (is_clicking)
        return;
    is_clicking = true;
    setTimeout(() => {
        is_clicking = false;
    }, 100);
    Game.inventoryScreen.popupSwordItemSellMessage(Game.swordManager.getCalculatedSwordWithId(id), popup => {
        Game.inventoryManager.sellSword(id);
        popup.close();
    });
}
export function onClickSwordBreakButton(id) {
    if (is_clicking)
        return;
    is_clicking = true;
    setTimeout(() => {
        is_clicking = false;
    }, 100);
    Game.inventoryScreen.popupSwordItemBreakMessage(Game.swordManager.getCalculatedSwordWithId(id), () => {
        Game.inventoryScreen.popupBreakMessage(Game.inventoryManager.breakSword(id));
    });
}
export function onClickSwordSwapButton(id) {
    if (is_clicking)
        return;
    is_clicking = true;
    setTimeout(() => {
        is_clicking = false;
    }, 100);
    Game.inventoryManager.swapSword(id);
}
export function onClickSwordInfoButton(id) {
    if (is_clicking)
        return;
    is_clicking = true;
    setTimeout(() => {
        is_clicking = false;
    }, 100);
    Game.informationScreen.popupSwordInfoMessage(id);
}

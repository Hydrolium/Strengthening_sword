import { AskingSwordItemBreakContext, AskingSwordItemSellContext, GameAllStatContext, GameEndContext, GodHandContext, InvalidationContext, ItemInfoSearchContext, MaxStatContext, MaxUpgradeContext, MoneyLackContext, ScreenDrawingContext, ScreenDrawingContextType, StatPointLackContext, SwordCraftingContext, SwordInfoContext, SwordItemBreakedContext, UpgradeFailureContext, WherePieceDroppedContext } from "../../context/rendering/screen_drawing_context";
import { ColoredTextElement } from "../../element/colored_text";
import { createElementWith, createImageWithSrc } from "../../element/element_controller";
import { Color } from "../../element/popup_info";
import { UnknownItem } from "../../define/object/item";
import { Popup } from "../../element/popup_message";
import { ButtonType } from "../../element/popup_info";
import { HoverEffect } from "../../element/popup_info";
import { Display } from "./display";

export class PopupDisplay extends Display {

    private popups: Partial<Record<ScreenDrawingContextType, (context: any) => void>> = {
        [ScreenDrawingContextType.UPGRADE_FAILURE_CONTEXT]: this.popupUpgradeFailureMessage,
        [ScreenDrawingContextType.MAX_UPGRADE_CONTEXT]: this.popupMaxUpgradeMessage,
        [ScreenDrawingContextType.MONEY_LACK_CONTEXT]: this.popupMoneyLackMessage,
        [ScreenDrawingContextType.INVALIDATION_CONTEXT]: this.popupInvalidationMessage,
        [ScreenDrawingContextType.GOD_HAND_CONTEXT]: this.popupGodHandMessage,
        [ScreenDrawingContextType.GAME_END_CONTEXT]: this.popupGameEndMessage,
        [ScreenDrawingContextType.SWORD_INFO_CONTEXT]: this.popupSwordInfoMessage,
        [ScreenDrawingContextType.ASKING_SWORD_ITEM_BREAK_CONTEXT]: this.popupAskingSwordItemBreakMessage,
        [ScreenDrawingContextType.SWORD_ITEM_BREAKED_CONTEXT]: this.popupSwordItemBreakedMessage,
        [ScreenDrawingContextType.ASKING_SWORD_ITEM_SELL_CONTEXT]: this.popupAskingSwordItemSellMessage,
        [ScreenDrawingContextType.WHERE_PIECE_DROPPED_CONTEXT]: this.popupWherePieceDroppedMessage,
        [ScreenDrawingContextType.ITEM_INFO_SEARCH_CONTEXT]: this.popupItemInfoSearchMessage,
        [ScreenDrawingContextType.SWORD_CRAFTING_CONTEXT]: this.popupSwordCraftingMessage,
        [ScreenDrawingContextType.MAX_STAT_CONTEXT]: this.popupMaxStatMessage,
        [ScreenDrawingContextType.STAT_POINT_LACK_CONTEXT]: this.popupStatPointLackMessage,
        [ScreenDrawingContextType.GAME_ALL_STAT_CONTEXT]: this.popupGameAllStatMessage
    } as const;

    public refresh = (context: ScreenDrawingContext) => {
        this.popups[context.type]?.call(this, context);
    }

    private popupUpgradeFailureMessage(context: UpgradeFailureContext) {

        const popup = new Popup();
        popup.setTitle("파괴되었습니다", Color.RED);
        popup.setSubTitle(`손실: ${context.loss}원`);

        if(context.pieces.length > 0) {
            popup.addParagraphText("<획득한 조각 목록>");
            context.pieces.forEach(
                pieceItem => {
                    const created_div = createElementWith("div", {classes: ["img_name_count_paragraph"]});
                    created_div.appendChild(createImageWithSrc(pieceItem.imgSrc));
                    new ColoredTextElement()
                        .add(`${pieceItem.name}`, Color.GREEN)
                        .add(` x `, Color.DARK_GRAY)
                        .add(`${pieceItem.count}`, Color.GOLD)
                        .add(`개`, Color.DARK_GRAY)
                        .build()
                        .forEach(element => created_div.appendChild(element));

                    popup.addParagraphElement(created_div);
                }
            );
        } else popup.addParagraphText("이런! 아무런 조각도 떨어지지 않았습니다.");
        
        if(context.havingRepairPaper >= context.requiredRepairPaper) {
            popup.addButton(
                "복구하기", Color.GREEN, ButtonType.REPAIR, HoverEffect.INCREASE, () => context.onRepair(context.sword, popup)
            );
            popup.setFooter(
                `복구권 ${context.requiredRepairPaper}개로 복구할 수 있습니다. (${context.havingRepairPaper}/${context.requiredRepairPaper})`, Color.SKY
            );
        } else {
            popup.setFooter(
                `복구권이 부족하여 복구할 수 없습니다. (${context.havingRepairPaper}/${context.requiredRepairPaper})`, Color.RED
            );
        }

        popup.addButton(
            "다시하기", Color.DARK_BLUE, ButtonType.REGAME, HoverEffect.TURNING, () => context.onInit(popup)
        );

        popup.build();

        popup.show();

    }

    private popupMaxUpgradeMessage(context: MaxUpgradeContext) {
        const popup = new Popup();
        popup.setTitle("축하합니다!", Color.GOLD);
        popup.setSubTitle("최대 강화에 도달했습니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    private popupMoneyLackMessage(context: MoneyLackContext) {
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

    private popupInvalidationMessage(context: InvalidationContext) {

        const popup = new Popup();
        popup.setTitle("검이 파괴되었지만 복구되었습니다.", Color.BLUE);
        popup.setSubTitle("강화 비용이 반환되며 조각 또한 획득할 수 있습니다.");

        if(context.pieces.length > 0) {
            popup.addParagraphText("<획득한 조각 목록>");
            context.pieces.forEach(
                pieceItem => {
                    const created_div = createElementWith("div", {classes: ["img_name_count_paragraph"]});
                    created_div.appendChild(createImageWithSrc(pieceItem.imgSrc));
                    new ColoredTextElement()
                        .add(`${pieceItem.name}`, Color.GREEN)
                        .add(` x `, Color.DARK_GRAY)
                        .add(`${pieceItem.count}`, Color.GOLD)
                        .add(`개`, Color.DARK_GRAY)
                        .build()
                        .forEach(element => created_div.appendChild(element));

                    popup.addParagraphElement(created_div);
                }
            );
        } else popup.addParagraphText("아쉽게도 떨어진 조각은 없네요.");

        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    private popupGodHandMessage(context: GodHandContext) {
        const popup = new Popup();
        popup.setTitle("신의 손 발동!", Color.GREEN);
        popup.setSubTitle("검이 2단계 상승했습니다.");
        popup.addParagraphText(`${context.newSwordIndex} 강이 되었습니다!`);
        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    private popupGameEndMessage(context: GameEndContext) {
        const popup = new Popup();
        popup.setTitle("검을 최종 단계까지 업그레이드 했습니다.", Color.GOLD);
        popup.setSubTitle("충만한 검의 기운이 당신과 함께합니다!");
        popup.addParagraphText("창을 닫아도 게임은 계속됩니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    private popupSwordInfoMessage(context: SwordInfoContext) {

        const popup = new Popup();

        popup.setIcon(context.sword.imgSrc);

        popup.setTitle(`${context.sword.index}강: ${context.sword.name}`, Color.PURPLE);
        popup.setSubTitle(context.sword.description);

        if(context.sword.prob > 0)
            popup.addColoredParagraph(
                new ColoredTextElement().add("다음 단계 강화 확률: ", Color.DARK_GRAY).add(Math.floor(context.sword.prob*100), Color.GOLD).add("%", Color.DARK_GRAY)
            );

        
        if(context.sword.cost > 0)
            popup.addColoredParagraph(
                new ColoredTextElement().add("다음 단계 강화 비용: ", Color.DARK_GRAY).add(context.sword.cost, Color.GOLD).add("원", Color.DARK_GRAY)
            );

        if(context.sword.price > 0)
            popup.addColoredParagraph(
                new ColoredTextElement().add("검 판매 가격: ", Color.DARK_GRAY).add(context.sword.price, Color.GOLD).add("원", Color.DARK_GRAY)
            );
        else
            popup.addColoredParagraph(
                new ColoredTextElement().add("검 판매 가격: ", Color.DARK_GRAY).add("판매 불가.", Color.RED)
            );
        
        if(context.sword.requiredRepairs > 0)
            popup.addColoredParagraph(
                new ColoredTextElement().add("복구 시 필요한 복구권 갯수: ", Color.DARK_GRAY).add(context.sword.requiredRepairs, Color.GOLD).add("개", Color.DARK_GRAY)
            );

        popup.addParagraphText("");
        if(context.sword.pieces.length > 0) {
            popup.addParagraphText("파괴 시 획득 가능한 조각 목록");
            context.sword.pieces.forEach(
                piece => {
                    const created_div = createElementWith("div", {classes: ["img_name_count_paragraph"]});
                    created_div.appendChild(createImageWithSrc(piece.imgSrc));
                    new ColoredTextElement()
                        .add(`${piece.name}`, Color.GREEN)
                        .add(`이(가) `, Color.DARK_GRAY)
                        .add(`${Math.floor(piece.prob * 100)}`, Color.DARK_BLUE)
                        .add(`% 확률로 `, Color.DARK_GRAY)
                        .add((piece.maxDrop == 1) ? "1": `1~${piece.maxDrop}`, Color.GOLD)
                        .add(`개`, Color.DARK_GRAY)
                        .build()
                        .forEach(element => created_div.appendChild(element));

                    popup.addParagraphElement(created_div);
                }
            )
        } else popup.addParagraphText("파괴 시 획득 가능한 조각이 없습니다.");
        
        popup.addCloseButton();

        popup.build();
        popup.show();

    }


    private popupAskingSwordItemBreakMessage(context: AskingSwordItemBreakContext) {
        const popup = new Popup();
        popup.setTitle("정말로 검을 파괴하시겠습니까?", Color.BROWN);

        if(context.sword.pieces.length > 0) {

            popup.addParagraphText("다음 조각이 확률적으로 떨어집니다.");
            context.sword.pieces.forEach(
                piece => {
                    const created_div = createElementWith("div", {classes: ["img_name_count_paragraph"]});
                    created_div.appendChild(createImageWithSrc(piece.imgSrc));

                    new ColoredTextElement()
                        .add(`${piece.name}`, Color.GREEN)
                        .add(`이(가) `, Color.DARK_GRAY)
                        .add(`${Math.floor(piece.prob * 100)}`, Color.DARK_BLUE)
                        .add(`% 확률로 `, Color.DARK_GRAY)
                        .add((piece.maxDrop == 1) ? "1": `1~${piece.maxDrop}`, Color.GOLD)
                        .add(`개`, Color.DARK_GRAY)
                        .build()
                        .forEach(element => created_div.appendChild(element));

                    popup.addParagraphElement(created_div);
                }
            )

        } else {
            popup.addParagraphText("해당 검은 아무런 조각도 떨어뜨리지 않습니다.");
        }

        popup.addButton(
            "파괴하기", Color.BROWN, ButtonType.MAKE, HoverEffect.DECREASE, context.breakFunc
        )
        popup.addCloseButton();

        popup.build();
        popup.show();
    }

    private popupSwordItemBreakedMessage(context: SwordItemBreakedContext) {
        
        const popup = new Popup();
        popup.setTitle("검을 파괴했습니다.", Color.BLUE);

        if(context.pieces.length > 0) {
            popup.addParagraphText("<획득한 조각 목록>");
            context.pieces.forEach(
                pieceItem => {
                    const created_div = createElementWith("div", {classes: ["img_name_count_paragraph"]});
                    created_div.appendChild(createImageWithSrc(pieceItem.imgSrc));

                    new ColoredTextElement()
                        .add(`${pieceItem.name}`, Color.GREEN)
                        .add(` x `, Color.DARK_GRAY)
                        .add(`${pieceItem.count}`, Color.GOLD)
                        .add(`개`, Color.DARK_GRAY)
                        .build()
                        .forEach(element => created_div.appendChild(element));

                    popup.addParagraphElement(created_div);
                }
            );
        } else popup.addParagraphText("이런! 아무런 조각도 떨어지지 않았습니다.");

        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    private popupAskingSwordItemSellMessage(context: AskingSwordItemSellContext) {
        const popup = new Popup();
        popup.setTitle("정말로 검을 판매하시겠습니까?", Color.BROWN);

        popup.addColoredParagraph(
            new ColoredTextElement().add("획득 가능한 금액: ", Color.DARK_GRAY).add(context.sword.price, Color.GOLD).add("원", Color.DARK_GRAY)
        );

        popup.addButton(
            "판매하기", Color.BROWN, ButtonType.SELL, HoverEffect.INCREASE, context.sellFunc
        )
        popup.addCloseButton();

        popup.build();
        popup.show();
    }

    private popupWherePieceDroppedMessage(context: WherePieceDroppedContext) {
        
        const popup = new Popup();
        popup.setIcon(context.pieceItem.imgSrc)
        popup.setTitle(`<${context.pieceItem.name}>`, Color.GREEN);
        popup.setSubTitle(context.pieceItem.description);

        const unknown = UnknownItem.instance;

        context. swords.forEach(
                sword => {
                    const created_div = createElementWith("div", {classes: ["img_name_count_paragraph"]});

                    if(context.founds.has(sword.index)) {
                        created_div.appendChild(createImageWithSrc(sword.imgSrc));
                        new ColoredTextElement()
                            .add(`${sword.index}`, Color.NAVY)
                            .add(`강`,Color.DARK_GRAY)
                            .add(` ${sword.name}`, Color.PURPLE)
                            .add(` 파괴 시 `, Color.DARK_GRAY)
                            .add(`${Math.floor(sword.prob * 100)}`, Color.DARK_BLUE)
                            .add(`% 확률로 `, Color.DARK_GRAY)
                            .add((sword.maxDrop == 1) ? "1": `1~${sword.maxDrop}`, Color.GOLD)
                            .add(`개`, Color.DARK_GRAY)
                            .build()
                            .forEach(element => created_div.appendChild(element));
                    } else {
                        created_div.appendChild(createImageWithSrc(unknown.imgSrc));
                            new ColoredTextElement()
                            .add(`${sword.index}강 ${unknown.name} `, Color.RED)
                            .add(`파괴 시 획득 가능`, Color.DARK_GRAY)
                            .build()
                            .forEach(element => created_div.appendChild(element));
                    }

                    popup.addParagraphElement(created_div);
                }
            );

        popup.setFooter("발견되지 않은 검은 상세정보를 확인할 수 없습니다.", Color.DARK_GRAY);

        popup.addCloseButton();
        popup.build();
        popup.show();
    }
    
    private popupItemInfoSearchMessage(context: ItemInfoSearchContext) {
        const popup = new Popup();
        popup.setTitle(`<${context.item.name}>`, Color.BROWN);
        popup.setSubTitle(context.item.description);
        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    private popupSwordCraftingMessage(context: SwordCraftingContext) {
        const popup = new Popup();
        popup.setTitle("검을 제작했습니다.", Color.SKY);
        popup.setSubTitle("보관함으로 검이 지급되었습니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }


    private popupMaxStatMessage(context: MaxStatContext) {
        const popup = new Popup();
        popup.setTitle("이미 최대로 강화된 스탯입니다!", Color.PURPLE);
        popup.setSubTitle("다른 스탯을 강화해 보세요.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
    
    private popupStatPointLackMessage(context: StatPointLackContext) {
        const popup = new Popup();
        popup.setTitle("스탯 포인트가 부족합니다!", Color.RED);
        popup.setSubTitle("새로운 검을 발견해 스탯 포인트를 얻어보세요.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    private popupGameAllStatMessage(context: GameAllStatContext) {
        const popup = new Popup();
        popup.setTitle("모든 스탯을 끝까지 업그레이드 했습니다", Color.GOLD);
        popup.setSubTitle("고대 룬의 마법이 당신과 함께합니다!");
        popup.addParagraphText("창을 닫아도 게임은 계속됩니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
}
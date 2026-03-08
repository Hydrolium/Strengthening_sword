import { $, createElementWith, createImageWithSrc, invisible, setOnClick, visible } from "../other/element_controller.js";
import { Color, PieceItem, Sword } from "../other/entity.js";
import { ButtonType, HoverEffect, Popup } from "../popup/popup_message.js";
import { Screen } from "./screen.js";
import { write } from "../other/element_controller.js";
import { ColoredTextElement } from "../other/colored_text.js";
import { ScreenRenderingContext, ScreenRenderingContextType } from "../context/rendering/screen_rendering_context.js";
import { ScreenShowingContextType } from "../context/rendering/screen_showing_context.js";
import { MainScreenActions } from "../event/main_screen_event_controller.js";

export class MainScreen extends Screen {

    protected readonly _id = ScreenShowingContextType.MAIN_SCREEN_SHOWING_CONTEXT;

    private readonly _elements : {
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

    private _actions?: MainScreenActions;

    public setActions(actions: MainScreenActions) {
        this._actions = actions;
    }

    protected init() {

        this._elements.swordImage = $<HTMLImageElement>("#sword-image");

        this._elements.swordNumber = $<HTMLSpanElement>("#sword-number");
        this._elements.swordName = $<HTMLSpanElement>("#sword-name");
        this._elements.swordProb = $<HTMLSpanElement>("#sword-prob");
        this._elements.swordCost = $<HTMLSpanElement>("#sword-cost");
        this._elements.swordPrice = $<HTMLSpanElement>("#sword-price");

        this._elements.sellButton = $<HTMLAnchorElement>("#sell-button");
        this._elements.upgradeButton = $<HTMLAnchorElement>("#upgrade-button");
        this._elements.saveButton = $<HTMLAnchorElement>("#save-button");

        setOnClick(this._elements.sellButton, this._actions?.onSell);
        setOnClick(this._elements.upgradeButton, this._actions?.onUpgrade);
        setOnClick(this._elements.saveButton, this._actions?.onSave);

    }

    protected render(context?: ScreenRenderingContext) {

        if(context?.type != ScreenRenderingContextType.MAIN_SCREEN_RENDERING_CONTEXT) return;

        this._elements.swordImage!.src = context.sword.imgSrc;

        write(this._elements.swordNumber, context.sword.index);

        if(context.isMax) this._elements.swordNumber?.classList.add("hightlight");

        write(this._elements.swordName, context.sword.name);

        this._elements.swordProb?.setAttribute("enabled", `${!context.isMax}`);
        this._elements.swordCost?.setAttribute("enabled", `${!context.isMax}`);

        if(!context.isMax) {

            const prob = context.sword.prob;

            write(this._elements.swordProb, Math.floor(prob*100));
            write(this._elements.swordCost, `${context.sword.cost}`);
        } else {
            write(this._elements.swordProb, "");
            write(this._elements.swordCost, "");
        }

        if(context.sword.price > 0) {
            write(this._elements.swordPrice, `${context.sword.price}`);
            visible(this._elements.swordPrice);
            visible(this._elements.sellButton);
        } else {
            invisible(this._elements.swordPrice);
            invisible(this._elements.sellButton);
        }

        if(context.sword.canSave) visible(this._elements.saveButton);
        else invisible(this._elements.saveButton);
    }

    public popupFallMessage(sword: Sword, loss: number, pieces: readonly PieceItem[], havingRepairPaper: number, requiredRepairPaper: number) {

        const popup = new Popup();
        popup.setTitle("파괴되었습니다", Color.RED);
        popup.setSubTitle(`손실: ${loss}원`);

        if(pieces.length > 0) {
            popup.addParagraphText("<떨어진 조각 목록>");
            pieces.forEach(
                pieceItem => {
                    const created_div = createElementWith("div", {classes: ["img_name_count_paragraph"]});
                    created_div.appendChild(createImageWithSrc(pieceItem.imgSrc));
                    new ColoredTextElement()
                        .add(`${pieceItem.name}`, Color.DARK_BLUE)
                        .add(` x `, Color.DARK_GRAY)
                        .add(`${pieceItem.count}`, Color.GOLD)
                        .add(`개`, Color.DARK_GRAY)
                        .build()
                        .forEach(element => created_div.appendChild(element));

                    popup.addParagraphElement(created_div);
                }
            );
        } else popup.addParagraphText("이런! 아무런 조각도 떨어지지 않았습니다.");
        
        if(havingRepairPaper >= requiredRepairPaper) {
            popup.addButton(
                "복구하기", Color.GREEN, ButtonType.REPAIR, HoverEffect.INCREASE, () => this._actions?.onRepair(sword, popup)
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
            "다시하기", Color.DARK_BLUE, ButtonType.REGAME, HoverEffect.TURNING, () => this._actions?.onInit(popup)
        );

        popup.build();

        popup.show();

    }

    public popupMaxUpgradeMessage() {
        const popup = new Popup();
        popup.setTitle("축하합니다!", Color.GOLD);
        popup.setSubTitle("최대 강화에 도달했습니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    public popupMoneyLackMessage() {
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

    public popupInvalidationMessage(pieces: readonly PieceItem[]) {

        const popup = new Popup();
        popup.setTitle("검이 파괴되었지만 복구되었습니다.", Color.BLUE);
        popup.setSubTitle("강화 비용 또한 반환되었습니다!");

        if(pieces.length > 0) {
            popup.addParagraphText("<떨어진 조각 목록>");
            pieces.forEach(
                pieceItem => {
                    const created_div = createElementWith("div", {classes: ["img_name_count_paragraph"]});
                    created_div.appendChild(createImageWithSrc(pieceItem.imgSrc));
                    new ColoredTextElement()
                        .add(`${pieceItem.name}`, Color.DARK_BLUE)
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

    public popupGodHandMessage(new_sword_index: number) {
        const popup = new Popup();
        popup.setTitle("신의 손 발동!", Color.GREEN);
        popup.setSubTitle("검이 2단계 상승했습니다.");
        popup.addParagraphText(`${new_sword_index} 강이 되었습니다!`);
        popup.addCloseButton();
        popup.build();
        popup.show();
    }

    public popupGameEndMessage() {
        const popup = new Popup();
        popup.setTitle("검을 최종 단계까지 업그레이드 했습니다.", Color.GOLD);
        popup.setSubTitle("충만한 검의 기운이 당신과 함께합니다!");
        popup.addParagraphText("창을 닫아도 게임은 계속됩니다.");
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
}

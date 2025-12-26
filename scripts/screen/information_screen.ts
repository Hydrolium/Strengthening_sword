import { onClickSwordInfoButton } from "../other/click_events.js";
import { ContextType, GameContext } from "../other/context.js";
import { $, createElementWith, createImageWithSrc, write } from "../other/element_controller.js";
import { Color, SwordItem, UnknownItem } from "../other/entity.js";
import { Game } from "../other/main.js";
import { ColoredText, Popup } from "../popup/popup_message.js";
import { Screen } from "./screen.js";

export class InformationScreen extends Screen {

    protected id = "game-information";

    elements: {
        foundSwords?: HTMLDivElement,
        swordCount?: HTMLSpanElement
    } = {};

    override changeBody() {
        super.changeBody();

        this.elements.foundSwords = $<HTMLDivElement>("#found-swords");
        this.elements.swordCount = $<HTMLSpanElement>("#found-sword-count");

    }

    private makeIcon(item: SwordItem | UnknownItem): HTMLDivElement {
        const created_div = createElementWith<HTMLDivElement>("div", {classes: ["sword_icon", (item instanceof SwordItem) ? "sword" : "unknown"]});

        created_div.appendChild(createImageWithSrc(item.imgSrc, item.name));

        if(item instanceof SwordItem) {
            created_div.appendChild(createElementWith("span", {classes: ["sword_name"], text: item.name}));

            created_div.addEventListener("click", () => onClickSwordInfoButton(item.id));
        }
        return created_div;
    }

    protected render(context?: GameContext) {

        if(context?.type != ContextType.FOUND_SWORDS) return;

        const created_found = context.swords.map(this.makeIcon);

        this.elements.foundSwords?.replaceChildren(...created_found);

        write(this.elements.swordCount, context.count);
    }

    popupSwordInfoMessage(id: string) {

        const sword = Game.swordManager.getSwordWithId(id);

        const popup = new Popup();

        popup.setIcon(sword.imgSrc);

        popup.setTitle(`<${sword.name}> 상세 정보`, Color.PURPLE);

        popup.addParagraphElement(
            new ColoredText<HTMLParagraphElement>("p").add("강화 확률: ", Color.DARK_GRAY).add(sword.prob * 100, Color.GOLD).add("%", Color.DARK_GRAY).build()
        );
        
        popup.addParagraphElement(
            new ColoredText<HTMLParagraphElement>("p").add("강화 비용: ", Color.DARK_GRAY).add(sword.cost, Color.GOLD).add("원", Color.DARK_GRAY).build()
        );

        if(sword.price != 0)
            popup.addParagraphElement(
                new ColoredText<HTMLParagraphElement>("p").add("판매 가격: ", Color.DARK_GRAY).add(sword.price, Color.GOLD).add("원", Color.DARK_GRAY).build()
            );
        else
            popup.addParagraphElement(
                new ColoredText<HTMLParagraphElement>("p").add("판매 가격: ", Color.DARK_GRAY).add("판매 불가", Color.RED).build()
            );
        
        if(sword.requiredRepairs != 0)
            popup.addParagraphElement(
                new ColoredText<HTMLParagraphElement>("p").add("파괴 시 필요 복구권: ", Color.DARK_GRAY).add(sword.requiredRepairs, Color.GOLD).add("개", Color.DARK_GRAY).build()
            );

        popup.addParagraphText("");
        if(sword.pieces.length > 0) {
            popup.addParagraphText("파괴 시 획득 가능한 조각 목록");
            sword.pieces.forEach(
                piece => {
                    const created_div = createElementWith("div", {classes: ["dropped_piece_info"]});
                    created_div.appendChild(createImageWithSrc(piece.imgSrc));
                    created_div.appendChild(createElementWith("span", {classes: ["name"], text: piece.name}));
                    created_div.appendChild(createElementWith("span", {classes: ["count"], text: `0~${piece.maxDrop}개`}));

                    popup.addParagraphElement(created_div);
                }
            )
        } else popup.addParagraphText("파괴 시 획득 가능한 조각이 없습니다.");
        

        popup.setFooter("*해당 정보는 강화소의 스탯이 계산되지 않은 정보입니다*", Color.RED)
        popup.addCloseButton();

        popup.build();
        popup.show();

    }
}
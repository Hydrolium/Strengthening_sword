import { ContextType } from "../other/context.js";
import { $, createElement } from "../other/element_controller.js";
import { Color } from "../other/entity.js";
import { Game } from "../other/main.js";
import { Popup } from "../popup/popup_message.js";
export class DeveloperMod {
    constructor() {
        this.touch = 0;
        this.infinityGold = false;
        this.infinityMaterial = false;
        this.alwaysSuccess = false;
        $("#developer-mod-button").addEventListener("click", () => {
            if (this.touch >= 2) {
                this.touch = 0;
                this.popupDeveloperModMessage();
            }
            else {
                this.touch++;
                setTimeout(() => this.touch = 0, 500);
            }
        });
    }
    makeCheckBox(label, checked, changeEvent) {
        const created_cover = createElement("p");
        const created_label = createElement("label");
        created_label.innerText = label + " ";
        const created_checkbox = createElement("input");
        created_checkbox.type = "checkbox";
        created_checkbox.checked = checked;
        created_checkbox.addEventListener("change", () => changeEvent(created_checkbox.checked));
        created_label.appendChild(created_checkbox);
        created_cover.appendChild(created_label);
        return created_cover;
    }
    popupDeveloperModMessage() {
        const popup = new Popup();
        popup.setTitle("개발자 모드", Color.DARK_BLUE);
        popup.addParagraphElement(this.makeCheckBox("골드 무한", this.infinityGold, checked => {
            this.infinityGold = checked;
            if (checked)
                Game.inventoryManager.setMoney(Infinity, {
                    type: ContextType.SYSTEM_MONEY_GIFT,
                    money: Infinity
                });
            else {
                Game.inventoryManager.setMoney(Game.startMoney, {
                    type: ContextType.SYSTEM_MONEY_GIFT,
                    money: Game.startMoney
                });
            }
        }));
        popup.addParagraphElement(this.makeCheckBox("제작 재료 무한", this.infinityMaterial, checked => {
            this.infinityMaterial = checked;
        }));
        popup.addParagraphElement(this.makeCheckBox("성공 확률 100%", this.alwaysSuccess, checked => this.alwaysSuccess = checked));
        popup.addCloseButton();
        popup.build();
        popup.show();
    }
}

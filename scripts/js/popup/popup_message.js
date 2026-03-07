import { $, createElement, createElementWith, createImageWithSrc, display, hide } from "../other/element_controller.js";
import { Color } from "../other/entity.js";
import { Keyframes } from "../screen/screen.js";
export class Popup {
    constructor() {
        this._created_message_main = createElementWith("div", { classes: ["message_main"] });
        this._created_text_box = createElementWith("div", { classes: ["text"] });
        this._created_title = createElementWith("p", { classes: ["title"] });
        this._created_button_box = createElementWith("div", { classes: ["buttons"] });
    }
    build() {
        if (this._created_icon)
            this._created_text_box.appendChild(this._created_icon);
        this._created_text_box.appendChild(this._created_title);
        if (this._created_subtitle)
            this._created_text_box.appendChild(this._created_subtitle);
        if (this._created_paragraph)
            this._created_text_box.appendChild(this._created_paragraph);
        if (this._created_footer)
            this._created_text_box.appendChild(this._created_footer);
        this._created_message_main.appendChild(this._created_text_box);
        this._created_message_main.appendChild(this._created_button_box);
    }
    show() {
        const element_popupMessageBox = $("#popup-message-box");
        element_popupMessageBox.replaceChildren(this._created_message_main);
        display(element_popupMessageBox);
        element_popupMessageBox.animate(Keyframes.popupKef, { duration: 300, fill: "both" });
    }
    close() {
        const element_popupMessageBox = $("#popup-message-box");
        hide(element_popupMessageBox);
        element_popupMessageBox.replaceChildren();
    }
    setIcon(imgSrc) {
        if (!this._created_icon)
            this._created_icon = createElementWith("img", { classes: ["popup_icon"] });
        this._created_icon.src = imgSrc;
    }
    setTitle(text, color) {
        this._created_title.textContent = text;
        this._created_title.classList.add(color);
    }
    setSubTitle(text) {
        if (!this._created_subtitle)
            this._created_subtitle = createElementWith("p", { classes: ["subtitle"] });
        this._created_subtitle.textContent = text;
    }
    addParagraphElement(element) {
        if (!this._created_paragraph)
            this._created_paragraph = createElementWith("div", { classes: ["paragraph"] });
        this._created_paragraph.appendChild(element);
    }
    addParagraphText(text) {
        this.addParagraphElement(createElementWith("p", { text: text }));
    }
    addColoredParagraph(element) {
        const created_p = createElement("p");
        created_p.replaceChildren(...element.build());
        this.addParagraphElement(created_p);
    }
    setFooter(text, color) {
        if (!this._created_footer)
            this._created_footer = createElementWith("p", { classes: ["footer"] });
        this._created_footer.textContent = text;
        this._created_footer.classList.add(color);
    }
    addButton(text, color, buttonType, hoverEffect, clickEvent) {
        const created_button = createElementWith("a", { classes: [color, hoverEffect] });
        created_button.appendChild(createImageWithSrc(`images/ui/buttons/${buttonType}.png`, text));
        created_button.appendChild(createElementWith("span", { text: text }));
        created_button.addEventListener("click", () => clickEvent(this));
        this._created_button_box.appendChild(created_button);
    }
    addCloseButton() {
        this.addButton("창 닫기", Color.RED, ButtonType.CLOSE, HoverEffect.ROTATE, () => this.close());
    }
}
export var HoverEffect;
(function (HoverEffect) {
    HoverEffect["ROTATE"] = "rotate";
    HoverEffect["INCREASE"] = "increase";
    HoverEffect["TURNING"] = "turning";
    HoverEffect["DECREASE"] = "decrease";
})(HoverEffect || (HoverEffect = {}));
export var ButtonType;
(function (ButtonType) {
    ButtonType["CLOSE"] = "close";
    ButtonType["MAKE"] = "make";
    ButtonType["REGAME"] = "regame";
    ButtonType["REPAIR"] = "repair";
    ButtonType["SAVE"] = "save";
    ButtonType["SELL"] = "sell";
    ButtonType["UPGRADE"] = "upgrade";
})(ButtonType || (ButtonType = {}));

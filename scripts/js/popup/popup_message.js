import { $, createElement, createElementWith, createImageWithSrc, display, hide } from "../other/element_controller.js";
import { Color } from "../other/entity.js";
import { Game } from "../other/main.js";
import { Keyframes } from "../screen/screen.js";
export class ColoredText {
    constructor(T_tag) {
        this.created_text = createElement(T_tag);
    }
    add(text, color) {
        this.created_text.appendChild(createElementWith("span", { classes: ["colored_text", color], text: text }));
        return this;
    }
    build() {
        return this.created_text;
    }
}
export class Popup {
    constructor() {
        this.created_message_main = createElementWith("div", { classes: ["message_main"] });
        this.created_text_box = createElementWith("div", { classes: ["text"] });
        this.created_title = createElementWith("p", { classes: ["title"] });
        this.created_button_box = createElementWith("div", { classes: ["buttons"] });
    }
    build() {
        if (this.created_icon)
            this.created_text_box.appendChild(this.created_icon);
        this.created_text_box.appendChild(this.created_title);
        if (this.created_subtitle)
            this.created_text_box.appendChild(this.created_subtitle);
        if (this.created_paragraph)
            this.created_text_box.appendChild(this.created_paragraph);
        if (this.created_footer)
            this.created_text_box.appendChild(this.created_footer);
        this.created_message_main.appendChild(this.created_text_box);
        this.created_message_main.appendChild(this.created_button_box);
    }
    show() {
        const element_popup_message_box = $("#popup-message-box");
        element_popup_message_box.replaceChildren(this.created_message_main);
        display(element_popup_message_box);
        element_popup_message_box.animate(Keyframes.popup_kef, { duration: 300, fill: "both" });
    }
    close() {
        const element_popup_message_box = $("#popup-message-box");
        hide(element_popup_message_box);
        element_popup_message_box.replaceChildren();
    }
    setIcon(imgSrc) {
        if (!this.created_icon)
            this.created_icon = createElementWith("img", { classes: ["popup_icon"] });
        this.created_icon.src = imgSrc;
    }
    setTitlte(text, color) {
        this.created_title.textContent = text;
        this.created_title.classList.add(color);
    }
    setSubTitle(text) {
        if (!this.created_subtitle)
            this.created_subtitle = createElementWith("p", { classes: ["subtitle"] });
        this.created_subtitle.textContent = text;
    }
    addParagraphText(text) {
        if (!this.created_paragraph)
            this.created_paragraph = createElementWith("div", { classes: ["paragraph"] });
        this.created_paragraph.appendChild(createElementWith("p", { text: text }));
    }
    addParagraphElement(element) {
        if (!this.created_paragraph)
            this.created_paragraph = createElementWith("div", { classes: ["paragraph"] });
        this.created_paragraph.appendChild(element);
    }
    setFooter(text, color) {
        if (!this.created_footer)
            this.created_footer = createElementWith("p", { classes: ["footer"] });
        this.created_footer.textContent = text;
        this.created_footer.classList.add(color);
    }
    addButton(text, color, buttonType, hoverEffect, clickEvent) {
        const created_button = createElementWith("a", { classes: [color, hoverEffect] });
        created_button.appendChild(createImageWithSrc(Game.Path[buttonType], text));
        created_button.appendChild(createElementWith("span", { text: text }));
        created_button.addEventListener("click", () => clickEvent(this));
        this.created_button_box.appendChild(created_button);
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
    ButtonType["CLOSE"] = "ui_close";
    ButtonType["MAKE"] = "ui_make";
    ButtonType["REGAME"] = "ui_regame";
    ButtonType["REPAIR"] = "ui_repair";
    ButtonType["SAVE"] = "ui_save";
    ButtonType["SELL"] = "ui_sell";
    ButtonType["UPGRADE"] = "ui_upgrade";
})(ButtonType || (ButtonType = {}));

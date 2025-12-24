import { $, createElement, createElementWith, createImageWithSrc, display, hide } from "../other/element_controller.js";
import { Color } from "../other/entity.js";
import { Game } from "../other/main.js";
import { Keyframes } from "../screen/screen.js";


export class ColoredText<T extends HTMLElement> {
    private created_text: T;

    constructor(T_tag: string) {
        this.created_text = createElement<T>(T_tag);
    }

    add(text: any, color: Color): ColoredText<T> {
        this.created_text.appendChild(
            createElementWith("span", {classes: ["colored_text", color], text: text})
        );
        return this;
    }

    build(): T {
        return this.created_text;
    }
}

export class Popup {

    private created_message_main: HTMLDivElement;

    private created_icon?: HTMLImageElement;

    private created_text_box: HTMLDivElement;
    private created_title: HTMLParagraphElement;

    private created_subtitle?: HTMLParagraphElement;
    private created_paragraph?: HTMLDivElement;
    private created_footer?: HTMLParagraphElement;

    private created_button_box: HTMLDivElement;

    constructor() {
        this.created_message_main = createElementWith<HTMLDivElement>("div", {classes: ["message_main"]});

        this.created_text_box = createElementWith<HTMLDivElement>("div", {classes: ["text"]});
        this.created_title = createElementWith<HTMLParagraphElement>("p", {classes: ["title"]});
        
        this.created_button_box = createElementWith<HTMLDivElement>("div", {classes: ["buttons"]});
    }

    build() {
        if(this.created_icon) this.created_text_box.appendChild(this.created_icon);
        this.created_text_box.appendChild(this.created_title);
        if(this.created_subtitle) this.created_text_box.appendChild(this.created_subtitle);
        if(this.created_paragraph) this.created_text_box.appendChild(this.created_paragraph);
        if(this.created_footer) this.created_text_box.appendChild(this.created_footer);

        this.created_message_main.appendChild(this.created_text_box);
        this.created_message_main.appendChild(this.created_button_box);

    }

    show() {
        const element_popup_message_box = $("#popup-message-box");

        element_popup_message_box.replaceChildren(this.created_message_main);

        display(element_popup_message_box);
        element_popup_message_box.animate(
            Keyframes.popup_kef,
            {duration: 300, fill: "both"}
        );
    }

    close() {

        const element_popup_message_box = $("#popup-message-box");
        hide(element_popup_message_box);

        element_popup_message_box.replaceChildren();
    }

    setIcon(imgSrc: string) {
        if(!this.created_icon) this.created_icon = createElementWith<HTMLImageElement>("img", {classes: ["popup_icon"]});
        this.created_icon.src = imgSrc;
    }

    setTitlte(text: string, color: Color) {
        this.created_title.textContent = text;
        this.created_title.classList.add(color);
    }

    setSubTitle(text: string) {
        if(!this.created_subtitle) this.created_subtitle = createElementWith<HTMLParagraphElement>("p", {classes: ["subtitle"]});

        this.created_subtitle.textContent = text;
    }

    addParagraphText(text: string) {

        if(!this.created_paragraph) this.created_paragraph = createElementWith<HTMLDivElement>("div", {classes: ["paragraph"]});

        this.created_paragraph.appendChild(
            createElementWith("p", {text: text})
        );

    }

    addParagraphElement(element: HTMLElement) {

        if(!this.created_paragraph) this.created_paragraph = createElementWith<HTMLDivElement>("div", {classes: ["paragraph"]});

        this.created_paragraph.appendChild(element);

    }

    setFooter(text: string, color: Color) {
        if(!this.created_footer) this.created_footer = createElementWith<HTMLParagraphElement>("p", {classes: ["footer"]});

        this.created_footer.textContent = text;
        this.created_footer.classList.add(color);
    }

    addButton(text: string, color: Color, buttonType: ButtonType, hoverEffect: HoverEffect, clickEvent: (popup: Popup) => void) {

        const created_button = createElementWith<HTMLAnchorElement>("a", {classes: [color, hoverEffect]});
        created_button.appendChild(createImageWithSrc(Game.Path[buttonType], text));
        created_button.appendChild(createElementWith("span", {text: text}));

        created_button.addEventListener("click", () => clickEvent(this));
        this.created_button_box.appendChild(created_button);
    }

    addCloseButton() {
        this.addButton(
            "창 닫기", Color.RED, ButtonType.CLOSE, HoverEffect.ROTATE, () => this.close()
        );
    }

}

export enum HoverEffect {
    ROTATE = "rotate",
    INCREASE = "increase",
    TURNING = "turning",
    DECREASE = "decrease"
}

export enum ButtonType {
    CLOSE = "ui_close",
    MAKE = "ui_make",
    REGAME = "ui_regame",
    REPAIR = "ui_repair",
    SAVE = "ui_save",
    SELL = "ui_sell",
    UPGRADE = "ui_upgrade"
}
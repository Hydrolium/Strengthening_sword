import { ColoredTextElement } from "./colored_text.js";
import { $, createElement, createElementWith, createImageWithSrc, display, hide } from "./element_controller.js";
import { Keyframes } from "../screen/refreshable.js";
import { ButtonType, Color, HoverEffect } from "./popup_info.js";

export class Popup {

    private _created_message_main: HTMLDivElement;

    private _created_icon?: HTMLImageElement;

    private _created_text_box: HTMLDivElement;
    private _created_title: HTMLParagraphElement;

    private _created_subtitle?: HTMLParagraphElement;
    private _created_paragraph?: HTMLDivElement;
    private _created_footer?: HTMLParagraphElement;

    private _created_button_box: HTMLDivElement;

    constructor() {
        this._created_message_main = createElementWith<HTMLDivElement>("div", {classes: ["message_main"]});

        this._created_text_box = createElementWith<HTMLDivElement>("div", {classes: ["text"]});
        this._created_title = createElementWith<HTMLParagraphElement>("p", {classes: ["title"]});
        
        this._created_button_box = createElementWith<HTMLDivElement>("div", {classes: ["buttons"]});
    }

    public build() {
        if(this._created_icon) this._created_text_box.appendChild(this._created_icon);
        this._created_text_box.appendChild(this._created_title);
        if(this._created_subtitle) this._created_text_box.appendChild(this._created_subtitle);
        if(this._created_paragraph) this._created_text_box.appendChild(this._created_paragraph);
        if(this._created_footer) this._created_text_box.appendChild(this._created_footer);

        this._created_message_main.appendChild(this._created_text_box);
        this._created_message_main.appendChild(this._created_button_box);

    }

    public show() {
        const element_popupMessageBox = $("#popup-message-box");

        element_popupMessageBox.replaceChildren(this._created_message_main);

        display(element_popupMessageBox);
        element_popupMessageBox.animate(
            Keyframes.popupKef,
            {duration: 300, fill: "both"}
        );
    }

    public close() {

        const element_popupMessageBox = $("#popup-message-box");
        hide(element_popupMessageBox);

        element_popupMessageBox.replaceChildren();
    }

    public setIcon(imgSrc: string) {
        if(!this._created_icon) this._created_icon = createElementWith<HTMLImageElement>("img", {classes: ["popup_icon"]});
        this._created_icon.src = imgSrc;
    }

    public setTitle(text: string, color: Color) {
        this._created_title.textContent = text;
        this._created_title.classList.add(color);
    }

    public setSubTitle(text: string) {
        if(!this._created_subtitle) this._created_subtitle = createElementWith<HTMLParagraphElement>("p", {classes: ["subtitle"]});

        this._created_subtitle.textContent = text;
    }

    public addParagraphElement(element: HTMLElement) {

        if(!this._created_paragraph) this._created_paragraph = createElementWith<HTMLDivElement>("div", {classes: ["paragraph"]});

        this._created_paragraph.appendChild(element);
    }

    public addParagraphText(text: string) {

        this.addParagraphElement(
            createElementWith("p", {text: text})
        );

    }

    public addColoredParagraph(element: ColoredTextElement) {
        const created_p = createElement("p");
        created_p.replaceChildren(...element.build());

        this.addParagraphElement(created_p);
    }

    public setFooter(text: string, color: Color) {
        if(!this._created_footer) this._created_footer = createElementWith<HTMLParagraphElement>("p", {classes: ["footer"]});

        this._created_footer.textContent = text;
        this._created_footer.classList.add(color);
    }

    public addButton(text: string, color: Color, buttonType: ButtonType, hoverEffect: HoverEffect, clickEvent?: (popup: Popup) => void) {

        const created_button = createElementWith<HTMLAnchorElement>("a", {classes: [color, hoverEffect]});
        created_button.appendChild(createImageWithSrc(`images/ui/buttons/${buttonType}.png`, text));
        created_button.appendChild(createElementWith("span", {text: text}));

        clickEvent && created_button.addEventListener("click", () => clickEvent(this));
        this._created_button_box.appendChild(created_button);
    }

    public addCloseButton() {
        this.addButton(
            "창 닫기", Color.RED, ButtonType.CLOSE, HoverEffect.ROTATE, () => this.close()
        );
    }
}



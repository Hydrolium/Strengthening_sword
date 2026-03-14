export function $<T extends HTMLElement>(tag: string): T {
    return document.querySelector(tag) as T;
}

export function write(element: HTMLElement | undefined, text: any) {
    if (element) element.textContent = `${text}`;
}

export function setVisibility(element: HTMLElement | undefined, visible: boolean) {
    if(element) element.style.visibility = (visible) ? "visible" : "hidden";
}

export function createImageWithSrc(src: string, alt=""): HTMLImageElement {
    const img = new Image();
    img.src = src;
    img.alt = alt;
    return img;
}

export interface Attribute {
    readonly classes?: readonly string[];
    readonly text?: any;
    readonly id?: string;
}

export function createElement<T extends HTMLElement>(tag: string): T {
    return document.createElement(tag) as T;
}

export function createElementWith<T extends HTMLElement>(tag: string, attribute: Attribute): T {
    const element = createElement<T>(tag);

    if(attribute.classes) element.classList.add(...attribute.classes);
    if(attribute.text) element.textContent = `${attribute.text}`;
    if(attribute.id) element.id = attribute.id;

    return element;
}

export function display(element?: HTMLElement) { if(element) element.style.display = "block" };
export function hide(element?: HTMLElement) { if(element) element.style.display = "none" };

export function setOnClick(element: HTMLElement | undefined, handler?: () => void) {
    if(element && handler) element.onclick = handler;
}
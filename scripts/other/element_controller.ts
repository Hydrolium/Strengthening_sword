export function $<T extends HTMLElement>(tag: string): T {
    return document.querySelector(tag) as T;
}

export function write(element: HTMLElement | undefined, text: any) {
    if (element) element.textContent = `${text}`;
}

export function visible(element?: HTMLElement) {
    if(element) element.style.visibility = "visible";
}

export function invisible(element?: HTMLElement) {
    if(element) element.style.visibility = "hidden";
}

export function createImageWithSrc(src: string, alt=""): HTMLImageElement {
    const img = new Image();
    img.src = src;
    img.alt = alt;
    return img;
}

export interface Attribute {
    classes?: string[];
    text?: any;
    id?: string;
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

export function display(element: HTMLElement) { element.style.display = "block" };
export function hide(element: HTMLElement) { element.style.display = "none" };
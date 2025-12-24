export function $(tag) {
    return document.querySelector(tag);
}
export function write(element, text) {
    if (element)
        element.textContent = `${text}`;
}
export function visible(element) {
    element.style.visibility = "visible";
}
export function invisible(element) {
    element.style.visibility = "hidden";
}
export function createImageWithSrc(src, alt = "") {
    const img = new Image();
    img.src = src;
    img.alt = alt;
    return img;
}
export function createElement(tag) {
    return document.createElement(tag);
}
export function createElementWith(tag, attribute) {
    const element = createElement(tag);
    if (attribute.classes)
        element.classList.add(...attribute.classes);
    if (attribute.text)
        element.textContent = attribute.text.toString();
    if (attribute.id)
        element.id = attribute.id;
    return element;
}
export function display(element) { element.style.display = "block"; }
;
export function hide(element) { element.style.display = "none"; }
;

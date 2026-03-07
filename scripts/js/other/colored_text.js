import { createElementWith } from "./element_controller";
export class ColoredTextElement {
    constructor() {
        this._elements = [];
    }
    add(text, color) {
        this._elements.push(createElementWith("span", { classes: ["colored_text", color], text: text }));
        return this;
    }
    build() {
        return this._elements;
    }
}

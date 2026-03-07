import { createElementWith } from "./element_controller";
export class ColoredTextElement {
    constructor() {
        this.elements = [];
    }
    add(text, color) {
        this.elements.push(createElementWith("span", { classes: ["colored_text", color], text: text }));
        return this;
    }
    build() {
        return this.elements;
    }
}

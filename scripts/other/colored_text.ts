import { createElementWith } from "./element_controller";
import { Color } from "./entity";

export class ColoredTextElement {
    private elements: HTMLElement[] = [];

    add(text: any, color: Color): ColoredTextElement {
        this.elements.push(createElementWith("span", {classes: ["colored_text", color], text: text}));
        return this;
    }

    build(): readonly HTMLElement[] {
        return this.elements;
    }
}
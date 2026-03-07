import { createElementWith } from "./element_controller";
import { Color } from "./entity";

export class ColoredTextElement {
    private _elements: HTMLElement[] = [];

    public add(text: any, color: Color): ColoredTextElement {
        this._elements.push(createElementWith("span", {classes: ["colored_text", color], text: text}));
        return this;
    }

    public build(): readonly HTMLElement[] {
        return this._elements;
    }
}
import { GameContext } from "../other/context.js";
import { $ } from "../other/element_controller.js";
import { Game } from "../other/main.js";

export class Keyframes{
    static lodding_kef = [{opacity: '0'}, {opacity: '1'}];
    static hammer_kef = [{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0deg)", offset: 0, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: .4, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0turn)", offset: .7, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: 1, easing: "ease" }];
    static popup_kef = [{opacity: '0'}, {opacity: '1'}];
    static money_change_kef = [{opacity: '1', transform: 'translate(-30%, 0%)'},{opacity: '0', transform: 'translate(-30%, -70%)'}];
};

export abstract class Refreshable {
    abstract refresh(event?: GameContext): void;
}

export abstract class Screen extends Refreshable {

    abstract id: string;

    static changeBody(id: string) {
        Game.currentScreenId = id;
        const element_template = $<HTMLTemplateElement>("#" + id);
        document.querySelector("#main-body")?.replaceChildren(document.importNode(element_template.content, true));
    }

    show(event?: GameContext) {
        Screen.changeBody(this.id);
        this.refresh(event);
    }

    refresh = (event?: GameContext) => {
        if(Game.currentScreenId == this.id) this.render(event);
    }


    abstract render(context?: GameContext): void;

}

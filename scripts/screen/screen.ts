import { GameContext } from "../other/context.js";
import { $ } from "../other/element_controller.js";
import { Game } from "../other/main.js";

export class Keyframes{
    static readonly loadingKef: Keyframe[] = [{opacity: '0'}, {opacity: '1'}];
    static readonly hammerKef: Keyframe[] = [{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0deg)", offset: 0, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: .4, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0turn)", offset: .7, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: 1, easing: "ease" }];
    static readonly popupKef: Keyframe[] = [{opacity: '0'}, {opacity: '1'}];
    static readonly moneyChangeKef: Keyframe[] = [{opacity: '1', transform: 'translate(-30%, 0%)'},{opacity: '0', transform: 'translate(-30%, -70%)'}];
};

export abstract class Refreshable {
    public abstract refresh: (event?: GameContext) => void;
}

export abstract class Screen extends Refreshable {

    protected abstract readonly _id: string;

    protected changeBody() {
        Game.currentScreenId = this._id;
        const element_template = $<HTMLTemplateElement>("#" + this._id);
        document.querySelector("#main-body")?.replaceChildren(document.importNode(element_template.content, true));
    }

    public show(context?: GameContext) {
        this.changeBody();
        this.refresh(context);
    }

    public refresh = (context?: GameContext) => {
        if(Game.currentScreenId == this._id) this.render(context);
    }

    protected abstract render(context?: GameContext): void;
}

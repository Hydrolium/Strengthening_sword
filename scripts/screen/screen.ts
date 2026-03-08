import { ScreenContext } from "../context/rendering/screen_context.js";
import { ScreenRenderingContext } from "../context/rendering/screen_rendering_context.js";
import { isScreenShowingContext, ScreenShowingContext, ScreenShowingContextType } from "../context/rendering/screen_showing_context.js";
import { EventHandler } from "../event/listener/event_handler.js";
import { $ } from "../other/element_controller.js";

export class Keyframes{
    static readonly loadingKef: Keyframe[] = [{opacity: '0'}, {opacity: '1'}];
    static readonly hammerKef: Keyframe[] = [{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0deg)", offset: 0, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: .4, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0turn)", offset: .7, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: 1, easing: "ease" }];
    static readonly popupKef: Keyframe[] = [{opacity: '0'}, {opacity: '1'}];
    static readonly moneyChangeKef: Keyframe[] = [{opacity: '1', transform: 'translate(-30%, 0%)'},{opacity: '0', transform: 'translate(-30%, -70%)'}];
};

export abstract class Refreshable {
    public abstract refresh: (event: ScreenContext) => void;
}

export abstract class Screen extends Refreshable {

    private static currentScreenId: ScreenShowingContextType;

    protected abstract readonly _id: ScreenShowingContextType;

    protected changeBody = () => {
        Screen.currentScreenId = this._id;

        const element_template = $<HTMLTemplateElement>("#" + this._id);
        document.querySelector("#main-body")?.replaceChildren(document.importNode(element_template.content, true));

        this.init();
    }

    protected abstract init(): void;

    public refresh = (context: ScreenContext) => {

        if(isScreenShowingContext(context)) {
            if(this._id == context.type) {
                this.changeBody();
                this.render(context.renderingContext);
            }
        } else if (Screen.currentScreenId == this._id) this.render(context);

    }


    protected abstract render(context: ScreenRenderingContext): void;
}

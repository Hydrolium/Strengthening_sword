import { $ } from "../other/element_controller.js";
import { Game } from "../other/main.js";
export class Keyframes {
}
Keyframes.lodding_kef = [{ opacity: '0' }, { opacity: '1' }];
Keyframes.hammer_kef = [{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0deg)", offset: 0, easing: "ease" }, { transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: .4, easing: "ease" }, { transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0turn)", offset: .7, easing: "ease" }, { transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: 1, easing: "ease" }];
Keyframes.popup_kef = [{ opacity: '0' }, { opacity: '1' }];
Keyframes.money_change_kef = [{ opacity: '1', transform: 'translate(-30%, 0%)' }, { opacity: '0', transform: 'translate(-30%, -70%)' }];
;
export class Refreshable {
}
export class Screen extends Refreshable {
    constructor() {
        super(...arguments);
        this.refresh = (event) => {
            if (Game.currentScreenId == this.id)
                this.render(event);
        };
    }
    static changeBody(id) {
        var _a;
        Game.currentScreenId = id;
        const element_template = $("#" + id);
        (_a = document.querySelector("#main-body")) === null || _a === void 0 ? void 0 : _a.replaceChildren(document.importNode(element_template.content, true));
    }
    show(event) {
        Screen.changeBody(this.id);
        this.refresh(event);
    }
}

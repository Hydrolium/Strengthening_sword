import { ScreenDrawingContext } from "../context/rendering/screen_drawing_context";
import { ScreenShowingContext } from "../context/rendering/screen_showing_context";

export class Keyframes {
    static readonly loadingKef: Keyframe[] = [{opacity: '0'}, {opacity: '1'}];
    static readonly hammerKef: Keyframe[] = [{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0deg)", offset: 0, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: .4, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0turn)", offset: .7, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: 1, easing: "ease" }];
    static readonly popupKef: Keyframe[] = [{opacity: '0'}, {opacity: '1'}];
    static readonly moneyChangeKef: Keyframe[] = [{opacity: '1', transform: 'translate(-30%, 0%)'},{opacity: '0', transform: 'translate(-30%, -70%)'}];
};

export interface Refreshable {
    refresh: (context: ScreenDrawingContext) => void;
    show: (context: ScreenShowingContext) => void;
}

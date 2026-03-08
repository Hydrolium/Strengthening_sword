import { ScreenContext } from "../context/rendering/screen_context";
import { Observer } from "../other/entity";

export class ScreenManager extends Observer {

    public update(screenContext: ScreenContext) {
        this.notify(screenContext);
    }

}
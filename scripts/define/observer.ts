import { ScreenDrawingContextType, ScreenDrawingContext } from "../context/rendering/screen_drawing_context";
import { ScreenShowingContextType, ScreenShowingContext } from "../context/rendering/screen_showing_context";
import { Refreshable } from "../screen/refreshable";


export abstract class Observer {

    abstract readonly target: ReadonlySet<ScreenShowingContextType | ScreenDrawingContextType>;

    private readonly showingObservers: Map<ScreenShowingContextType, Refreshable> = new Map();
    private readonly renderingObservers: Map<ScreenDrawingContextType, Refreshable> = new Map();

    public subscribeShowing(contextType: ScreenShowingContextType, refreshable: Refreshable) {
        if (!this.target.has(contextType)) throw Error(`${contextType} 은 이 Observer가 구독할 수 없습니다.`);

        this.showingObservers.set(contextType, refreshable);
    }

    public subscribeDrawing(contextType: ScreenDrawingContextType, refreshable: Refreshable) {
        if (!this.target.has(contextType)) throw Error(`${contextType} 은 이 Observer가 구독할 수 없습니다.`);

        this.renderingObservers.set(contextType, refreshable);
    }

    protected notifyShowing(context: ScreenShowingContext) {
        this.showingObservers.forEach((refreshable, type) => {
            if (type == context.type) refreshable.show(context);
        });
    }
    protected notifyDrawing(context: ScreenDrawingContext) {
        this.renderingObservers.forEach((refreshable, type) => {
            if (type == context.type) refreshable.refresh(context);
        });
    }
}

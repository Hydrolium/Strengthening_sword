import { ScreenContext } from "../context/rendering/screen_context";
import { ScreenDrawingContextType } from "../context/rendering/screen_drawing_context";
import { isScreenShowingContext, ScreenShowingContextType } from "../context/rendering/screen_showing_context";
import { Observer } from "../define/observer";

export class ScreenManager extends Observer {

    readonly target: ReadonlySet<ScreenDrawingContextType | ScreenShowingContextType> = new Set([
        ScreenShowingContextType.MAIN_SCREEN_SHOWING_CONTEXT,
        ScreenShowingContextType.INFORMATION_SCREEN_SHOWING_CONTEXT,
        ScreenShowingContextType.INVENTORY_SCREEN_SHOWING_CONTEXT,
        ScreenShowingContextType.MAKING_SCREEN_SHOWING_CONTEXT,
        ScreenShowingContextType.STAT_SCREEN_SHOWING_CONTEXT,

        ScreenDrawingContextType.MAKING_SCREEN_RENDERING_CONTEXT,
        ScreenDrawingContextType.MAKING_SCREEN_ANIMATING_CONTEXT,

        ScreenDrawingContextType.UPGRADE_FAILURE_CONTEXT,
        ScreenDrawingContextType.MAX_UPGRADE_CONTEXT,
        ScreenDrawingContextType.MONEY_LACK_CONTEXT,
        ScreenDrawingContextType.INVALIDATION_CONTEXT,
        ScreenDrawingContextType.GOD_HAND_CONTEXT,
        ScreenDrawingContextType.GAME_END_CONTEXT,
        ScreenDrawingContextType.SWORD_INFO_CONTEXT,
        ScreenDrawingContextType.ASKING_SWORD_ITEM_BREAK_CONTEXT,
        ScreenDrawingContextType.SWORD_ITEM_BREAKED_CONTEXT,
        ScreenDrawingContextType.ASKING_SWORD_ITEM_SELL_CONTEXT,
        ScreenDrawingContextType.WHERE_PIECE_DROPPED_CONTEXT,
        ScreenDrawingContextType.ITEM_INFO_SEARCH_CONTEXT,
        ScreenDrawingContextType.SWORD_CRAFTING_CONTEXT,
        ScreenDrawingContextType.MAX_STAT_CONTEXT,
        ScreenDrawingContextType.STAT_POINT_LACK_CONTEXT,
        ScreenDrawingContextType.GAME_ALL_STAT_CONTEXT
    ]);


    public update(screenContext: ScreenContext) {
        if(isScreenShowingContext(screenContext)) this.notifyShowing(screenContext);
        else this.notifyDrawing(screenContext);
    }

}
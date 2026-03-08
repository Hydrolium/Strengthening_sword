import { ScreenContext } from "./screen_context";
import { InformationScreenRenderingContext, InventoryScreenRenderingContext, MainScreenRenderingContext, MakingScreenRenderingContext, StatScreenRenderingContext } from "./screen_rendering_context";

export enum ScreenShowingContextType {

    MAIN_SCREEN_SHOWING_CONTEXT = "game-interface",
    INFORMATION_SCREEN_SHOWING_CONTEXT = "game-information",
    INVENTORY_SCREEN_SHOWING_CONTEXT = "inventory",
    MAKING_SCREEN_SHOWING_CONTEXT = "making",
    STAT_SCREEN_SHOWING_CONTEXT = "game-stat"

}

export function isScreenShowingContext(a: ScreenContext): a is ScreenShowingContext {
    return 'renderingContext' in a;
}

export type ScreenShowingContext = MainScreenShowingContext | InformationScreenShowingContext | InventoryScreenShowingContext | MakingScreenShowingContext | StatScrenShowingContext; 

export interface MainScreenShowingContext {
    readonly type: ScreenShowingContextType.MAIN_SCREEN_SHOWING_CONTEXT;

    readonly renderingContext: MainScreenRenderingContext;
}

export interface InformationScreenShowingContext {
    readonly type: ScreenShowingContextType.INFORMATION_SCREEN_SHOWING_CONTEXT;
    
    readonly renderingContext: InformationScreenRenderingContext;
}

export interface InventoryScreenShowingContext {
    readonly type: ScreenShowingContextType.INVENTORY_SCREEN_SHOWING_CONTEXT;

    readonly renderingContext: InventoryScreenRenderingContext;
}

export interface MakingScreenShowingContext {

    readonly type: ScreenShowingContextType.MAKING_SCREEN_SHOWING_CONTEXT;

    readonly renderingContext: MakingScreenRenderingContext;
}

export interface StatScrenShowingContext {
    readonly type: ScreenShowingContextType.STAT_SCREEN_SHOWING_CONTEXT;

    readonly renderingContext: StatScreenRenderingContext;
}
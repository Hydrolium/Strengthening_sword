import { Recipe } from "../../define/object/recipe";
import { StatInfo } from "../../define/object/stat";
import { SwordInfoByPiece } from "../../define/object/sword";
import { SwordItem } from "../../define/object/item";
import { PieceItem } from "../../define/object/item";
import { StorageInfo } from "../../define/storage";
import { Popup } from "../../element/popup_message";
import { InventoryUpdateContextType } from "../updating/inventory_update_context";
import { Sword } from "../../define/object/sword";

export enum ScreenDrawingContextType {

    MAIN_SCREEN_RENDERING_CONTEXT = "MAIN_SCREEN_RENDERING_CONTEXT",
    MAKING_SCREEN_RENDERING_CONTEXT = "MAKING_SCREEN_RENDERING_CONTEXT",
    INVENTORY_SCREEN_RENDERING_CONTEXT = "INVENTORY_SCREEN_RENDERING_CONTEXT",
    INFORMATION_SCREEN_RENDERING_CONTEXT = "INFORMATION_SCREEN_RENDERING_CONTEXT",
    STAT_SCREEN_RENDERING_CONTEXT = "STAT_SCREEN_RENDERING_CONTEXT",

    MAKING_SCREEN_ANIMATING_CONTEXT = "MAKING_SCREEN_ANIMATING_CONTEXT",

    RECORD_DISPLAY_RENDERING_CONTEXT = "RECORD_DISPLAY_RENDERING_CONTEXT",
    MONEY_DISPLAY_RENDERING_CONTEXT = "MONEY_DISPLAY_RENDERING_CONTEXT",

    UPGRADE_FAILURE_CONTEXT = "UPGRADE_FAILURE_CONTEXT",
    MAX_UPGRADE_CONTEXT = "MAX_UPGRADE_CONTEXT",
    MONEY_LACK_CONTEXT = "MONEY_LACK_CONTEXT",
    INVALIDATION_CONTEXT = "INVALIDATION_CONTEXT",
    GOD_HAND_CONTEXT = "GOD_HAND_CONTEXT",
    GAME_END_CONTEXT = "GAME_END_CONTEXT",
    SWORD_INFO_CONTEXT = "SWORD_INFO_CONTEXT",
    ASKING_SWORD_ITEM_BREAK_CONTEXT = "ASKING_SWORD_ITEM_BREAK_CONTEXT",
    SWORD_ITEM_BREAKED_CONTEXT = "SWORD_ITEM_BREAKED_CONTEXT",
    ASKING_SWORD_ITEM_SELL_CONTEXT = "ASKING_SWORD_ITEM_SELL_CONTEXT",
    WHERE_PIECE_DROPPED_CONTEXT = "WHERE_PIECE_DROPPED_CONTEXT",
    SWORD_CRAFTING_CONTEXT = "SWORD_CRAFTING_CONTEXT",
    MAX_STAT_CONTEXT = "MAX_STAT_CONTEXT",
    STAT_POINT_LACK_CONTEXT = "STAT_POINT_LACK_CONTEXT",
    GAME_ALL_STAT_CONTEXT = "GAME_ALL_STAT_CONTEXT"
}

export type ScreenDrawingContext = MainScreenRenderingContext | MakingScreenRenderingContext | InventoryScreenRenderingContext | InformationScreenRenderingContext | StatScreenRenderingContext | RecordStorageRenderingContext0 | RecordStorageRenderingContext1 | RecordStorageRenderingContext2 | RecordStorageRenderingContext3 | RecordStorageRenderingContext4 | MoneyDisplayRenderingContext | MakingScreenAnimatingContext | UpgradeFailureContext | MaxUpgradeContext | MoneyLackContext | InvalidationContext | GodHandContext | GameEndContext | SwordInfoContext | AskingSwordItemBreakContext | SwordItemBreakedContext | AskingSwordItemSellContext | WherePieceDroppedContext | SwordCraftingContext | MaxStatContext | StatPointLackContext | GameAllStatContext; 

export const popupDrawingTypes = [
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
    ScreenDrawingContextType.SWORD_CRAFTING_CONTEXT,
    ScreenDrawingContextType.MAX_STAT_CONTEXT,
    ScreenDrawingContextType.STAT_POINT_LACK_CONTEXT,
    ScreenDrawingContextType.GAME_ALL_STAT_CONTEXT,
] as const;

export interface MainScreenRenderingContext {
    readonly type: ScreenDrawingContextType.MAIN_SCREEN_RENDERING_CONTEXT;

    readonly sword: Sword;
    readonly isMax: boolean;
}

export interface MakingScreenRenderingContext {
    readonly type: ScreenDrawingContextType.MAKING_SCREEN_RENDERING_CONTEXT;

    readonly foundSwordIds: ReadonlySet<string>;
    readonly money: number;
    readonly repairPaperCount: number;
    readonly havingPieces: StorageInfo<PieceItem>;
    readonly havingSwords: StorageInfo<SwordItem>;
    readonly repairPaperRecipes: readonly Recipe[];
    readonly swordRecipes: readonly Recipe[];
}

export interface InventoryScreenRenderingContext {
    readonly type: ScreenDrawingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT;
    
    readonly swordStorage: StorageInfo<SwordItem>;
    readonly pieceStorage: StorageInfo<PieceItem>;
    readonly repairPapers: number;
}

export interface InformationScreenRenderingContext {
    
    readonly type: ScreenDrawingContextType.INFORMATION_SCREEN_RENDERING_CONTEXT;

    readonly swords: readonly SwordItem[];
    readonly founds: ReadonlySet<number>;
}

export interface StatScreenRenderingContext {
    readonly type: ScreenDrawingContextType.STAT_SCREEN_RENDERING_CONTEXT;

    readonly statPoint: number;
    readonly stats: readonly StatInfo[];

}

export interface MakingScreenAnimatingContext {
    readonly type: ScreenDrawingContextType.MAKING_SCREEN_ANIMATING_CONTEXT;

    readonly speed: number;
    readonly onFinish: () => void;
}

export enum MoneyChangeReason {
    SYSTEM_MONEY_GIFT = InventoryUpdateContextType.SYSTEM_MONEY_GIFT,
    SWORD_UPGRADE = InventoryUpdateContextType.SWORD_UPGRADE,
    SWORD_SELL = InventoryUpdateContextType.SWORD_SELL,
    SWORD_RESTORE = InventoryUpdateContextType.SWORD_RESTORE,
    BUY_USING_MONEY = InventoryUpdateContextType.BUY_USING_MONEY
}

export interface RecordStorageRenderingContext0 {
    readonly type: ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT;

    readonly reason: MoneyChangeReason.SYSTEM_MONEY_GIFT;
    readonly money: number;
}

export interface RecordStorageRenderingContext1 {
    readonly type: ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT;

    readonly reason: MoneyChangeReason.SWORD_UPGRADE;
    readonly name: string;
    readonly cost: number;
}

export interface RecordStorageRenderingContext2 {
    readonly type: ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT;

    readonly reason: MoneyChangeReason.SWORD_SELL;
    readonly name: string;
    readonly price: number;
}

export interface RecordStorageRenderingContext3 {
    readonly type: ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT;

    readonly reason: MoneyChangeReason.SWORD_RESTORE;
    readonly name: string;
    readonly cost: number;
}

export interface RecordStorageRenderingContext4 {
    readonly type: ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT;

    readonly reason: MoneyChangeReason.BUY_USING_MONEY;
    readonly resultName: string;
    readonly count: number;
    readonly price: number;
}

export interface MoneyDisplayRenderingContext {
    readonly type: ScreenDrawingContextType.MONEY_DISPLAY_RENDERING_CONTEXT;

    readonly havingMoney: number;
    readonly deltaMoney: number;
}


export interface UpgradeFailureContext {
    readonly type: ScreenDrawingContextType.UPGRADE_FAILURE_CONTEXT;

    readonly sword: Sword;
    readonly loss: number;
    readonly pieces: readonly PieceItem[];
    readonly havingRepairPaper: number;
    readonly requiredRepairPaper: number;
    
    readonly onRepair: (sword: Sword, popup: Popup) => void;
    readonly onInit: (popup: Popup) => void;
}

export interface MaxUpgradeContext {
    readonly type: ScreenDrawingContextType.MAX_UPGRADE_CONTEXT;
}

export interface MoneyLackContext {
    readonly type: ScreenDrawingContextType.MONEY_LACK_CONTEXT;
}

export interface InvalidationContext {
    readonly type: ScreenDrawingContextType.INVALIDATION_CONTEXT;
    readonly pieces: readonly PieceItem[];
}

export interface GodHandContext {
    readonly type: ScreenDrawingContextType.GOD_HAND_CONTEXT;
    readonly newSwordIndex: number;
}

export interface GameEndContext {
    readonly type: ScreenDrawingContextType.GAME_END_CONTEXT;
}

export interface SwordInfoContext {
    readonly type: ScreenDrawingContextType.SWORD_INFO_CONTEXT;
    readonly sword: Sword;
}

export interface AskingSwordItemBreakContext {
    readonly type: ScreenDrawingContextType.ASKING_SWORD_ITEM_BREAK_CONTEXT;
    readonly sword: Sword;
    readonly breakFunc: (popup: Popup) => void;
}

export interface SwordItemBreakedContext {
    readonly type: ScreenDrawingContextType.SWORD_ITEM_BREAKED_CONTEXT;
    readonly pieces: readonly PieceItem[];
}

export interface AskingSwordItemSellContext {
    readonly type: ScreenDrawingContextType.ASKING_SWORD_ITEM_SELL_CONTEXT;
    readonly sword: Sword;
    readonly sellFunc: (popup: Popup) => void;
}

export interface WherePieceDroppedContext {
    readonly type: ScreenDrawingContextType.WHERE_PIECE_DROPPED_CONTEXT;
    readonly pieceItem: PieceItem;
    readonly swords: readonly SwordInfoByPiece[];
    readonly founds: ReadonlySet<number>;
}

export interface SwordCraftingContext {
    readonly type: ScreenDrawingContextType.SWORD_CRAFTING_CONTEXT;
}

export interface MaxStatContext {
    readonly type: ScreenDrawingContextType.MAX_STAT_CONTEXT;
}

export interface StatPointLackContext {
    readonly type: ScreenDrawingContextType.STAT_POINT_LACK_CONTEXT;
}

export interface GameAllStatContext {
    readonly type: ScreenDrawingContextType.GAME_ALL_STAT_CONTEXT;
}
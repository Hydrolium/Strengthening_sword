import { PieceItem, Recipe, StatInfo, StorageInfo, Sword, SwordItem } from "../../other/entity";
import { InventoryUpdateContextType } from "../updating/inventory_update_context";

export enum ScreenRenderingContextType {

    MAIN_SCREEN_RENDERING_CONTEXT = "MAIN_SCREEN_RENDERING_CONTEXT",
    MAKING_SCREEN_RENDERING_CONTEXT = "MAKING_SCREEN_RENDERING_CONTEXT",
    INVENTORY_SCREEN_RENDERING_CONTEXT = "INVENTORY_SCREEN_RENDERING_CONTEXT",
    INFORMATION_SCREEN_RENDERING_CONTEXT = "INFORMATION_SCREEN_RENDERING_CONTEXT",
    STAT_SCREEN_RENDERING_CONTEXT = "STAT_SCREEN_RENDERING_CONTEXT",

    RECORD_STORAGE_RENDERING_CONTEXT = "RECORD_STORAGE_RENDERING_CONTEXT",
    MONEY_DISPLAY_RENDERING_CONTEXT = "MONEY_DISPLAY_RENDERING_CONTEXT"
}

export type ScreenRenderingContext = MainScreenRenderingContext | MakingScreenRenderingContext | InventoryScreenRenderingContext | InformationScreenRenderingContext | StatScreenRenderingContext | RecordStorageRenderingContext0 | RecordStorageRenderingContext1 | RecordStorageRenderingContext2 | RecordStorageRenderingContext3 | RecordStorageRenderingContext4 | MoneyDisplayRenderingContext;

export interface MainScreenRenderingContext {
    readonly type: ScreenRenderingContextType.MAIN_SCREEN_RENDERING_CONTEXT;

    readonly sword: Sword;
    readonly isMax: boolean;
}

export interface MakingScreenRenderingContext {
    readonly type: ScreenRenderingContextType.MAKING_SCREEN_RENDERING_CONTEXT;

    readonly foundSwordIds: ReadonlySet<string>;
    readonly money: number;
    readonly repairPaperCount: number;
    readonly havingPieces: StorageInfo<PieceItem>;
    readonly havingSwords: StorageInfo<SwordItem>;
    readonly repairPaperRecipes: readonly Recipe[];
    readonly swordRecipes: readonly Recipe[];
}

export interface InventoryScreenRenderingContext {
    readonly type: ScreenRenderingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT;
    
    readonly swordStorage: StorageInfo<SwordItem>;
    readonly pieceStorage: StorageInfo<PieceItem>;
    readonly repairPapers: number;
}

export interface InformationScreenRenderingContext {
    
    readonly type: ScreenRenderingContextType.INFORMATION_SCREEN_RENDERING_CONTEXT;

    readonly swords: readonly Sword[];
    readonly founds: ReadonlySet<number>;
}

export interface StatScreenRenderingContext {
    readonly type: ScreenRenderingContextType.STAT_SCREEN_RENDERING_CONTEXT;

    readonly statPoint: number;
    readonly stats: readonly StatInfo[];

}

export enum MoneyChangeReason {
    SYSTEM_MONEY_GIFT = InventoryUpdateContextType.SYSTEM_MONEY_GIFT,
    SWORD_UPGRADE = InventoryUpdateContextType.SWORD_UPGRADE,
    SWORD_SELL = InventoryUpdateContextType.SWORD_SELL,
    SWORD_RESTORE = InventoryUpdateContextType.SWORD_RESTORE,
    BUY_USING_MONEY = InventoryUpdateContextType.BUY_USING_MONEY
}

export interface RecordStorageRenderingContext0 {
    readonly type: ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT;

    readonly reason: MoneyChangeReason.SYSTEM_MONEY_GIFT;
    readonly money: number;
}

export interface RecordStorageRenderingContext1 {
    readonly type: ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT;

    readonly reason: MoneyChangeReason.SWORD_UPGRADE;
    readonly name: string;
    readonly cost: number;
}

export interface RecordStorageRenderingContext2 {
    readonly type: ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT;

    readonly reason: MoneyChangeReason.SWORD_SELL;
    readonly name: string;
    readonly price: number;
}

export interface RecordStorageRenderingContext3 {
    readonly type: ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT;

    readonly reason: MoneyChangeReason.SWORD_RESTORE;
    readonly name: string;
    readonly cost: number;
}

export interface RecordStorageRenderingContext4 {
    readonly type: ScreenRenderingContextType.RECORD_STORAGE_RENDERING_CONTEXT;

    readonly reason: MoneyChangeReason.BUY_USING_MONEY;
    readonly resultName: string;
    readonly count: number;
    readonly price: number;
}

export interface MoneyDisplayRenderingContext {
    readonly type: ScreenRenderingContextType.MONEY_DISPLAY_RENDERING_CONTEXT;

    readonly havingMoney: number;
    readonly deltaMoney: number;
}
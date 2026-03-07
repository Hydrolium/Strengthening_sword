import { PieceItem, Recipe, StatInfo, StorageInfo, Sword, SwordItem } from "./entity";

export type GameContext = MoneyChangeContext | SystemMoneyGiftContext | SwordContext | FoundSwordsContext | InventoryContext | SWordUpgradeContext | SWordSellContext | SWordRestoreContext | BuyUsingMoneyContext | StatContext | MakingContext;

export enum ContextType {
    MONEY_CHANGE = "MONEY_CHANGE",
    SYSTEM_MONEY_GIFT = "SYSTEM_MONEY_GIFT",
    SWORD = "SWORD",
    FOUND_SWORDS = "FOUND_SWORDS",
    INVENTORY = "INVENTORY",

    SWORD_UPGRADE = "SWORD_UPGRADE",
    SWORD_SELL = "SWORD_SELL",
    SWORD_RESTORE = "SWORD_RESTORE",
    BUY_USING_MONEY = "BYE_USING_MONEY",

    STAT = "STAT",

    MAKING = "MAKING"
}

export interface MoneyChangeContext {

    readonly type: ContextType.MONEY_CHANGE;

    readonly changedMoney: number;
    readonly havingMoney: number
}

export interface SystemMoneyGiftContext {

    readonly type: ContextType.SYSTEM_MONEY_GIFT,
    readonly money: number;
}

export interface SwordContext {

    readonly type: ContextType.SWORD;

    readonly index: number;
    readonly sword: Sword;
    readonly isMax: boolean;
}

export interface FoundSwordsContext {

    readonly type: ContextType.FOUND_SWORDS;

    readonly swords: readonly Sword[];
    readonly founds: ReadonlySet<number>;
}

export interface InventoryContext {

    readonly type: ContextType.INVENTORY;

    readonly swordStorage: StorageInfo<SwordItem>;
    readonly pieceStorage: StorageInfo<PieceItem>;
    readonly repairPapers: number;
}

export interface SWordUpgradeContext {
    readonly type: ContextType.SWORD_UPGRADE,

    readonly name: string,
    readonly cost: number
}

export interface SWordSellContext {
    readonly type: ContextType.SWORD_SELL,

    readonly name: string,
    readonly price: number
}

export interface SWordRestoreContext {
    readonly type: ContextType.SWORD_RESTORE,

    readonly name: string,
    readonly cost: number
}

export interface BuyUsingMoneyContext {
    readonly type: ContextType.BUY_USING_MONEY,

    readonly resultName: string,
    readonly count: number,
    readonly price: number
}

export interface StatContext {
    readonly type: ContextType.STAT,

    readonly statPoint: number,
    readonly stats: readonly StatInfo[]
}

export interface MakingContext {
    readonly type: ContextType.MAKING,

    readonly havingPieces: StorageInfo<PieceItem>
    readonly havingSwords: StorageInfo<SwordItem>,
    readonly repairPaperRecipes: readonly Recipe[],
    readonly  swordRecipes: readonly Recipe[]
}
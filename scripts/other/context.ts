import { PieceItem, RecipeInfo, StatInfo, StorageInfo, Sword, SwordItem } from "./entity";

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

    type: ContextType.MONEY_CHANGE;

    changedMoney: number;
    havingMoney: number
}

export interface SystemMoneyGiftContext {

    type: ContextType.SYSTEM_MONEY_GIFT,
    money: number;
}

export interface SwordContext {

    type: ContextType.SWORD;

    index: number;
    sword: Sword;
    isMax: boolean;
}

export interface FoundSwordsContext {

    type: ContextType.FOUND_SWORDS;

    swords: readonly Sword[];
    founds: ReadonlySet<number>;
}

export interface InventoryContext {

    type: ContextType.INVENTORY;

    swordStorage: StorageInfo<SwordItem>;
    pieceStorage: StorageInfo<PieceItem>;
    repairPapers: number;
}

export interface SWordUpgradeContext {
    type: ContextType.SWORD_UPGRADE,

    name: string,
    cost: number
}

export interface SWordSellContext {
    type: ContextType.SWORD_SELL,

    name: string,
    price: number
}

export interface SWordRestoreContext {
    type: ContextType.SWORD_RESTORE,

    name: string,
    cost: number
}

export interface BuyUsingMoneyContext {
    type: ContextType.BUY_USING_MONEY,

    resultName: string,
    count: number,
    price: number
}

export interface StatContext {
    type: ContextType.STAT,

    statPoint: number,
    stats: readonly StatInfo[]
}

export interface MakingContext {
    type: ContextType.MAKING,

    havingPieces: StorageInfo<PieceItem>
    havingSwords: StorageInfo<SwordItem>,
    repairPaperRecipes: readonly RecipeInfo[],
    swordRecipes: readonly RecipeInfo[]
}
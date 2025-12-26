import { Item, PieceItem, Storage, Sword, SwordItem } from "./entity";

export type GameContext = MoneyChangeContext | SystemMoneyGiftContext | SwordContext | FoundSwordsContext | InventoryContext | SWordUpgradeContext | SWordSellContext | SWordRestoreContext | ByeUsingMoneyContext;

export enum ContextType {
    MONEY_CHANGE = "MONEY_CHANGE",
    SYSTEM_MONEY_GIFT = "SYSTEM_MONEY_GIFT",
    SWORD = "SWORD",
    FOUND_SWORDS = "FOUND_SWORDS",
    INVENTORY = "INVENTORY",

    SWORD_UPGRADE = "SWORD_UPGRADE",
    SWORD_SELL = "SWORD_SELL",
    SWORD_RESTORE = "SWORD_RESTORE",
    BYE_USING_MONEY = "BYE_USING_MONEY"
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

    count: number,
    swords: Item[]
}

export interface InventoryContext {

    type: ContextType.INVENTORY;

    swords: Storage<SwordItem>;
    pieces: Storage<PieceItem>;
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

export interface ByeUsingMoneyContext {
    type: ContextType.BYE_USING_MONEY,

    result_name: string,
    count: number,
    price: number
}
import { PieceItem, RepairPaperItem, Sword, SwordItem } from "../../other/entity";

export enum InventoryUpdateContextType {
    SYSTEM_MONEY_GIFT = "SYSTEM_MONEY_GIFT",
    SWORD_UPGRADE = "SWORD_UPGRADE",
    SWORD_SELL = "SWORD_SELL",
    SWORD_BREAK = "SWORD_BREAK",
    SWORD_RESTORE = "SWORD_RESTORE",
    ITEM_SAVE = "ITEM_SAVE",
    ITEM_TAKE = "ITEM_TAKE",
    SWORD_ITEM_SELL = "SWORD_ITEM_SELL",
    SWORD_ITEM_BREAK = "SWORD_ITEM_BREAK",
    SWORD_ITEM_SWAP = "SWORD_ITEM_SWAP",
    BUY_USING_MONEY = "BUY_USING_MONEY"
}

export type InventoryUpdateContext = SwordUpgradeContext | SwordSellContext | SwordBreakContext | SwordRestoreContext | ItemSaveContext | ItemTakeContext | BuyUsingMoneyContext | SwordItemSellContext | SwordItemBreakContext | SwordItemSwapContext | SystemMoneyGiftContext;

export interface SwordUpgradeContext {
    readonly type: InventoryUpdateContextType.SWORD_UPGRADE,

    readonly name: string,
    readonly cost: number
}

export interface SwordSellContext {
    readonly type: InventoryUpdateContextType.SWORD_SELL,

    readonly name: string,
    readonly price: number
}

export interface SwordBreakContext {
    readonly type: InventoryUpdateContextType.SWORD_BREAK,

    readonly name: string,
    readonly cost: number,
    readonly pieces: readonly PieceItem[]
}

export interface SwordRestoreContext {
    readonly type: InventoryUpdateContextType.SWORD_RESTORE,

    readonly name: string,
    readonly cost: number
}

export interface ItemSaveContext {

    readonly type: InventoryUpdateContextType.ITEM_SAVE;
    item: SwordItem | PieceItem | RepairPaperItem;
}

export interface ItemTakeContext {

    readonly type: InventoryUpdateContextType.ITEM_TAKE;
    item: SwordItem | PieceItem | RepairPaperItem;
}

export interface BuyUsingMoneyContext {
    readonly type: InventoryUpdateContextType.BUY_USING_MONEY,

    readonly resultName: string,
    readonly count: number,
    readonly price: number
}

export interface SwordItemSellContext {
    readonly type: InventoryUpdateContextType.SWORD_ITEM_SELL,

    readonly id: string,
    readonly name: string,
    readonly price: number 
}

export interface SwordItemBreakContext {
    readonly type: InventoryUpdateContextType.SWORD_ITEM_BREAK,

    readonly swordItem: SwordItem,
    readonly pieceItems: readonly PieceItem[]
}

export interface SwordItemSwapContext {
    readonly type: InventoryUpdateContextType.SWORD_ITEM_SWAP,

    readonly swordItem: SwordItem,
    readonly sword: Sword
}

export interface SystemMoneyGiftContext {

    readonly type: InventoryUpdateContextType.SYSTEM_MONEY_GIFT,
    readonly money: number;
}
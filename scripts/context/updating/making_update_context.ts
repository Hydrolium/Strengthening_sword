import { PieceItem, Recipe, StorageInfo, SwordItem } from "../../other/entity";

export enum MakingUpdateContextType {
    MAKING = "MAKING"
}

export type MakingUpdateContext = MakingContext;

export interface MakingContext {
    readonly type: MakingUpdateContextType.MAKING,

    readonly foundSwordIds: ReadonlySet<string>;
    readonly money: number;
    readonly repairPaperCount: number;
    readonly havingPieces: StorageInfo<PieceItem>;
    readonly havingSwords: StorageInfo<SwordItem>;
    readonly repairPaperRecipes: readonly Recipe[];
    readonly swordRecipes: readonly Recipe[];

}
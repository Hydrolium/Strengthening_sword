import { Sword } from "../../define/object/sword";

export enum SwordUpdateContextType {
    SWORD_CHANGE = "SWORD_CHANGE",
    FINDING_NEW_SWORD_UPDATE = "FINDING_NEW_SWORD_UPDATE"
}

export type SwordUpdateContext = SwordChangeContext | FindingNewSwordContext;

export interface SwordChangeContext {

    readonly type: SwordUpdateContextType.SWORD_CHANGE;

    readonly sword: Sword;
    readonly maxUpgradableIndex: number;
}

export interface FindingNewSwordContext {
    readonly type: SwordUpdateContextType.FINDING_NEW_SWORD_UPDATE;

    readonly index: number;
}
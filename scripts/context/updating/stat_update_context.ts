import { StatID } from "../../manager/stat_manager";

export enum StatUpdateContextType {
    GETTING_STAT_POINT = "GETTING_STAT_POINT",
    STAT_UPGRADE = "STAT_UPGRADE"
}

export type StatUpdateContext = GettingStatPointContext | StatUpgradeContext;

export interface GettingStatPointContext {
    readonly type: StatUpdateContextType.GETTING_STAT_POINT;
}

export interface StatUpgradeContext {
    readonly type: StatUpdateContextType.STAT_UPGRADE;

    readonly id: StatID;
}
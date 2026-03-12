import { InventoryManager } from "./inventory_manager";
import { MakingManager } from "./making_manager";
import { ScreenManager } from "./screen_manager";
import { StatManager } from "./stat_manager";
import { SwordManager } from "./sword_manager";

export interface Managers {
    readonly swordManager: SwordManager;
    readonly inventoryManager: InventoryManager;
    readonly makingManager: MakingManager;
    readonly statManager: StatManager;
    readonly screenManager: ScreenManager;
}
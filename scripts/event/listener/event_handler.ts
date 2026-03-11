import { InventoryManager } from "../../manager/inventory_manager";
import { MakingManager } from "../../manager/making_manager";
import { ScreenManager } from "../../manager/screen_manager";
import { StatManager } from "../../manager/stat_manager";
import { SwordManager } from "../../manager/sword_manager";
import { SwordDB } from "../../db/sword_db";
import { DeveloperMode } from "../../screen/developer_mode";
import { InformationScreen } from "../../screen/screen/information_screen";
import { InventoryScreen } from "../../screen/screen/inventory_screen";
import { MainScreen } from "../../screen/screen/main_screen";
import { MakingScreen } from "../../screen/screen/making_screen";
import { StatScreen } from "../../screen/screen/stat_screen";
import { InformationScreenEventController } from "../information_screen_event_controller";
import { InventoryScreenEventController } from "../inventory_screen_event_controller";
import { MainScreenEventController } from "../main_screen_event_controller";
import { MakingScreenEventController } from "../making_screen_event_controller";
import { StatScreenEventController } from "../stat_screen_event_controller";

export class EventHandler {

    private readonly _mainScreenEventController: MainScreenEventController;
    private readonly _informationScreenEventController: InformationScreenEventController;
    private readonly _inventoryScreenEventController: InventoryScreenEventController;
    private readonly _makingScreenEventController: MakingScreenEventController;
    private readonly _statScreenEventController: StatScreenEventController;

    constructor(
        _swordDB: SwordDB,
        _swordManager: SwordManager,
        _inventoryManager: InventoryManager,
        _makingManager: MakingManager,
        _statManager: StatManager,
        _screenManager: ScreenManager,
        _mainScreen: MainScreen,
        _informationScreen: InformationScreen,
        _inventoryScreen: InventoryScreen,
        _makingScreen: MakingScreen,
        _statScreen: StatScreen,
        _developerMode: DeveloperMode
    ) {
        this._mainScreenEventController = new MainScreenEventController(_swordDB, _swordManager, _inventoryManager, _statManager, _screenManager, _mainScreen, _developerMode);
        this._informationScreenEventController = new InformationScreenEventController(_swordDB, _swordManager, _statManager, _screenManager, _informationScreen);
        this._inventoryScreenEventController = new InventoryScreenEventController(_swordDB, _swordManager, _inventoryManager, _statManager, _screenManager, _mainScreen, _inventoryScreen);
        this._makingScreenEventController = new MakingScreenEventController(_swordDB, _swordManager, _inventoryManager, _makingManager, _statManager, _screenManager, _makingScreen);
        this._statScreenEventController = new StatScreenEventController(_statManager, _screenManager, _statScreen);

        _mainScreen.setActions(this._mainScreenEventController);
        _informationScreen.setActions(this._informationScreenEventController);
        _inventoryScreen.setActions(this._inventoryScreenEventController);
        _makingScreen.setActions(this._makingScreenEventController);
        _statScreen.setActions(this._statScreenEventController);
    }

}
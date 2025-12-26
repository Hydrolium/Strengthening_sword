import { DataManager } from "../manager/data_manager.js";
import { InventoryManager } from "../manager/inventory_manager.js";
import { MakingManager } from "../manager/making_manager.js";
import { StatManager } from "../manager/stat_manager.js";
import { SwordManager } from "../manager/sword_manager.js";
import { DeveloperMod } from "../screen/developer_mod.js";
import { InformationScreen } from "../screen/information_screen.js";
import { InventoryScreen } from "../screen/inventory_screen.js";
import { MainScreen } from "../screen/main_screen.js";
import { MakingScreen } from "../screen/making_screen.js";
import { MoneyDisplay } from "../screen/money_display.js";
import { RecordStorage } from "../screen/record_storage.js";
import { StatScreen } from "../screen/stat_screen.js";
import { ContextType } from "./context.js";
import { $, createImageWithSrc, hide } from "./element_controller.js";

export class Game {

    static startMoney = 500000

    static dataManager: DataManager;
    static swordManager: SwordManager;
    static inventoryManager: InventoryManager;
    static makingManager: MakingManager;
    static statManager: StatManager;

    static mainScreen: MainScreen;
    static informationScreen: InformationScreen;
    static inventoryScreen: InventoryScreen;
    static makingScreen: MakingScreen;
    static statScreen: StatScreen;

    static moneyDisplay: MoneyDisplay;
    static recordStorage: RecordStorage;

    static developerMod: DeveloperMod;

    static currentScreenId: string;

    static init(start=0) {
        hide($("#popup-message-box"));
        Game.mainScreen.show();
        Game.swordManager?.jumpTo(start);
    }
}

async function loadAllImg(srcs: string[]): Promise<void> {

    const promises = srcs.map(src => {
        return new Promise<void>((resolve) => {

            const created_img = createImageWithSrc(src);

            created_img.onload = () => resolve();
            created_img.onerror = () => {
                console.warn(`load fail: ${src}`);
                resolve();
            };

            $("#img-loadder")?.appendChild(created_img);
        });
    });

    await Promise.all(promises);

}

async function gameStart() {

    Game.dataManager = new DataManager();
    
    const data = await Game.dataManager.loadAllData();

    if(data == null) return;

    if(data.path != undefined) {
        await loadAllImg(Object.values(data.path));
    }

    Game.swordManager = new SwordManager(data.sword);
    Game.inventoryManager = new InventoryManager();
    Game.makingManager = new MakingManager(data.recipe);
    Game.statManager = new StatManager(data.stat);

    Game.mainScreen = new MainScreen();
    Game.informationScreen = new InformationScreen();
    Game.inventoryScreen = new InventoryScreen();
    Game.makingScreen = new MakingScreen();
    Game.statScreen = new StatScreen();

    Game.moneyDisplay = new MoneyDisplay();
    Game.recordStorage = new RecordStorage();

    Game.developerMod = new DeveloperMod();

    Game.swordManager.subscribe(Game.mainScreen);
    Game.swordManager.subscribe(Game.moneyDisplay);
    Game.swordManager.subscribe(Game.recordStorage);

    Game.inventoryManager.subscribe(Game.makingScreen);
    Game.inventoryManager.subscribe(Game.inventoryScreen);
    Game.inventoryManager.subscribe(Game.moneyDisplay);
    Game.inventoryManager.subscribe(Game.recordStorage);

    Game.makingManager.subscribe(Game.makingScreen);
    Game.makingManager.subscribe(Game.moneyDisplay);
    Game.makingManager.subscribe(Game.recordStorage);

    Game.statManager.subscribe(Game.statScreen);

    Game.inventoryManager.saveMoney(Game.startMoney, {
        type: ContextType.SYSTEM_MONEY_GIFT,
        money: Game.startMoney
    });

    Game.init();
}

gameStart();
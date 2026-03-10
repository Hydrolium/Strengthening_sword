import { DataManager } from "../manager/data_manager.js";
import { InventoryManager } from "../manager/inventory_manager.js";
import { MakingManager } from "../manager/making_manager.js";
import {  StatManager } from "../manager/stat_manager.js";
import { SwordManager } from "../manager/sword_manager.js";
import { DeveloperMode } from "../screen/developer_mode.js";
import { InformationScreen } from "../screen/information_screen.js";
import { InventoryScreen } from "../screen/inventory_screen.js";
import { MainScreen } from "../screen/main_screen.js";
import { MakingScreen } from "../screen/making_screen.js";
import { MoneyDisplay } from "../screen/money_display.js";
import { RecordStorage } from "../screen/record_storage.js";
import { StatScreen } from "../screen/stat_screen.js";
import { $, createImageWithSrc } from "./element_controller.js";
import { InventoryUpdateContextType } from "../context/updating/inventory_update_context.js";
import { SwordDB } from "../db/sword_db.js";
import { ScreenManager } from "../manager/screen_manager.js";
import { ScreenShowingContextType } from "../context/rendering/screen_showing_context.js";
import { ScreenRenderingContextType } from "../context/rendering/screen_rendering_context.js";
import { EventHandler } from "../event/listener/event_handler.js";
import { SwordUpdateContextType } from "../context/updating/sword_update_context.js";
import { StatUpdateContextType } from "../context/updating/stat_update_context.js";
import { CalculatedSwordDB } from "../db/calculated_sword_db.js";



async function loadAllImg(srcs: readonly string[]): Promise<void> {

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

    const dataManager = new DataManager();
    
    const data = await dataManager.loadAllData();

    if(data == null) return;

    if(data.path != undefined) {
        await loadAllImg(Object.values(data.path));
    }

    const swordDB = new SwordDB(data.sword);

    const swordManager = new SwordManager();
    const inventoryManager = new InventoryManager();
    const makingManager = new MakingManager(data.recipe);
    const statManager = new StatManager(data.stat);
    const screenManager = new ScreenManager();

    const mainScreen = new MainScreen();
    const informationScreen = new InformationScreen();
    const inventoryScreen = new InventoryScreen();
    const makingScreen = new MakingScreen();
    const statScreen = new StatScreen();

    const moneyDisplay = new MoneyDisplay();
    const recordStorage = new RecordStorage();

    const developerMode = new DeveloperMode();

    const eventHandler = new EventHandler(
        swordDB,
        swordManager,
        inventoryManager,
        makingManager,
        statManager,
        screenManager
        ,mainScreen,
        informationScreen,
        inventoryScreen,
        makingScreen,
        statScreen,
        developerMode
    )

    swordManager.subscribe(mainScreen, moneyDisplay, recordStorage);

    inventoryManager.subscribe(makingScreen, inventoryScreen, moneyDisplay, recordStorage);

    makingManager.subscribe(makingScreen, moneyDisplay, recordStorage);

    statManager.subscribe(statScreen);

    screenManager.subscribe(mainScreen, informationScreen, inventoryScreen, makingScreen, statScreen);

    const calculatedSwordDB = new CalculatedSwordDB(swordDB, swordManager, statManager);

    $("#main-game-button").addEventListener("click",
        () => screenManager.update({
            type: ScreenShowingContextType.MAIN_SCREEN_SHOWING_CONTEXT,
            renderingContext: {
                type: ScreenRenderingContextType.MAIN_SCREEN_RENDERING_CONTEXT,
                isMax: swordManager.currentSwordIndex >= swordDB.maxUpgradableIndex,
                sword: calculatedSwordDB.getCalculatedSwordbyIndex(swordManager.currentSwordIndex)
            }
        })
    );
    $("#information-button").addEventListener("click",
        () => screenManager.update({
            type: ScreenShowingContextType.INFORMATION_SCREEN_SHOWING_CONTEXT,
            renderingContext: {
                type: ScreenRenderingContextType.INFORMATION_SCREEN_RENDERING_CONTEXT,
                swords: swordDB.swords.map(sword => sword.toItem()),
                founds: swordManager.getFoundSwordIndexes()
            }
        })
    );
    $("#inventory-button").addEventListener("click",
        () => screenManager.update({
            type: ScreenShowingContextType.INVENTORY_SCREEN_SHOWING_CONTEXT,
            renderingContext: {
                type: ScreenRenderingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT,
                pieceStorage: inventoryManager.getPieces(),
                repairPapers: inventoryManager.getRepairPaper(),
                swordStorage: inventoryManager.getSwords()
            }
        })
    );
    $("#making-button").addEventListener("click",
        () => screenManager.update({
            type: ScreenShowingContextType.MAKING_SCREEN_SHOWING_CONTEXT,
            renderingContext: {
                type: ScreenRenderingContextType.MAKING_SCREEN_RENDERING_CONTEXT,
                foundSwordIds: new Set(Array.from(swordManager.getFoundSwordIndexes(), index => swordDB.getSwordByIndex(index).id)),
                havingPieces: inventoryManager.getPieces(),
                havingSwords: inventoryManager.getSwords(),
                money: inventoryManager.getMoney(),
                repairPaperCount: inventoryManager.getRepairPaper(),
                repairPaperRecipes: makingManager.repairPaperRecipes,
                swordRecipes: makingManager.swordRecipes
            }
        })
    );
    $("#stat-button").addEventListener("click",
        () => screenManager.update({
            type: ScreenShowingContextType.STAT_SCREEN_SHOWING_CONTEXT,
            renderingContext: {
                type: ScreenRenderingContextType.STAT_SCREEN_RENDERING_CONTEXT,
                statPoint: statManager.statPoint,
                stats: statManager.stats
            }
        })
    );

    inventoryManager.update({
        type: InventoryUpdateContextType.SYSTEM_MONEY_GIFT,
        money: 500000
    });

    swordManager.update({
        type: SwordUpdateContextType.SWORD_CHANGE,
        maxUpgradableIndex: swordDB.maxUpgradableIndex,
        sword: swordDB.getSwordByIndex(0)
    });
    swordManager.update({
        type: SwordUpdateContextType.FINDING_NEW_SWORD_UPDATE,
        index: 0
    });
    statManager.update({
        type: StatUpdateContextType.GETTING_STAT_POINT
    });
    screenManager.update({
        type: ScreenShowingContextType.MAIN_SCREEN_SHOWING_CONTEXT,
        renderingContext: {
            type: ScreenRenderingContextType.MAIN_SCREEN_RENDERING_CONTEXT,
            isMax: swordManager.currentSwordIndex >= swordDB.maxUpgradableIndex,
            sword: swordDB.getSwordByIndex(swordManager.currentSwordIndex)
        }
    });
}

gameStart();
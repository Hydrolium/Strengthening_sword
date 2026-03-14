import { DataReader } from "../define/data_reader.js";
import { InventoryManager } from "../manager/inventory_manager.js";
import { MakingManager } from "../manager/making_manager.js";
import {  StatManager } from "../manager/stat_manager.js";
import { SwordManager } from "../manager/sword_manager.js";
import { DeveloperMode } from "../define/developer_mode.js";
import { InformationScreen } from "../screen/screen/information_screen.js";
import { InventoryScreen } from "../screen/screen/inventory_screen.js";
import { MainScreen } from "../screen/screen/main_screen.js";
import { MakingScreen } from "../screen/screen/making_screen.js";
import { MoneyDisplay } from "../screen/display/money_display.js";
import { RecordDisplay } from "../screen/display/record_display.js";
import { StatScreen } from "../screen/screen/stat_screen.js";
import { $, createImageWithSrc } from "../element/element_controller.js";
import { InventoryUpdateContextType } from "../context/updating/inventory_update_context.js";
import { ScreenManager } from "../manager/screen_manager.js";
import { ScreenShowingContextType } from "../context/rendering/screen_showing_context.js";
import { popupDrawingTypes, ScreenDrawingContextType } from "../context/rendering/screen_drawing_context.js";
import { SwordUpdateContextType } from "../context/updating/sword_update_context.js";
import { StatUpdateContextType } from "../context/updating/stat_update_context.js";
import { CalculatedSwordDB } from "../define/db/calculated_sword_db.js";
import { PopupDisplay } from "../screen/display/popup_display.js";
import { MainScreenEventController } from "../event_controller/main_screen_event_controller.js";
import { InformationScreenEventController } from "../event_controller/information_screen_event_controller.js";
import { InventoryScreenEventController } from "../event_controller/inventory_screen_event_controller.js";
import { MakingScreenEventController } from "../event_controller/making_screen_event_controller.js";
import { StatScreenEventController } from "../event_controller/stat_screen_event_controller.js";
import { Managers } from "../manager/manager.js";
import { Screens } from "../screen/screen/screen.js";
import { Displays } from "../screen/display/display.js";

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

    const dataManager = new DataReader();
    
    const data = await dataManager.loadAllData();

    if(data == null) return;

    if(data.path != undefined) {
        await loadAllImg(Object.values(data.path));
    }

    const developerMode = new DeveloperMode();

    const managers: Managers = {
        swordManager: new SwordManager(),
        inventoryManager: new InventoryManager(developerMode),
        makingManager: new MakingManager(data.recipe),
        statManager: new StatManager(data.stat),
        screenManager: new ScreenManager()
    };

    const screens: Screens = {
        mainScreen: new MainScreen(),
        informationScreen: new InformationScreen(),
        inventoryScreen: new InventoryScreen(),
        makingScreen: new MakingScreen(),
        statScreen: new StatScreen()
    }

    const displays: Displays = {
        moneyDisplay: new MoneyDisplay(),
        recordDisplay: new RecordDisplay(),
        popupDisplay: new PopupDisplay()
    }

    const swordDB = new CalculatedSwordDB(data.sword, managers.statManager, developerMode);

    managers.swordManager.subscribeDrawing(ScreenDrawingContextType.MAIN_SCREEN_RENDERING_CONTEXT, screens.mainScreen);

    managers.inventoryManager.subscribeDrawing(ScreenDrawingContextType.MONEY_DISPLAY_RENDERING_CONTEXT, displays.moneyDisplay);
    managers.inventoryManager.subscribeDrawing(ScreenDrawingContextType.RECORD_DISPLAY_RENDERING_CONTEXT, displays.recordDisplay);
    managers.inventoryManager.subscribeDrawing(ScreenDrawingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT, screens.inventoryScreen);

    managers.makingManager.subscribeDrawing(ScreenDrawingContextType.MAKING_SCREEN_RENDERING_CONTEXT, screens.makingScreen);

    managers.statManager.subscribeDrawing(ScreenDrawingContextType.STAT_SCREEN_RENDERING_CONTEXT, screens.statScreen);

    managers.screenManager.subscribeShowing(ScreenShowingContextType.MAIN_SCREEN_SHOWING_CONTEXT, screens.mainScreen);
    managers.screenManager.subscribeShowing(ScreenShowingContextType.INFORMATION_SCREEN_SHOWING_CONTEXT, screens.informationScreen);
    managers.screenManager.subscribeShowing(ScreenShowingContextType.INVENTORY_SCREEN_SHOWING_CONTEXT, screens.inventoryScreen);
    managers.screenManager.subscribeShowing(ScreenShowingContextType.MAKING_SCREEN_SHOWING_CONTEXT, screens.makingScreen);
    managers.screenManager.subscribeShowing(ScreenShowingContextType.STAT_SCREEN_SHOWING_CONTEXT, screens.statScreen);

    managers.screenManager.subscribeDrawing(ScreenDrawingContextType.MAKING_SCREEN_RENDERING_CONTEXT, screens.makingScreen);
    managers.screenManager.subscribeDrawing(ScreenDrawingContextType.MAKING_SCREEN_ANIMATING_CONTEXT, screens.makingScreen);

    for(const type of popupDrawingTypes) {
        managers.screenManager.subscribeDrawing(type, displays.popupDisplay);
    }

    screens.mainScreen.setActions(new MainScreenEventController(swordDB, managers));
    screens.informationScreen.setActions(new InformationScreenEventController(swordDB, managers));
    screens.inventoryScreen.setActions(new InventoryScreenEventController(swordDB, managers));
    screens.makingScreen.setActions(new MakingScreenEventController(swordDB, managers));
    screens.statScreen.setActions(new StatScreenEventController(managers));

    $("#main-game-button").addEventListener("click",
        () => managers.screenManager.update({
            type: ScreenShowingContextType.MAIN_SCREEN_SHOWING_CONTEXT,
            renderingContext: {
                type: ScreenDrawingContextType.MAIN_SCREEN_RENDERING_CONTEXT,
                isMax: managers.swordManager.currentSwordIndex >= swordDB.maxUpgradableIndex,
                sword: swordDB.getCalculatedSwordbyIndex(managers.swordManager.currentSwordIndex)
            }
        })
    );
    $("#information-button").addEventListener("click",
        () => managers.screenManager.update({
            type: ScreenShowingContextType.INFORMATION_SCREEN_SHOWING_CONTEXT,
            renderingContext: {
                type: ScreenDrawingContextType.INFORMATION_SCREEN_RENDERING_CONTEXT,
                swords: swordDB.swords.map(sword => sword.toItem()),
                founds: managers.swordManager.getFoundSwordIndexes()
            }
        })
    );
    $("#inventory-button").addEventListener("click",
        () => managers.screenManager.update({
            type: ScreenShowingContextType.INVENTORY_SCREEN_SHOWING_CONTEXT,
            renderingContext: {
                type: ScreenDrawingContextType.INVENTORY_SCREEN_RENDERING_CONTEXT,
                pieceStorage: managers.inventoryManager.getPieces(),
                repairPapers: managers.inventoryManager.getRepairPaper(),
                swordStorage: managers.inventoryManager.getSwords()
            }
        })
    );
    $("#making-button").addEventListener("click",
        () => managers.screenManager.update({
            type: ScreenShowingContextType.MAKING_SCREEN_SHOWING_CONTEXT,
            renderingContext: {
                type: ScreenDrawingContextType.MAKING_SCREEN_RENDERING_CONTEXT,
                foundSwordIds: new Set(Array.from(managers.swordManager.getFoundSwordIndexes(), index => swordDB.getIdByIndex(index))),
                havingPieces: managers.inventoryManager.getPieces(),
                havingSwords: managers.inventoryManager.getSwords(),
                money: managers.inventoryManager.getMoney(),
                repairPaperCount: managers.inventoryManager.getRepairPaper(),
                repairPaperRecipes: managers.makingManager.repairPaperRecipes,
                swordRecipes: managers.makingManager.swordRecipes
            }
        })
    );
    $("#stat-button").addEventListener("click",
        () => managers.screenManager.update({
            type: ScreenShowingContextType.STAT_SCREEN_SHOWING_CONTEXT,
            renderingContext: {
                type: ScreenDrawingContextType.STAT_SCREEN_RENDERING_CONTEXT,
                statPoint: managers.statManager.statPoint,
                stats: managers.statManager.stats
            }
        })
    );

    managers.inventoryManager.update({
        type: InventoryUpdateContextType.SYSTEM_MONEY_GIFT,
        money: 500000
    });

    managers.swordManager.update({
        type: SwordUpdateContextType.SWORD_CHANGE,
        maxUpgradableIndex: swordDB.maxUpgradableIndex,
        sword: swordDB.getCalculatedSwordbyIndex(0)
    });
    managers.swordManager.update({
        type: SwordUpdateContextType.FINDING_NEW_SWORD_UPDATE,
        index: 0
    });
    managers.statManager.update({
        type: StatUpdateContextType.GETTING_STAT_POINT
    });
    managers.screenManager.update({
        type: ScreenShowingContextType.MAIN_SCREEN_SHOWING_CONTEXT,
        renderingContext: {
            type: ScreenDrawingContextType.MAIN_SCREEN_RENDERING_CONTEXT,
            isMax: managers.swordManager.currentSwordIndex >= swordDB.maxUpgradableIndex,
            sword: swordDB.getCalculatedSwordbyIndex(managers.swordManager.currentSwordIndex)
        }
    });
}

gameStart();
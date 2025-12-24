import { Observer, Item, PieceItem, Recipe, MoneyItem, SwordItem, RepairPaperItem } from '../other/entity.js';
import { Game } from '../other/main.js';
import { ContextType, GameContext } from '../other/context.js';

export class MakingManager extends Observer {

    public repair_paper_recipes: Item[] = [new MoneyItem(300)];
    public recipes: Recipe[] = [];

    constructor(recipes?: Recipe[]) {
        super();
        if(recipes) this.recipes = recipes;
    }

    getRenderEvent(): GameContext | undefined {
        return;
    }

    setRepairPaperRecipe(...materials: Item[]) {
        this.repair_paper_recipes = materials;
    }

    setRecipe(result: Item, ...materials: Item[]) {
        this.recipes.push(new Recipe(result, materials));
    }

    copyItems(items: Item[]): Item[] {
        const newArray: Item[] = [];
        for(const item of items) {
            if(item instanceof MoneyItem) {
                newArray.push(new MoneyItem(item.count));
            } else if(item instanceof PieceItem) {
                newArray.push(new PieceItem(item.id, item.count));
            } else if(item instanceof SwordItem) {
                newArray.push(new SwordItem(item.id, item.count));      
            } else if(item instanceof RepairPaperItem) {
                newArray.push(new RepairPaperItem(item.count));
            }
        }
        return newArray;
    }

    getMultipliedItems(items: Item[], amount: number): Item[] {
        const newItems = this.copyItems(items);
        for(const item of newItems) item.count *= amount;
        return newItems;
    }

    makeRepairPaper(amount: number) {
        const required_materials = this.getMultipliedItems(this.repair_paper_recipes, amount);
        if(!Game.inventoryManager.hasItems(required_materials)) return;

        required_materials.forEach(material => {
            if(material instanceof MoneyItem) Game.inventoryManager.takeMoney(material.count, {
                type: ContextType.BYE_USING_MONEY,
                result_name: "복구권",
                count: amount,
                price: material.count
            });
            else Game.inventoryManager.take(material);

        });
        
        Game.inventoryManager.saveRepairPaper(amount);
    }

    makeWithRecipe(recipe: Recipe) {
        if(!Game.inventoryManager.hasItems(recipe.materials)) return;
        Game.swordManager.findSword(Game.swordManager.getIndex(recipe.result.id));

        recipe.materials.forEach(material => {
            if(material instanceof MoneyItem) Game.inventoryManager.takeMoney(material.count, {
                type: ContextType.BYE_USING_MONEY,
                result_name: recipe.result.name,
                count: recipe.result.count,
                price: material.count
            });
            else Game.inventoryManager.take(material);

        });

        Game.inventoryManager.save(recipe.result);
    }
}
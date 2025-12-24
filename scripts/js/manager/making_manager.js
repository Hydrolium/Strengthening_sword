import { Observer, PieceItem, Recipe, MoneyItem, SwordItem, RepairPaperItem, ContextType } from '../other/entity.js';
import { Game } from '../other/main.js';
export class MakingManager extends Observer {
    constructor(recipes) {
        super();
        this.repair_paper_recipes = [new MoneyItem(300)];
        this.recipes = [];
        if (recipes)
            this.recipes = recipes;
    }
    getRenderEvent() {
        return;
    }
    setRepairPaperRecipe(...materials) {
        this.repair_paper_recipes = materials;
    }
    setRecipe(result, ...materials) {
        this.recipes.push(new Recipe(result, materials));
    }
    copyItems(items) {
        const newArray = [];
        for (const item of items) {
            if (item instanceof MoneyItem) {
                newArray.push(new MoneyItem(item.count));
            }
            else if (item instanceof PieceItem) {
                newArray.push(new PieceItem(item.id, item.count));
            }
            else if (item instanceof SwordItem) {
                newArray.push(new SwordItem(item.id, item.count));
            }
            else if (item instanceof RepairPaperItem) {
                newArray.push(new RepairPaperItem(item.count));
            }
        }
        return newArray;
    }
    getMultipliedItems(items, amount) {
        const newItems = this.copyItems(items);
        for (const item of newItems)
            item.count *= amount;
        return newItems;
    }
    makeRepairPaper(amount) {
        const required_materials = this.getMultipliedItems(this.repair_paper_recipes, amount);
        if (!Game.inventoryManager.hasItems(required_materials))
            return;
        required_materials.forEach(material => {
            if (material instanceof MoneyItem)
                Game.inventoryManager.takeMoney(material.count, {
                    type: ContextType.BYE_USING_MONEY,
                    result_name: "복구권",
                    count: amount,
                    price: material.count
                });
            else
                Game.inventoryManager.take(material);
        });
        Game.inventoryManager.saveRepairPaper(amount);
    }
    makeWithRecipe(recipe) {
        if (!Game.inventoryManager.hasItems(recipe.materials))
            return;
        Game.swordManager.findSword(Game.swordManager.getIndex(recipe.result.id));
        recipe.materials.forEach(material => {
            if (material instanceof MoneyItem)
                Game.inventoryManager.takeMoney(material.count, {
                    type: ContextType.BYE_USING_MONEY,
                    result_name: recipe.result.name,
                    count: recipe.result.count,
                    price: material.count
                });
            else
                Game.inventoryManager.take(material);
        });
        Game.inventoryManager.save(recipe.result);
    }
}

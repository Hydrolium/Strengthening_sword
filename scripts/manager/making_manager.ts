import { Observer, Item, PieceItem, Recipe, MoneyItem, SwordItem, RepairPaperItem } from '../other/entity.js';
import { Game } from '../other/main.js';
import { ContextType, GameContext, MakingContext } from '../other/context.js';

export class MakingManager extends Observer {

    public repairPaperRecipes: Recipe[] = [
        new Recipe(new RepairPaperItem(1), [new MoneyItem(300)]),
        new Recipe(new RepairPaperItem(5), [new MoneyItem(1500)]),
        new Recipe(new RepairPaperItem(10), [new MoneyItem(3000)]),
        new Recipe(new RepairPaperItem(15), [new MoneyItem(4500)]),
    ];

    public swordRecipes: Recipe[] = [];

    constructor(swordRecipes?: Recipe[]) {
        super();
        if(swordRecipes) this.swordRecipes = swordRecipes;
    }

    get makingContext(): MakingContext {

        return {
            type: ContextType.MAKING,

            havingSwords: Game.inventoryManager.getSwords(),
            havingPieces: Game.inventoryManager.getPieces(),
            repairPaperRecipes: this.repairPaperRecipes,
            swordRecipes: this.swordRecipes
            
        }
    }

    setSwordRecipe(result: SwordItem, ...materials: Item[]) {
        this.swordRecipes.push(new Recipe(result, materials));
    }

    copyItems(items: Item[]): Item[] {
        const newArray: Item[] = [];
        for(const item of items) {
            if(item instanceof MoneyItem) {
                newArray.push(new MoneyItem(item.count));
            } else if(item instanceof PieceItem) {
                newArray.push(new PieceItem(item.id, item.name, item.imgSrc, item.count));
            } else if(item instanceof SwordItem) {
                newArray.push(new SwordItem(item.id, item.name, item.imgSrc, item.count));      
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

    makeWithRecipe(recipe: Recipe) {
        if(!Game.inventoryManager.hasItems(recipe.materials)) return;

        if(recipe.result instanceof SwordItem) {
            Game.swordManager.findSword(Game.swordManager.getIndex(recipe.result.id));
        }

        recipe.materials.forEach(material => {
            if(material instanceof MoneyItem) Game.inventoryManager.takeMoney(material.count, {
                type: ContextType.BUY_USING_MONEY,
                resultName: recipe.result.name,
                count: recipe.result.count,
                price: material.count
            });
            else Game.inventoryManager.take(material);

        });

        Game.inventoryManager.save(recipe.result);
    }
}
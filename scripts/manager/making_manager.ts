import { ScreenRenderingContextType } from '../context/rendering/screen_rendering_context.js';
import { MakingUpdateContext } from '../context/updating/making_update_context.js';
import { Observer, Item, Recipe, MoneyItem, RepairPaperItem } from '../other/entity.js';

export class MakingManager extends Observer {

    public readonly repairPaperRecipes: readonly Recipe[] = [
        new Recipe(new RepairPaperItem(1), [new MoneyItem(300)]),
        new Recipe(new RepairPaperItem(5), [new MoneyItem(1500)]),
        new Recipe(new RepairPaperItem(10), [new MoneyItem(3000)]),
        new Recipe(new RepairPaperItem(15), [new MoneyItem(4500)]),
    ];

    public readonly swordRecipes: readonly Recipe[] = [];

    constructor(swordRecipes?: readonly Recipe[]) {
        super();
        if(swordRecipes) this.swordRecipes = swordRecipes;
    }

    public update(makingContext: MakingUpdateContext) {
        this.notify({
            type: ScreenRenderingContextType.MAKING_SCREEN_RENDERING_CONTEXT,
            
            foundSwordIds: makingContext.foundSwordIds,
            havingPieces: makingContext.havingPieces,
            havingSwords: makingContext.havingSwords,
            money: makingContext.money,
            repairPaperCount: makingContext.repairPaperCount,
            repairPaperRecipes: makingContext.repairPaperRecipes,
            swordRecipes: makingContext.swordRecipes
        });
    }

    public getMultipliedItems(items: readonly Item[], amount: number): readonly Item[] {
        return items.map(
            item => new Item(item.id, item.name, item.imgSrc, item.count * amount)
        );
    }

}

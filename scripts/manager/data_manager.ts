import { getStatClass, Stat, StatID } from "./stat_manager.js";
import { Color, Piece, PieceItem, Recipe, Sword, SwordItem } from "../other/entity.js";

export type StatIDs = "luckly_bracelet" | "god_hand" | "big_merchant" | "smith" | "invalidated_sphere" | "magic_hat"

interface SwordData {
    id: string;
    prob: number;
    cost: number;
    price: number;
    requiredRepairs: number;
    canSave: boolean;
    pieces: {id: string; prob: number; max_drop: number}[];
}

interface StatData {
    id: StatIDs;
    name: string;
    description: string;
    values: number[];
    default_value: number;
    color: string;
    prefix: string;
    suffix: string;
}

interface RecipeItem {
    type: "sword" | "piece";
    id: string;
    count: number;
}

interface RecipeData {
    materials: RecipeItem[];
    result: RecipeItem;
}

interface Data {
    path?: Record<string, string>;
    sword?: Sword[];
    recipe?: Recipe[];
    stat?: Record<StatID, Stat>;
    korean?: Record<string, string>
}

export class DataManager {

    async loadAllData(): Promise<Data | null> {

        try {

            const [pathRes, swordRes, recipeRes, statRes, koreanRes] = await Promise.all([
                fetch('./data/path.json'),
                fetch('./data/sword.json'),
                fetch('./data/recipes.json'),
                fetch('./data/stat.json'),
                fetch('./data/korean.json')
            ]);

            if(!pathRes.ok || !swordRes.ok || !recipeRes.ok || !statRes.ok || !koreanRes.ok) {
                throw new Error("데이터 파일 로딩 실패");
            }

            const paths: Record<string, string> = await pathRes.json();
            const swords: SwordData[] = await swordRes.json();
            const recipes: RecipeData[] = await recipeRes.json();
            const stats: StatData[] = await statRes.json();
            const koreans: Record<string, string> = await  koreanRes.json();

            return {
                path: paths,
                sword: this.convertSword(swords),
                recipe: this.convertRecipe(recipes as any),
                stat: this.convertStat(stats as any),
                korean: koreans
            };

        } catch(error) {
            console.error("데이터 로드 중 오류 발생:", error);
        }
        return null;
    }

    private convertSword(swords: SwordData[]): Sword[] {
        return swords.map(
                sword =>
                    new Sword(
                        sword.id, sword.prob, sword.cost, sword.price, sword.requiredRepairs, sword.canSave,
                        sword.pieces.map(
                            drop => new Piece(drop.id, drop.prob, drop.max_drop)
                        )
                    )
            );
    }

    private convertRecipe(recipes: RecipeData[]): Recipe[] {
        return recipes.map(
                recipeData =>
                    new Recipe(
                        (recipeData.result.type == "sword")
                        ? new SwordItem(recipeData.result.id, recipeData.result.count)
                        : new PieceItem(recipeData.result.id, recipeData.result.count),
                        recipeData.materials.map(
                            recipe_item => {
                                if(recipe_item.type == "sword") return new SwordItem(recipe_item.id, recipe_item.count);
                                else return new PieceItem(recipe_item.id, recipe_item.count);
                            }
                        )
                    )
            );
    }

    private convertStat(stats: StatData[]): Record<StatID, Stat> {
        const g = {} as Record<StatID, Stat>;

        for(const stat of stats) {

            const statID = StatID[stat.id.toUpperCase() as keyof typeof StatID];

            g[statID] = new (getStatClass(statID))(
                stat.id,
                stat.description,
                stat.values,
                stat.default_value,
                Color[stat.color as keyof typeof Color],
                stat.prefix,
                stat.suffix);
        }

        return g;
    }

}
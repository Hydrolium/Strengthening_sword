import { getStatClass, StatID } from "./stat_manager.js";
import { Color, Piece, PieceItem, Recipe, Stat, Sword, SwordItem } from "../other/entity.js";

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
                sword: this.convertSword(swords, paths, koreans),
                recipe: this.convertRecipe(recipes as any, paths, koreans),
                stat: this.convertStat(stats as any, paths, koreans),
            };

        } catch(error) {
            console.error("데이터 로드 중 오류 발생:", error);
        }
        return null;
    }

    private convertSword(swords: SwordData[], paths: Record<string, string>, koreans: Record<string, string>): Sword[] {
        return swords.map(
                sword =>
                    new Sword(
                        sword.id, koreans[sword.id], paths[sword.id], sword.prob, sword.cost, sword.price, sword.requiredRepairs, sword.canSave,
                        sword.pieces.map(
                            drop => new Piece(drop.id, koreans[drop.id], paths[drop.id], drop.prob, drop.max_drop)
                        )
                    )
            );
    }

    private convertRecipe(recipes: RecipeData[], paths: Record<string, string>, koreans: Record<string, string>): Recipe[] {
        return recipes.map(
                recipeData =>
                    new Recipe(
                        (recipeData.result.type == "sword")
                        ? new SwordItem(recipeData.result.id, koreans[recipeData.result.id], paths[recipeData.result.id], recipeData.result.count)
                        : new PieceItem(recipeData.result.id, koreans[recipeData.result.id], paths[recipeData.result.id], recipeData.result.count),
                        recipeData.materials.map(
                            recipeItem => {
                                if(recipeItem.type == "sword") return new SwordItem(recipeItem.id, koreans[recipeItem.id], paths[recipeItem.id],recipeItem.count);
                                else return new PieceItem(recipeItem.id, koreans[recipeItem.id], paths[recipeItem.id], recipeItem.count);
                            }
                        )
                    )
            );
    }

    private convertStat(stats: StatData[], paths: Record<string, string>, koreans: Record<string, string>): Record<StatID, Stat> {
        const g = {} as Record<StatID, Stat>;

        for(const statData of stats) {

            const statID = StatID[statData.id.toUpperCase() as keyof typeof StatID];

            g[statID] = new (getStatClass(statID))(
                statData.id,
                koreans[statData.id],
                paths[statData.id],
                statData.description,
                statData.values,
                statData.default_value,
                Color[statData.color as keyof typeof Color],
                statData.prefix,
                statData.suffix);
        }

        return g;
    }

}
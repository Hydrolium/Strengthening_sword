import { getStatClass, StatID } from "../manager/stat_manager.js";
import { Color } from "../element/popup_info.js";
import { Recipe } from "./object/recipe.js";
import { Stat } from "./object/stat.js";
import { Piece } from "./object/piece.js";
import { Sword } from "./object/sword.js";
import { SwordItem } from "./object/item.js";
import { PieceItem } from "./object/item.js";

export type StatIDs = "luckly_bracelet" | "god_hand" | "big_merchant" | "smith" | "invalidated_sphere" | "magic_hat"

interface PieceData {
    readonly id: string;
    readonly prob: number;
    readonly max_drop: number
}

interface SwordData {
    readonly id: string;
    readonly prob: number;
    readonly cost: number;
    readonly price: number;
    readonly requiredRepairs: number;
    readonly canSave: boolean;
    readonly pieces: readonly PieceData[];
}

interface StatData {
    readonly id: StatIDs;
    readonly description: string;
    readonly values: readonly number[];
    readonly default_value: number;
    readonly color: string;
    readonly prefix: string;
    readonly suffix: string;
}

interface RecipeItem {
    readonly type: "sword" | "piece";
    readonly id: string;
    readonly count: number;
}

interface RecipeData {
    readonly materials: readonly RecipeItem[];
    readonly result: RecipeItem;
}

interface Data {
    readonly path?: Readonly<Record<string, string>>;
    readonly sword?: readonly Sword[];
    readonly recipe?: readonly Recipe[];
    readonly stat?: Readonly<Record<StatID, Stat>>;
}

export class DataReader {

    public async loadAllData(): Promise<Data | null> {

        try {

            const [pathRes, swordRes, recipeRes, statRes, koreanRes] = await Promise.all([
                fetch('data/path.json'),
                fetch('data/sword.json'),
                fetch('data/recipes.json'),
                fetch('data/stat.json'),
                fetch('data/korean.json')
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

    private convertSword(swords: readonly SwordData[], paths: Readonly<Record<string, string>>, koreans: Readonly<Record<string, string>>): readonly Sword[] {
        return swords.map(
                (sword, index) =>
                    new Sword(
                        sword.id, index, koreans[sword.id], paths[sword.id], sword.prob, sword.cost, sword.price, sword.requiredRepairs, sword.canSave,
                        sword.pieces.map(
                            drop => new Piece(drop.id, koreans[drop.id], paths[drop.id], drop.prob, drop.max_drop)
                        )
                    )
            );
    }

    private convertRecipe(recipes: readonly RecipeData[], paths: Readonly<Record<string, string>>, koreans: Readonly<Record<string, string>>): readonly Recipe[] {
        return recipes.map(
                recipeData =>
                    new Recipe(
                        (recipeData.result.type == "sword")
                        ? new SwordItem(recipeData.result.id, koreans[recipeData.result.id], paths[recipeData.result.id], recipeData.result.count)
                        : new PieceItem(recipeData.result.id, koreans[recipeData.result.id], paths[recipeData.result.id], recipeData.result.count),
                        recipeData.materials.map(
                            recipeItem => {
                                if(recipeItem.type == "sword") return new SwordItem(recipeItem.id, koreans[recipeItem.id], paths[recipeItem.id], recipeItem.count);
                                else return new PieceItem(recipeItem.id, koreans[recipeItem.id], paths[recipeItem.id], recipeItem.count);
                            }
                        )
                    )
            );
    }

    private convertStat(stats: readonly StatData[], paths: Readonly<Record<string, string>>, koreans: Readonly<Record<string, string>>): Readonly<Record<StatID, Stat>> {
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
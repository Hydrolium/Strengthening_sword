import { getStatClass, StatID } from "../manager/stat_manager.js";
import { Color } from "../element/popup_info.js";
import { Recipe } from "./object/recipe.js";
import { Stat } from "./object/stat.js";
import { Piece } from "./object/piece.js";
import { Sword } from "./object/sword.js";
import { SwordItem } from "./object/item.js";
import { PieceItem } from "./object/item.js";

export type StatIDs = "luckly_bracelet" | "god_hand" | "big_merchant" | "smith" | "invalidated_sphere" | "magic_hat"

interface KoreanDataEntry {
    readonly name: string;
    readonly description: string;
}

interface KoreanData {   
    readonly stat: Readonly<Record<string, KoreanDataEntry>>;
    readonly sword: Readonly<Record<string, KoreanDataEntry>>;
    readonly piece: Readonly<Record<string, KoreanDataEntry>>;
}

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

type PathDataType = Readonly<Record<string, string>>;
type SwordDataList = readonly SwordData[];
type RecipeDataList = readonly RecipeData[];
type StatDataList = readonly StatData[];

type StatRecord = Readonly<Record<StatID, Stat>>;

interface Data {
    readonly path?: PathDataType;
    readonly sword?: readonly Sword[];
    readonly recipe?: readonly Recipe[];
    readonly stat?: StatRecord;
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

            const paths: PathDataType = await pathRes.json();
            const swords: SwordDataList = await swordRes.json();
            const recipes: RecipeDataList = await recipeRes.json();
            const stats: StatDataList = await statRes.json();
            const koreans: KoreanData = await  koreanRes.json();

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

    private convertSword(swords: SwordDataList, paths: PathDataType, koreans: KoreanData): readonly Sword[] {
        return swords.map(
                (sword, index) => {
                    return new Sword(
                        sword.id, index, koreans.sword[sword.id].name, paths[sword.id], koreans.sword[sword.id].description, sword.prob, sword.cost, sword.price, sword.requiredRepairs, sword.canSave,
                        sword.pieces.map(
                            drop => new Piece(drop.id, koreans.piece[drop.id].name, paths[drop.id], koreans.piece[drop.id].description, drop.prob, drop.max_drop)
                        )
                    )
                }
            );
    }

    private convertRecipe(recipes: RecipeDataList, paths: PathDataType, koreans: KoreanData): readonly Recipe[] {
        return recipes.map(
                recipeData =>
                    new Recipe(
                        (recipeData.result.type == "sword")
                        ? new SwordItem(recipeData.result.id, koreans.sword[recipeData.result.id].name, paths[recipeData.result.id], koreans.sword[recipeData.result.id].description, recipeData.result.count)
                        : new PieceItem(recipeData.result.id, koreans.piece[recipeData.result.id].name, paths[recipeData.result.id], koreans.piece[recipeData.result.id].description, recipeData.result.count),
                        recipeData.materials.map(
                            material =>
                                (material.type == "sword")
                                ? new SwordItem(material.id,  koreans.sword[material.id].name, paths[material.id],  koreans.sword[material.id].description, material.count)
                                : new PieceItem(material.id, koreans.piece[material.id].name, paths[material.id], koreans.piece[material.id].description, material.count)
                        )
                    )
            );
    }

    private convertStat(stats: StatDataList, paths: PathDataType, koreans: KoreanData): StatRecord {
        const g = {} as Record<StatID, Stat>;

        for(const statData of stats) {

            const statID = StatID[statData.id.toUpperCase() as keyof typeof StatID];

            g[statID] = new (getStatClass(statID))(
                statData.id,
                koreans.stat[statData.id].name,
                paths[statData.id],
                koreans.stat[statData.id].description,
                statData.values,
                statData.default_value,
                Color[statData.color as keyof typeof Color],
                statData.prefix,
                statData.suffix);
        }

        return g;
    }

}
import { getStatClass, StatID } from "./stat_manager.js";
import { Color, Piece, PieceItem, Recipe, Sword, SwordItem } from "../other/entity.js";
export class DataManager {
    async loadAllData() {
        try {
            const [pathRes, swordRes, recipeRes, statRes, koreanRes] = await Promise.all([
                fetch('./data/path.json'),
                fetch('./data/sword.json'),
                fetch('./data/recipes.json'),
                fetch('./data/stat.json'),
                fetch('./data/korean.json')
            ]);
            if (!pathRes.ok || !swordRes.ok || !recipeRes.ok || !statRes.ok || !koreanRes.ok) {
                throw new Error("데이터 파일 로딩 실패");
            }
            const paths = await pathRes.json();
            const swords = await swordRes.json();
            const recipes = await recipeRes.json();
            const stats = await statRes.json();
            const koreans = await koreanRes.json();
            return {
                path: paths,
                sword: this.convertSword(swords, paths, koreans),
                recipe: this.convertRecipe(recipes, paths, koreans),
                stat: this.convertStat(stats, paths, koreans),
            };
        }
        catch (error) {
            console.error("데이터 로드 중 오류 발생:", error);
        }
        return null;
    }
    convertSword(swords, paths, koreans) {
        return swords.map(sword => new Sword(sword.id, koreans[sword.id], paths[sword.id], sword.prob, sword.cost, sword.price, sword.requiredRepairs, sword.canSave, sword.pieces.map(drop => new Piece(drop.id, koreans[drop.id], paths[drop.id], drop.prob, drop.max_drop))));
    }
    convertRecipe(recipes, paths, koreans) {
        return recipes.map(recipeData => new Recipe((recipeData.result.type == "sword")
            ? new SwordItem(recipeData.result.id, koreans[recipeData.result.id], paths[recipeData.result.id], recipeData.result.count)
            : new PieceItem(recipeData.result.id, koreans[recipeData.result.id], paths[recipeData.result.id], recipeData.result.count), recipeData.materials.map(recipeItem => {
            if (recipeItem.type == "sword")
                return new SwordItem(recipeItem.id, koreans[recipeItem.id], paths[recipeItem.id], recipeItem.count);
            else
                return new PieceItem(recipeItem.id, koreans[recipeItem.id], paths[recipeItem.id], recipeItem.count);
        })));
    }
    convertStat(stats, paths, koreans) {
        const g = {};
        for (const statData of stats) {
            const statID = StatID[statData.id.toUpperCase()];
            g[statID] = new (getStatClass(statID))(statData.id, koreans[statData.id], paths[statData.id], statData.description, statData.values, statData.default_value, Color[statData.color], statData.prefix, statData.suffix);
        }
        return g;
    }
}

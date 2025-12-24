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
                sword: this.convertSword(swords),
                recipe: this.convertRecipe(recipes),
                stat: this.convertStat(stats),
                korean: koreans
            };
        }
        catch (error) {
            console.error("데이터 로드 중 오류 발생:", error);
        }
        return null;
    }
    convertSword(swords) {
        return swords.map(sword => new Sword(sword.id, sword.prob, sword.cost, sword.price, sword.requiredRepairs, sword.canSave, sword.pieces.map(drop => new Piece(drop.id, drop.prob, drop.max_drop))));
    }
    convertRecipe(recipes) {
        return recipes.map(recipeData => new Recipe((recipeData.result.type == "sword")
            ? new SwordItem(recipeData.result.id, recipeData.result.count)
            : new PieceItem(recipeData.result.id, recipeData.result.count), recipeData.materials.map(recipe_item => {
            if (recipe_item.type == "sword")
                return new SwordItem(recipe_item.id, recipe_item.count);
            else
                return new PieceItem(recipe_item.id, recipe_item.count);
        })));
    }
    convertStat(stats) {
        const g = {};
        for (const stat of stats) {
            const statID = StatID[stat.id.toUpperCase()];
            g[statID] = new (getStatClass(statID))(stat.id, stat.description, stat.values, stat.default_value, Color[stat.color], stat.prefix, stat.suffix);
        }
        return g;
    }
}

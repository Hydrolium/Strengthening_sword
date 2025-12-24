import { Observer, TestResult } from '../other/entity.js';
import { Game } from '../other/main.js';
export class Stat {
    constructor(id, description, values, default_value, color, prefix, suffix) {
        this.id = id;
        this.description = description;
        this.values = values;
        this.default_value = default_value;
        this.color = color;
        this.prefix = prefix;
        this.suffix = suffix;
        this.current = 0;
        this.max_stat_level = values.length;
    }
    get name() {
        var _a;
        return (_a = Game.Korean[this.id]) !== null && _a !== void 0 ? _a : this.id;
    }
    getCurrentLevel() {
        return this.current;
    }
    getCurrentValue() {
        return (this.current == 0) ? 0 : this.values[this.current - 1];
    }
    getMaxLevel() {
        return this.max_stat_level;
    }
    isMaxLevel() {
        return this.current >= this.max_stat_level;
    }
    levelUp() {
        this.current++;
    }
}
export class LukcyBracelet extends Stat {
    calculate(initialProb) {
        return Math.min(initialProb + this.getCurrentValue() / 100, 1);
    }
}
export class GodHand extends Stat {
    calculate() {
        return this.getCurrentValue();
    }
}
export class BigMerchant extends Stat {
    calculate(initialPrice) {
        return initialPrice * (100 + this.getCurrentValue()) / 100;
    }
}
export class Smith extends Stat {
    calculate(initialCost) {
        return initialCost * (100 - this.getCurrentValue()) / 100;
    }
}
export class InvalidatedSphere extends Stat {
    calculate() {
        return this.getCurrentValue();
    }
}
export class MagicHat extends Stat {
    calculate(initialMaxDrop) {
        return initialMaxDrop + this.getCurrentValue();
    }
}
MagicHat.minCount = 1;
export const StatID = {
    LUCKY_BRACELET: "LUCKY_BRACELET",
    GOD_HAND: "GOD_HAND",
    BIG_MERCHANT: "BIG_MERCHANT",
    SMITH: "SMITH",
    INVALIDATED_SPHERE: "INVALIDATED_SPHERE",
    MAGIC_HAT: "MAGIC_HAT"
};
export function getStatClass(statID) {
    switch (statID) {
        case StatID.LUCKY_BRACELET: return LukcyBracelet;
        case StatID.GOD_HAND: return GodHand;
        case StatID.BIG_MERCHANT: return BigMerchant;
        case StatID.SMITH: return Smith;
        case StatID.INVALIDATED_SPHERE: return InvalidatedSphere;
        case StatID.MAGIC_HAT: return MagicHat;
    }
}
export class StatManager extends Observer {
    constructor(stats = {}) {
        super();
        this.stat_point = 0;
        this.stats = {};
        this.stats = stats;
    }
    getRenderEvent() {
        return;
        ;
    }
    getStat(id) {
        return this.stats[id];
    }
    calculate(statId, initialValue) {
        return this.stats[statId].calculate(initialValue);
    }
    getStatPoint() {
        return this.stat_point;
    }
    addStatPoint() {
        this.stat_point++;
        this.notify();
    }
    upgradeStat(id) {
        const stat = this.stats[id];
        if (stat.isMaxLevel())
            throw new Error(`${stat.id} is already full-upgrade.`);
        if (this.stat_point <= 0)
            throw new Error(`There are no stat points.`);
        this.stat_point--;
        stat.levelUp();
        if (Object.values(this.stats).every(s => s.isMaxLevel())) {
            Game.statScreen.popupGameAllStatMessage();
        }
        this.notify();
    }
    test(id) {
        if (this.stats[id].isMaxLevel())
            return TestResult.MAX_UPGRADE;
        else if (this.stat_point <= 0)
            return TestResult.RESOURCES_LACK;
        return TestResult.SUCCESS;
    }
}

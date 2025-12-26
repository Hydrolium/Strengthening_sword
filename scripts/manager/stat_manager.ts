import { GameContext } from '../other/context.js';
import { Observer, StatTestResult, Stat, StatClass } from '../other/entity.js';

export class LuckyBracelet extends Stat {
    calculate(initialProb: number): number {
        return Math.min(initialProb + this.getCurrentValue()/100, 1);
    }
}
export class GodHand extends Stat {
    calculate(): number {
        return this.getCurrentValue()/100;
    }
}
export class BigMerchant extends Stat {
    calculate(initialPrice: number): number {
        return initialPrice*(100 + this.getCurrentValue())/100;
    }
}
export class Smith extends Stat {
    calculate(initialCost: number): number {
        return initialCost*(100 - this.getCurrentValue())/100;
    }
}
export class InvalidatedSphere extends Stat {
    calculate(): number {
        return this.getCurrentValue();
    }
}
export class MagicHat extends Stat {

    calculate(initialMaxDrop: number): number {
        return initialMaxDrop + this.getCurrentValue();
    }
}

export const StatID = {
    LUCKY_BRACELET: "LUCKY_BRACELET",
    GOD_HAND: "GOD_HAND",
    BIG_MERCHANT: "BIG_MERCHANT",
    SMITH: "SMITH",
    INVALIDATED_SPHERE: "INVALIDATED_SPHERE",
    MAGIC_HAT: "MAGIC_HAT"
} as const;

export type StatID = typeof StatID[keyof typeof StatID];

export function getStatClass(statID: StatID): StatClass {

    switch(statID) {
        case StatID.LUCKY_BRACELET: return LuckyBracelet;
        case StatID.GOD_HAND: return GodHand;
        case StatID.BIG_MERCHANT: return BigMerchant;
        case StatID.SMITH: return Smith;
        case StatID.INVALIDATED_SPHERE: return InvalidatedSphere;
        case StatID.MAGIC_HAT: return MagicHat;
    }
}

export class StatManager extends Observer {
    
    private stat_point = 0;
    private stats: Record<StatID, Stat> = {} as Record<StatID, Stat>;

    constructor(stats: Record<StatID, Stat> = {} as Record<StatID, Stat>) {
        super();
        this.stats = stats;
    }

    getStat(id: StatID): Stat {
        return this.stats[id];
    }

    calculate(statId: StatID, initialValue?: number): number {
        return this.stats[statId].calculate(initialValue);
    }

    getStatPoint(): number { 
        return this.stat_point;
    }
    addStatPoint() {
        this.stat_point++;

        this.notify();
    }

    upgradeStat(id: StatID) {
        const stat = this.stats[id];
        if(stat.isMaxLevel()) throw new Error(`${stat.id} is already full-upgrade.`);
        if(this.stat_point <= 0) throw new Error(`There are no stat points.`);
        
        this.stat_point--;
        stat.levelUp();

        this.notify();
    }

    tryUpgrade(statId: StatID): StatTestResult {
        
        if(this.stats[statId].isMaxLevel()) return StatTestResult.REJECTED_BY_MAX_UPGRADE;
        if(this.stat_point <= 0) return StatTestResult.REJECTED_BY_POINT_LACK;

        this.upgradeStat(statId);

        if(Object.values(this.stats).every(s => s.isMaxLevel())) {
            return StatTestResult.SUCCESS_AND_ALL_MAX;
        }

        return StatTestResult.SUCCESS;
        
    }

}
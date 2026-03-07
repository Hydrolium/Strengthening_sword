import { ContextType, StatContext } from '../other/context.js';
import { Observer, StatTestResult, Stat, StatClass } from '../other/entity.js';

export class LuckyBracelet extends Stat {
    public calculate(initialProb: number): number {
        return Math.min(initialProb + this.getCurrentValue()/100, 1);
    }
}
export class GodHand extends Stat {
    public calculate(): number {
        return this.getCurrentValue()/100;
    }
}
export class BigMerchant extends Stat {
    public calculate(initialPrice: number): number {
        return initialPrice*(100 + this.getCurrentValue())/100;
    }
}
export class Smith extends Stat {
    public calculate(initialCost: number): number {
        return initialCost*(100 - this.getCurrentValue())/100;
    }
}
export class InvalidatedSphere extends Stat {
    public calculate(): number {
        return this.getCurrentValue();
    }
}
export class MagicHat extends Stat {
    public calculate(initialMaxDrop: number): number {
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
    
    private _statPoint = 0;
    private _stats: Readonly<Record<StatID, Stat>> = {} as Record<StatID, Stat>;

    constructor(stats: Readonly<Record<StatID, Stat>> = {} as Record<StatID, Stat>) {
        super();
        this._stats = stats;
    }

    public get statContext(): StatContext {
        return {
            type: ContextType.STAT,
            statPoint: this._statPoint,
            stats: Object.values(this._stats)
        };
    }

    public calculate(statId: StatID, initialValue?: number): number {
        return this._stats[statId].calculate(initialValue);
    }

    public addStatPoint() {
        this._statPoint++;

        this.notify(this.statContext);
    }

    public upgradeStat(id: StatID) {
        const stat = this._stats[id];
        if(stat.isMaxLevel()) throw new Error(`${stat.id} is already full-upgrade.`);
        if(this._statPoint <= 0) throw new Error(`There are no stat points.`);

        this._statPoint--;
        stat.levelUp();

        this.notify(this.statContext);
    }

    public tryUpgrade(statId: StatID): StatTestResult {
        
        if(this._stats[statId].isMaxLevel()) return StatTestResult.REJECTED_BY_MAX_UPGRADE;
        if(this._statPoint <= 0) return StatTestResult.REJECTED_BY_POINT_LACK;

        this.upgradeStat(statId);

        if(Object.values(this._stats).every(s => s.isMaxLevel())) {
            return StatTestResult.SUCCESS_AND_ALL_MAX;
        }

        return StatTestResult.SUCCESS;
        
    }

}
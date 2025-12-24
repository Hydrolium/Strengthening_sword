import { Observer, Color, TestResult, GameContext, ContextType } from '../other/entity.js';
import { Game } from '../other/main.js';

export type StatClass = new (
        id: string,
        description: string,
        values: number[],
        default_value: number,
        color: Color,
        prefix: string,
        suffix: string) => Stat;

export abstract class Stat {
    private current: number = 0;
    private readonly max_stat_level: number;
  
    constructor(
        public readonly id: string,
        public readonly description: string,
        public readonly values: number[],
        public readonly default_value: number,
        public readonly color: Color,
        public readonly prefix: string,
        public readonly suffix: string) {
            this.max_stat_level = values.length;
        }

    get name(): string {
        return Game.Korean[this.id] ?? this.id;
    }

    getCurrentLevel(): number {
        return this.current;
    }

    getCurrentValue(): number {
        return (this.current == 0) ? 0 : this.values[this.current-1];
    }

    getMaxLevel(): number {
        return this.max_stat_level;
    }

    isMaxLevel(): boolean {
        return this.current >= this.max_stat_level;
    }

    levelUp() {
        this.current++;
    }

    abstract calculate(initialValue?: number): number;
}

export class LukcyBracelet extends Stat {
    calculate(initialProb: number): number {
        return Math.min(
            initialProb + this.getCurrentValue()/100,
            1
        );
    }
}
export class GodHand extends Stat {
    calculate(): number {
        return this.getCurrentValue();
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

    static readonly minCount = 1;

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
        case StatID.LUCKY_BRACELET: return LukcyBracelet;
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

    getRenderEvent(): GameContext | undefined {
        return;;
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
        
        if(Object.values(this.stats).every(s => s.isMaxLevel())) {
            Game.statScreen.popupGameAllStatMessage();
        }

        this.notify();
    }

    test(id: StatID) {
        if(this.stats[id].isMaxLevel()) return TestResult.MAX_UPGRADE;
        else if(this.stat_point <= 0) return TestResult.RESOURCES_LACK;
        return TestResult.SUCCESS;
    }
}
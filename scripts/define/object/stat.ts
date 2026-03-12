import { Color } from "../../element/popup_info";

export type StatClass = new (
    id: string,
    name: string,
    imgSrc: string,
    description: string,
    values: readonly number[],
    default_value: number,
    color: Color,
    prefix: string,
    suffix: string) => Stat;

export interface StatInfo {
    readonly id: string;
    readonly name: string;
    readonly imgSrc: string;
    readonly description: string;
    readonly values: readonly number[];
    readonly default_value: number;
    readonly color: Color;
    readonly prefix: string;
    readonly suffix: string;

    getCurrentLevel(): number;
    getCurrentValue(): number;
    getMaxLevel(): number;
    isMaxLevel(): boolean;
}

export abstract class Stat implements StatInfo {
    private current: number = 0;
    private readonly maxStatLevel: number;

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly imgSrc: string,
        public readonly description: string,
        public readonly values: readonly number[],
        public readonly default_value: number,
        public readonly color: Color,
        public readonly prefix: string,
        public readonly suffix: string) {
        this.maxStatLevel = values.length;
    }

    public getCurrentLevel(): number {
        return this.current;
    }

    public getCurrentValue(): number {
        return (this.current == 0) ? 0 : this.values[this.current - 1];
    }

    public getMaxLevel(): number {
        return this.maxStatLevel;
    }

    public isMaxLevel(): boolean {
        return this.current >= this.maxStatLevel;
    }

    public levelUp() {
        this.current++;
    }

    public abstract calculate(initialValue?: number): number;
}


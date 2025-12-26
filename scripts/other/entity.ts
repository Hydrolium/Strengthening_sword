import { InventoryManager } from "../manager/inventory_manager.js";
import { Refreshable } from "../screen/screen.js";
import { GameContext } from "./context.js";
import { Game } from "./main.js";


export class Observer {

    private observers: Refreshable[] = [];

    subscribe(Refreshable: Refreshable) {
        this.observers.push(Refreshable);
    }
    notify(context?: GameContext) {
        this.observers.forEach(Refreshable => Refreshable.refresh(context));
    }
}


export class Item { 
    constructor(public id: string, public name: string, public imgSrc: string, public count: number) {}

}

export class PieceItem extends Item { constructor(id: string, name: string, imgSrc: string, count: number) { super(id, name, imgSrc, count); } }
export class SwordItem extends Item { constructor(id: string, name: string, imgSrc: string, count: number) { super(id, name, imgSrc, count); } }
export class MoneyItem extends Item { constructor(count: number) { super("money", "돈", "images/items/money.png", count); } }
export class RepairPaperItem extends Item { constructor(count: number) { super("repair_paper", "복구권", "images/items/repair_paper.png", count); } }
export class UnknownItem extends Item { constructor() { super("unknown", "발견 안됨", "images/items/unknown.png", 1); } }

export class Storage<T extends Item> {
    
    public items: Map<string, T> = new Map();

    constructor(
        private owner: InventoryManager,
        private stockClass: new (id: string, name: string, imgSrc: string, count: number) => T,
        private infinityCheck: () => boolean) {}

    get length(): number {
        return this.items.size;
    }

    getCount(id: string): number {
        return (this.infinityCheck()) ? Infinity : this.items.get(id)?.count ?? 0;
    }

    add(item: T) {
        if(item.count <= 0) return;

        const exisiting = this.items.get(item.id);

        if(exisiting) exisiting.count += item.count;
        else this.items.set(item.id, new this.stockClass(item.id, item.name, item.imgSrc, item.count));

        this.owner.notify(
            this.owner.inventoryContext
        );
    }

    hasEnough(id: string, count: number): boolean {
        return this.getCount(id) >= count;
    }

    remove(id: string, count: number) {
        if(count <= 0) return;

        const exisiting = this.items.get(id);
        if(!exisiting) return;

        exisiting.count -= count;

        if(exisiting.count <= 0) this.items.delete(id);

        this.owner.notify(
            this.owner.inventoryContext
        );
    }

    sorted(compareFn?: (a: T, b: T) => number): T[] {

        return Array.from(this.items.values())
            .sort(compareFn);
    }
}

export class Sword {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly imgSrc: string,
        public readonly prob: number,
        public readonly cost: number,
        public readonly price: number,
        public readonly requiredRepairs: number,
        public readonly canSave: boolean,
        public readonly pieces: Piece[]) {}

    toItem(): SwordItem {
        return new SwordItem(this.id, this.name, this.imgSrc, 1);
    }
}

export class Piece {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly imgSrc: string,
        public readonly prob: number,
        public readonly maxDrop: number = 1) {}

    drop(): PieceItem {
        if(Math.random() < this.prob) return new PieceItem(this.id, this.name, this.imgSrc, Math.floor(Math.random() * this.maxDrop +1));
        return new PieceItem(this.id, this.name, this.imgSrc, 0);
    } 
}

export enum SwordTestResult {
    REJECTED_BY_MONEY_LACK,
    REJECTED_BY_MAX_UPGRADE,
    SUCCESS,
    GREAT_SUCCESS,
    FAIL_BUT_INVALIDATED,
    FAIL
}

export enum StatTestResult {
    REJECTED_BY_POINT_LACK,
    REJECTED_BY_MAX_UPGRADE,
    SUCCESS,
    SUCCESS_AND_ALL_MAX
}

export class Recipe {
    constructor(public result: SwordItem | PieceItem, public materials: Item[]) {}
}

export enum Color {
    RED = "red",
    GREEN = "green",
    SKY = "sky",
    BLUE = "blue",
    NAVY = "navy",
    PURPLE = "purple",
    DARK_BLUE = "dark_blue",
    BROWN = "brown",
    GOLD = "gold",
    DARK_GRAY = "dark_gray"
}


export type StatClass = new (
        id: string,
        name: string,
        imgSrc: string,
        description: string,
        values: number[],
        default_value: number,
        color: Color,
        prefix: string,
        suffix: string) => Stat;

export abstract class Stat {
    private current: number = 0;
    private readonly maxStatLevel: number;
  
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly imgSrc: string,
        public readonly description: string,
        public readonly values: number[],
        public readonly default_value: number,
        public readonly color: Color,
        public readonly prefix: string,
        public readonly suffix: string) {
            this.maxStatLevel = values.length;
        }

    getCurrentLevel(): number {
        return this.current;
    }

    getCurrentValue(): number {
        return (this.current == 0) ? 0 : this.values[this.current-1];
    }

    getMaxLevel(): number {
        return this.maxStatLevel;
    }

    isMaxLevel(): boolean {
        return this.current >= this.maxStatLevel;
    }

    levelUp() {
        this.current++;
    }

    abstract calculate(initialValue?: number): number;
}
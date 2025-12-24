import { InventoryManager } from "../manager/inventory_manager.js";
import { Refreshable } from "../screen/screen.js";
import { GameContext } from "./context.js";
import { Game } from "./main.js";


export abstract class Observer {

    private observers: Refreshable[] = [];

    subscribe(Refreshable: Refreshable) {
        this.observers.push(Refreshable);
    }
    notify(context?: GameContext) {
        this.observers.forEach(Refreshable => Refreshable.refresh(context));
    }

    abstract getRenderEvent(): GameContext | undefined;
}


export class Item { 
    constructor(public id: string, public count: number) {}

    get name(): string {
        return Game.Korean[this.id] ?? this.id;
    }

}
export class PieceItem extends Item { constructor(id: string, count: number) { super(id, count); } }
export class SwordItem extends Item { constructor(id: string, count: number) { super(id, count); } }
export class MoneyItem extends Item { constructor(count: number) { super("money", count); } }
export class RepairPaperItem extends Item { constructor(count: number) { super("repair_paper", count); } }
export class UnknownItem extends Item { constructor() { super("unknown", 1); } }

export class Storage<T extends Item> {
    
    public items: Map<string, T> = new Map();

    constructor(
        private owner: InventoryManager,
        private stockClass: new (id: string, count: number) => T) {}

    get length(): number {
        return this.items.size;
    }

    getCount(id: string): number {
        return (Game.developerMod.infinityMaterial) ? Infinity : this.items.get(id)?.count ?? 0;
    }

    add(id: string, count: number) {
        if(count <= 0) return;

        const exisiting = this.items.get(id);

        if(exisiting) exisiting.count += count;
        else this.items.set(id, new this.stockClass(id, count));

        this.owner.notify(
            this.owner.getRenderEvent()
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
            this.owner.getRenderEvent()
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
        private readonly _prob: number,
        public readonly cost: number,
        public readonly price: number,
        public readonly requiredRepairs: number,
        public readonly canSave: boolean,
        public readonly pieces: Piece[]) {}

    get name(): string {
        return Game.Korean[this.id] ?? this.id;
    }

    get prob(): number {
        return (Game.developerMod.alwaysSuccess) ? 1 : this._prob;
    }

    toItem(): SwordItem {
        return new SwordItem(this.id, 1);
    }
}

export class Piece {

    constructor(
        public readonly id: string,
        public readonly prob: number,
        public readonly max_drop: number = 1) {}

    get name(): string {
        return Game.Korean[this.id] ?? this.id;
    }

    drop(): PieceItem {
        if(Math.random() < this.prob) return new PieceItem(this.id, Math.floor(Math.random() * this.max_drop +1));
        return new PieceItem(this.id, 0);
    } 
}

export enum TestResult {
    RESOURCES_LACK,
    MAX_UPGRADE,
    SUCCESS
    
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


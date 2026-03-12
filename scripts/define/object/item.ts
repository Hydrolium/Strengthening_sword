export type ItemClass<T> = new (id: string, name: string, imgSrc: string, count: number) => T;

export class Item { constructor(public readonly id: string, public readonly name: string, public readonly imgSrc: string, public readonly count: number) { } }

export class PieceItem extends Item { constructor(id: string, name: string, imgSrc: string, count: number) { super(id, name, imgSrc, count); } }

export class SwordItem extends Item { constructor(id: string, name: string, imgSrc: string, count: number) { super(id, name, imgSrc, count); } }

export class MoneyItem extends Item { constructor(count: number) { super("money", "돈", "images/items/money.png", count); } }

export class RepairPaperItem extends Item { constructor(count: number) { super("repair_paper", "복구권", "images/items/repair_paper.png", count); } }

export class UnknownItem extends Item {
    private static _instance: UnknownItem | undefined;

    private constructor() {
        super("unknown", "발견 안됨", "images/items/unknown.png", 1);
    }

    public static get instance(): UnknownItem {
        if (this._instance) return this._instance;
        this._instance = new UnknownItem();
        return this._instance;
    }
}


export type ItemClass<T> = new (id: string, name: string, imgSrc: string, description: string, count: number) => T;

export enum ItemType {
    ITEM,
    PIECE,
    SWORD,
    MONEY,
    REPAIR_PAPER,
    UNKNOWN
}

export class Item { 
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly imgSrc: string,
        public readonly description: string, 
        public readonly count: number) { } 
}

export class PieceItem extends Item { 
    constructor(id: string, name: string, imgSrc: string, description: string, count: number) {
        super(id, name, imgSrc, description, count);
    } }

export class SwordItem extends Item {
    constructor(id: string, name: string, imgSrc: string, description: string, count: number) {
        super(id, name, imgSrc, description, count); } }

export class MoneyItem extends Item { constructor(count: number) { super("money", "돈", "images/items/money.png", "강화와 제작에 사용되는 기본 재화", count); } }

export class RepairPaperItem extends Item { constructor(count: number) { super("repair_paper", "복구권", "images/items/repair_paper.png", "파괴된 검을 수리할 수 있는 주문서", count); } }

export class UnknownItem extends Item {
    private static _instance: UnknownItem | undefined;

    private constructor() {
        super("unknown", "발견 안됨", "images/items/unknown.png", "아직 발견하지 못한 정체를 알 수 없는 물건.", 1);
    }

    public static get instance(): UnknownItem {
        if (this._instance) return this._instance;
        this._instance = new UnknownItem();
        return this._instance;
    }
}


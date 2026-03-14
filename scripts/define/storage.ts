import { Item } from "./object/item";
import { ItemClass } from "./object/item";
import { DeveloperMode } from "./developer_mode";

export interface StorageInfo<T extends Item> {

    readonly size: number;

    getAll(): readonly T[];
    getCount(id: string): number;
    hasEnough(id: string, count: number): boolean;
    sorted(compareFn?: (a: T, b: T) => number): readonly T[];

}

export class Storage<T extends Item> implements StorageInfo<T> {

    private _items: Map<string, T> = new Map();

    constructor(
        private _itemClass: ItemClass<T>,
        private _developerMode: DeveloperMode
    ) { }

    public get size(): number {
        return this._items.size;
    }

    public getAll(): readonly T[] {
        if (!this._developerMode.infinityMaterial) return Array.from(this._items.values());
        return Array.from(this._items.values(), item => new this._itemClass(item.id, item.name, item.imgSrc, item.description, Infinity));
    }

    public getCount(id: string): number {
        return (this._developerMode.infinityMaterial) ? Infinity : this._items.get(id)?.count ?? 0;
    }

    public hasEnough(id: string, count: number): boolean {
        return this.getCount(id) >= count;
    }

    public sorted(compareFn?: (a: T, b: T) => number): readonly T[] {

        return Array.from(this._items.values())
            .sort(compareFn);
    }

    public add(item: T) {
        if (item.count <= 0) return;

        const existing = this._items.get(item.id);

        if (existing) this._items.set(item.id, new this._itemClass(item.id, item.name, item.imgSrc, item.description, item.count + existing.count));
        else this._items.set(item.id, new this._itemClass(item.id, item.name, item.imgSrc, item.description, item.count));
    }

    public remove(id: string, count: number) {
        if (count <= 0) return;

        const existing = this._items.get(id);
        if (!existing) return;

        if (existing.count <= count) this._items.delete(id);
        else this._items.set(existing.id, new this._itemClass(existing.id, existing.name, existing.imgSrc, existing.description, existing.count - count));
    }
}


import { SwordItem, RepairPaperItem, Item } from "./item";


export class Recipe {
    constructor(public readonly result: SwordItem | RepairPaperItem, public readonly materials: readonly Item[]) { }
}

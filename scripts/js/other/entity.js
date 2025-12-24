import { Game } from "./main.js";
export class Observer {
    constructor() {
        this.observers = [];
    }
    subscribe(Refreshable) {
        this.observers.push(Refreshable);
    }
    notify(context) {
        this.observers.forEach(Refreshable => Refreshable.refresh(context));
    }
}
export class Item {
    constructor(id, count) {
        this.id = id;
        this.count = count;
    }
    get name() {
        var _a;
        return (_a = Game.Korean[this.id]) !== null && _a !== void 0 ? _a : this.id;
    }
}
export class PieceItem extends Item {
    constructor(id, count) { super(id, count); }
}
export class SwordItem extends Item {
    constructor(id, count) { super(id, count); }
}
export class MoneyItem extends Item {
    constructor(count) { super("money", count); }
}
export class RepairPaperItem extends Item {
    constructor(count) { super("repair_paper", count); }
}
export class UnknownItem extends Item {
    constructor() { super("unknown", 1); }
}
export class Storage {
    constructor(owner, stockClass) {
        this.owner = owner;
        this.stockClass = stockClass;
        this.items = new Map();
    }
    get length() {
        return this.items.size;
    }
    getCount(id) {
        var _a, _b;
        return (Game.developerMod.infinityMaterial) ? Infinity : (_b = (_a = this.items.get(id)) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
    }
    add(id, count) {
        if (count <= 0)
            return;
        const exisiting = this.items.get(id);
        if (exisiting)
            exisiting.count += count;
        else
            this.items.set(id, new this.stockClass(id, count));
        this.owner.notify(this.owner.getRenderEvent());
    }
    hasEnough(id, count) {
        return this.getCount(id) >= count;
    }
    remove(id, count) {
        if (count <= 0)
            return;
        const exisiting = this.items.get(id);
        if (!exisiting)
            return;
        exisiting.count -= count;
        if (exisiting.count <= 0)
            this.items.delete(id);
        this.owner.notify(this.owner.getRenderEvent());
    }
    sorted(compareFn) {
        return Array.from(this.items.values())
            .sort(compareFn);
    }
}
export class Sword {
    constructor(id, _prob, cost, price, requiredRepairs, canSave, pieces) {
        this.id = id;
        this._prob = _prob;
        this.cost = cost;
        this.price = price;
        this.requiredRepairs = requiredRepairs;
        this.canSave = canSave;
        this.pieces = pieces;
    }
    get name() {
        var _a;
        return (_a = Game.Korean[this.id]) !== null && _a !== void 0 ? _a : this.id;
    }
    get prob() {
        return (Game.developerMod.alwaysSuccess) ? 1 : this._prob;
    }
    toItem() {
        return new SwordItem(this.id, 1);
    }
}
export class Piece {
    constructor(id, prob, max_drop = 1) {
        this.id = id;
        this.prob = prob;
        this.max_drop = max_drop;
    }
    get name() {
        var _a;
        return (_a = Game.Korean[this.id]) !== null && _a !== void 0 ? _a : this.id;
    }
    drop() {
        if (Math.random() < this.prob)
            return new PieceItem(this.id, Math.floor(Math.random() * this.max_drop + 1));
        return new PieceItem(this.id, 0);
    }
}
export var TestResult;
(function (TestResult) {
    TestResult[TestResult["RESOURCES_LACK"] = 0] = "RESOURCES_LACK";
    TestResult[TestResult["MAX_UPGRADE"] = 1] = "MAX_UPGRADE";
    TestResult[TestResult["SUCCESS"] = 2] = "SUCCESS";
})(TestResult || (TestResult = {}));
export class Recipe {
    constructor(result, materials) {
        this.result = result;
        this.materials = materials;
    }
}
export var Color;
(function (Color) {
    Color["RED"] = "red";
    Color["GREEN"] = "green";
    Color["SKY"] = "sky";
    Color["BLUE"] = "blue";
    Color["NAVY"] = "navy";
    Color["PURPLE"] = "purple";
    Color["DARK_BLUE"] = "dark_blue";
    Color["BROWN"] = "brown";
    Color["GOLD"] = "gold";
    Color["DARK_GRAY"] = "dark_gray";
})(Color || (Color = {}));

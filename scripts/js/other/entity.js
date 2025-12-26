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
    constructor(id, name, imgSrc, count) {
        this.id = id;
        this.name = name;
        this.imgSrc = imgSrc;
        this.count = count;
    }
}
export class PieceItem extends Item {
    constructor(id, name, imgSrc, count) { super(id, name, imgSrc, count); }
}
export class SwordItem extends Item {
    constructor(id, name, imgSrc, count) { super(id, name, imgSrc, count); }
}
export class MoneyItem extends Item {
    constructor(count) { super("money", "돈", "images/items/money.png", count); }
}
export class RepairPaperItem extends Item {
    constructor(count) { super("repair_paper", "복구권", "images/items/repair_paper.png", count); }
}
export class UnknownItem extends Item {
    constructor() { super("unknown", "발견 안됨", "images/items/unknown.png", 1); }
}
export class Storage {
    constructor(owner, stockClass, infinityCheck) {
        this.owner = owner;
        this.stockClass = stockClass;
        this.infinityCheck = infinityCheck;
        this.items = new Map();
    }
    get length() {
        return this.items.size;
    }
    getCount(id) {
        var _a, _b;
        return (this.infinityCheck()) ? Infinity : (_b = (_a = this.items.get(id)) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
    }
    add(item) {
        if (item.count <= 0)
            return;
        const exisiting = this.items.get(item.id);
        if (exisiting)
            exisiting.count += item.count;
        else
            this.items.set(item.id, new this.stockClass(item.id, item.name, item.imgSrc, item.count));
        this.owner.notify(this.owner.inventoryContext);
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
        this.owner.notify(this.owner.inventoryContext);
    }
    sorted(compareFn) {
        return Array.from(this.items.values())
            .sort(compareFn);
    }
}
export class Sword {
    constructor(id, name, imgSrc, prob, cost, price, requiredRepairs, canSave, pieces) {
        this.id = id;
        this.name = name;
        this.imgSrc = imgSrc;
        this.prob = prob;
        this.cost = cost;
        this.price = price;
        this.requiredRepairs = requiredRepairs;
        this.canSave = canSave;
        this.pieces = pieces;
    }
    toItem() {
        return new SwordItem(this.id, this.name, this.imgSrc, 1);
    }
}
export class Piece {
    constructor(id, name, imgSrc, prob, maxDrop = 1) {
        this.id = id;
        this.name = name;
        this.imgSrc = imgSrc;
        this.prob = prob;
        this.maxDrop = maxDrop;
    }
    drop() {
        if (Math.random() < this.prob)
            return new PieceItem(this.id, this.name, this.imgSrc, Math.floor(Math.random() * this.maxDrop + 1));
        return new PieceItem(this.id, this.name, this.imgSrc, 0);
    }
}
export var SwordTestResult;
(function (SwordTestResult) {
    SwordTestResult[SwordTestResult["REJECTED_BY_MONEY_LACK"] = 0] = "REJECTED_BY_MONEY_LACK";
    SwordTestResult[SwordTestResult["REJECTED_BY_MAX_UPGRADE"] = 1] = "REJECTED_BY_MAX_UPGRADE";
    SwordTestResult[SwordTestResult["SUCCESS"] = 2] = "SUCCESS";
    SwordTestResult[SwordTestResult["GREAT_SUCCESS"] = 3] = "GREAT_SUCCESS";
    SwordTestResult[SwordTestResult["FAIL_BUT_INVALIDATED"] = 4] = "FAIL_BUT_INVALIDATED";
    SwordTestResult[SwordTestResult["FAIL"] = 5] = "FAIL";
})(SwordTestResult || (SwordTestResult = {}));
export var StatTestResult;
(function (StatTestResult) {
    StatTestResult[StatTestResult["REJECTED_BY_POINT_LACK"] = 0] = "REJECTED_BY_POINT_LACK";
    StatTestResult[StatTestResult["REJECTED_BY_MAX_UPGRADE"] = 1] = "REJECTED_BY_MAX_UPGRADE";
    StatTestResult[StatTestResult["SUCCESS"] = 2] = "SUCCESS";
    StatTestResult[StatTestResult["SUCCESS_AND_ALL_MAX"] = 3] = "SUCCESS_AND_ALL_MAX";
})(StatTestResult || (StatTestResult = {}));
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
export class Stat {
    constructor(id, name, imgSrc, description, values, default_value, color, prefix, suffix) {
        this.id = id;
        this.name = name;
        this.imgSrc = imgSrc;
        this.description = description;
        this.values = values;
        this.default_value = default_value;
        this.color = color;
        this.prefix = prefix;
        this.suffix = suffix;
        this.current = 0;
        this.maxStatLevel = values.length;
    }
    getCurrentLevel() {
        return this.current;
    }
    getCurrentValue() {
        return (this.current == 0) ? 0 : this.values[this.current - 1];
    }
    getMaxLevel() {
        return this.maxStatLevel;
    }
    isMaxLevel() {
        return this.current >= this.maxStatLevel;
    }
    levelUp() {
        this.current++;
    }
}

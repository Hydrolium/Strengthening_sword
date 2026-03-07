import { ContextType, FoundSwordsContext, GameContext, SwordContext } from '../other/context.js';
import { Observer, Piece, PieceItem, Sword, SwordInfoByPiece, SwordItem, SwordTestResult, UnknownItem } from '../other/entity.js';
import { Game } from '../other/main.js';
import { StatID } from './stat_manager.js';

export class SwordManager extends Observer {

    private readonly _swords: readonly Sword[];

    private _current_sword_index: number = 0;
    private readonly _swordCount: number;
    private readonly _pieceInfos: ReadonlyMap<String, readonly SwordInfoByPiece[]>;

    private readonly _foundSwordIndexes = new Set<number>();

    public readonly maxUpgradableIndex: number;

    constructor(swords?: readonly Sword[]) {
        super();
        this._swords = swords ?? [];

        this.maxUpgradableIndex = this._swords.length -1;
        this._swordCount = this._swords.length;

        const pieceInfos: Map<String, SwordInfoByPiece[]> = new Map();
        
        for(const sword of this._swords) {
            for(const piece of sword.pieces) {
                const swordInfo = new SwordInfoByPiece(sword.id, sword.index, sword.name, sword.imgSrc, piece.prob, piece.maxDrop);

                if(pieceInfos.has(piece.id)) pieceInfos.get(piece.id)?.push(swordInfo);
                else pieceInfos.set(piece.id, [swordInfo]);
            }
        }

        this._pieceInfos = pieceInfos;

    }

    public get current_sword_index(): number {
        return this._current_sword_index;
    }

    public set current_sword_index(value: number) {
        value = Math.min(Math.max(value, 0), this.maxUpgradableIndex);
        this._current_sword_index = value;

        this.notify(this.swordContext);
    }

    public get swordContext(): SwordContext {
        return {
            type: ContextType.SWORD,
            index: this._current_sword_index,
            sword: this.getCalculatedCurrentSword(),
            isMax: this._current_sword_index >= this.maxUpgradableIndex
        };
    }

    public get foundSwordsContext(): FoundSwordsContext {
        const swords: Sword[] = [];
        for(let i = 0; i < this._swordCount; i++) {
            if(this._foundSwordIndexes.has(i)) swords.push(this.getSwordWithIdx(i));
        }

        return {
            type: ContextType.FOUND_SWORDS,
            swords: this._swords,
            founds: this._foundSwordIndexes
        }
    }

    public getSwordsByPieceId(pieceId: string): readonly SwordInfoByPiece[] {
        return this._pieceInfos.get(pieceId) ?? [];
    }


    public getSwordWithId(id: string): Sword {
        const res = this._swords.find(sword => sword.id == id)
        if(res === undefined) throw new Error(`Sword with ID ${id} not found.`);
        return res;
    }

    public getSwordWithIdx(index: number): Sword {
        return this._swords[index];
    }

    public getCalculatedSwordWithId(id: string): Sword {
        const sword = this.getSwordWithId(id);
        return new Sword(
            sword.id,
            sword.index,
            sword.name,
            sword.imgSrc,
            Game.statManager.calculate(StatID.LUCKY_BRACELET, sword.prob),
            Game.statManager.calculate(StatID.SMITH, sword.cost),
            Game.statManager.calculate(StatID.BIG_MERCHANT, sword.price),
            sword.requiredRepairs,
            sword.canSave,
            sword.pieces.map(piece => new Piece(piece.id, piece.name, piece.imgSrc, piece.prob, Game.statManager.calculate(StatID.MAGIC_HAT, piece.maxDrop)))
        );
    }

    public getCalculatedSwordWithIdx(index: number): Sword {
        const sword = this.getSwordWithIdx(index);
        return new Sword(
            sword.id,
            sword.index,
            sword.name,
            sword.imgSrc,
            Game.statManager.calculate(StatID.LUCKY_BRACELET, sword.prob),
            Game.statManager.calculate(StatID.SMITH, sword.cost),
            Game.statManager.calculate(StatID.BIG_MERCHANT, sword.price),
            sword.requiredRepairs,
            sword.canSave,
            sword.pieces.map(piece => new Piece(piece.id, piece.name, piece.imgSrc, piece.prob, Game.statManager.calculate(StatID.MAGIC_HAT, piece.maxDrop)))
        );
    }

    public getIndex(id: string): number {
        return this._swords.indexOf(this.getSwordWithId(id));
    }

    public calculateLoss(index: number): number {
        return this._swords.slice(0, index+1).reduce((pre, cur) => pre += Game.statManager.calculate(StatID.SMITH, cur.cost), 0);
    }

    public isFound(value: number | string): boolean {
        switch (typeof value) {
            case "number": return this._foundSwordIndexes.has(value);
            case "string": return this._foundSwordIndexes.has(this.getSwordWithId(value).index);
        }
    }

    public findSword(index: number) {
        if(this.isFound(index)) return;

        this._foundSwordIndexes.add(index);
        Game.statManager.addStatPoint();
    }

    public getFoundSwordIndexes() : ReadonlySet<number> {
        return this._foundSwordIndexes;
    }

    public jumpTo(index: number) {

        index = Math.min(Math.max(index, 0), this.maxUpgradableIndex);

        this.findSword(index);

        this.current_sword_index = index;
    }

    public upgradeSword(index: number = 1) {
        this.jumpTo(this.current_sword_index + index);
    }
    public downgradeSword(index: number = 1) {
        this.jumpTo(this.current_sword_index - index);
    }

    public getCurrentSword(): Sword {
        return this.getSwordWithIdx(this.current_sword_index);
    }

    public getCalculatedCurrentSword(): Sword {
        return this.getCalculatedSwordWithIdx(this.current_sword_index);
    }

    public getNextSword(): Sword {
        return this.getSwordWithIdx(Math.min(this.current_sword_index +1, this.maxUpgradableIndex));
    }

    public tryUpgrade(): {result: SwordTestResult, result_index: number, sword?: Sword, dropped_pieces?: readonly PieceItem[]} {
        
        const sword = this.getCalculatedCurrentSword();

        if(this.current_sword_index >= this.maxUpgradableIndex) return {result: SwordTestResult.REJECTED_BY_MAX_UPGRADE, result_index: this.current_sword_index};
        if(!Game.inventoryManager.hasMoney(sword.cost)) return {result: SwordTestResult.REJECTED_BY_MONEY_LACK, result_index: this.current_sword_index};

        Game.inventoryManager.takeMoney(sword.cost, {
            type: ContextType.SWORD_UPGRADE,
            name: sword.name,
            cost: sword.cost
        });

        if(Game.developerMod.alwaysSuccess || Math.random() < sword.prob) {
            if(Math.random() < Game.statManager.calculate(StatID.GOD_HAND)) {
                this.upgradeSword(2);
                return {result: SwordTestResult.GREAT_SUCCESS, result_index: this.current_sword_index};
            } else {
                this.upgradeSword();
                return {result: SwordTestResult.SUCCESS, result_index: this.current_sword_index};
            }
        } else {
            const dropped_pieces = sword.pieces.map(
                piece => piece.drop()
            ).filter(piece => piece.count > 0);

            dropped_pieces.forEach(piece => Game.inventoryManager.save(piece));

            if(Math.random() < Game.statManager.calculate(StatID.INVALIDATED_SPHERE)/100 ) {
                this.upgradeSword(0);

                Game.inventoryManager.saveMoney(sword.cost, {
                    type: ContextType.SWORD_RESTORE,
                    name: sword.name,
                    cost: sword.cost
                });

                return {result: SwordTestResult.FAIL_BUT_INVALIDATED, result_index: this.current_sword_index, dropped_pieces: dropped_pieces};

            } else return {result: SwordTestResult.FAIL, result_index: this.current_sword_index, dropped_pieces: dropped_pieces, sword: sword};

        }

    }
}
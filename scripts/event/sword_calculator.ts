import { StatID, StatManager } from "../manager/stat_manager";
import { SwordManager } from "../manager/sword_manager";
import { Piece, Sword } from "../other/entity";
import { SwordDB } from "../other/sword_db";

export class SwordCalculator {

    constructor(
        protected readonly _swordDB: SwordDB,
        protected readonly _swordManager: SwordManager,
        protected readonly _statManager: StatManager
    ) {}

    public getCalculatedSwordbyId(id: string): Sword {
        const sword = this._swordDB.getSwordById(id);
        return new Sword(
            sword.id,
            sword.index,
            sword.name,
            sword.imgSrc,
            this._statManager.calculate(StatID.LUCKY_BRACELET, sword.prob),
            this._statManager.calculate(StatID.SMITH, sword.cost),
            this._statManager.calculate(StatID.BIG_MERCHANT, sword.price),
            sword.requiredRepairs,
            sword.canSave,
            sword.pieces.map(piece => new Piece(piece.id, piece.name, piece.imgSrc, piece.prob, this._statManager.calculate(StatID.MAGIC_HAT, piece.maxDrop)))
        );
    }

    public getCalculatedSwordbyIndex(index: number): Sword {
        const sword = this._swordDB.getSwordByIndex(index);
        return new Sword(
            sword.id,
            sword.index,
            sword.name,
            sword.imgSrc,
            this._statManager.calculate(StatID.LUCKY_BRACELET, sword.prob),
            this._statManager.calculate(StatID.SMITH, sword.cost),
            this._statManager.calculate(StatID.BIG_MERCHANT, sword.price),
            sword.requiredRepairs,
            sword.canSave,
            sword.pieces.map(piece => new Piece(piece.id, piece.name, piece.imgSrc, piece.prob, this._statManager.calculate(StatID.MAGIC_HAT, piece.maxDrop)))
        );
    }

    public calculateLoss(index: number): number {
        let sum = 0;
        for(let i = 0; i <= index; i++) {
            sum += this._statManager.calculate(StatID.SMITH, this._swordDB.getSwordByIndex(index).cost);
        }

        return sum;
    }
    
}
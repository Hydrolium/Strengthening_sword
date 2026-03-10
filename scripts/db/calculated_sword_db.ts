import { StatID, StatManager } from "../manager/stat_manager";
import { SwordManager } from "../manager/sword_manager";
import { Piece, Sword, SwordInfoByPiece, SwordItem } from "../other/entity";
import { SwordDB } from "./sword_db";

export class CalculatedSwordDB {

    constructor(
        private readonly _swordDB: SwordDB,
        protected readonly _swordManager: SwordManager,
        protected readonly _statManager: StatManager
    ) {}

    public readonly maxUpgradableIndex = this._swordDB.maxUpgradableIndex;

    public getCalculatedSword(sword: Sword): Sword {
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

    public getCalculatedSwordbyId(id: string): Sword {
        return this.getCalculatedSword(this._swordDB.getSwordById(id));
    }

    public getCalculatedSwordbyIndex(index: number): Sword {
        return this.getCalculatedSword(this._swordDB.getSwordByIndex(index));
    }

    public calculateLoss(index: number): number {
        let sum = 0;
        for(let i = 0; i <= index; i++) {
            sum += this._statManager.calculate(StatID.SMITH, this._swordDB.getSwordByIndex(i).cost);
        }

        return sum;
    }
    
    public getCalculatedSwordsByPieceId(pieceId: string): readonly SwordInfoByPiece[] {
        return this._swordDB.getSwordsByPieceId(pieceId).map(
            swordInfo =>
                new SwordInfoByPiece(
                    swordInfo.id,
                    swordInfo.index,
                    swordInfo.name,
                    swordInfo.imgSrc,
                    this._statManager.calculate(StatID.LUCKY_BRACELET, swordInfo.prob),
                    this._statManager.calculate(StatID.MAGIC_HAT, swordInfo.maxDrop)
                ));
    }
}
import { StatID, StatManager } from "../manager/stat_manager";
import { Piece } from "./object/piece";
import { SwordInfoByPiece } from "./object/sword";
import { Sword } from "./object/sword";
import { DeveloperMode } from "./developer_mode";

export class CalculatedSwordDB {
    private readonly _swords: readonly Sword[];

    public readonly swordCount: number;
    private readonly _pieceInfos: ReadonlyMap<String, readonly SwordInfoByPiece[]>;

    public readonly maxUpgradableIndex: number;

    public get swords(): readonly Sword[] {
        return this._swords;
    }

    constructor(
        swords: readonly Sword[] | undefined,
        private readonly _statManager: StatManager,
        private readonly _developerMode: DeveloperMode
    ) {

        this._swords = swords ?? [];

        this.maxUpgradableIndex = this._swords.length -1;
        this.swordCount = this._swords.length;

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

    public getIndexById(id: string): number {
        const res = this._swords.findIndex(sword => sword.id == id);
        if(res === -1) throw new Error(`Sword with ID ${id} not found.`);
        return res;
    }

    public getIdByIndex(index: number): string {
        return this._swords[index].id;
    }

    private getSwordsByPieceId(pieceId: string): readonly SwordInfoByPiece[] {
        return this._pieceInfos.get(pieceId) ?? [];
    }

    private getSwordById(id: string): Sword {
        const res = this._swords.find(sword => sword.id == id)
        if(res === undefined) throw new Error(`Sword with ID ${id} not found.`);
        return res;
    }

    public getCalculatedSword(sword: Sword): Sword {
        return new Sword(
            sword.id,
            sword.index,
            sword.name,
            sword.imgSrc,
            (this._developerMode.alwaysSuccess) ? 1 : this._statManager.calculate(StatID.LUCKY_BRACELET, sword.prob),
            this._statManager.calculate(StatID.SMITH, sword.cost),
            this._statManager.calculate(StatID.BIG_MERCHANT, sword.price),
            sword.requiredRepairs,
            sword.canSave,
            sword.pieces.map(piece => new Piece(piece.id, piece.name, piece.imgSrc, piece.prob, this._statManager.calculate(StatID.MAGIC_HAT, piece.maxDrop)))
        );
    }

    public getCalculatedSwordbyId(id: string): Sword {
        return this.getCalculatedSword(this.getSwordById(id));
    }

    public getCalculatedSwordbyIndex(index: number): Sword {
        return this.getCalculatedSword(this._swords[index]);
    }

    public calculateLoss(index: number): number {
        let sum = 0;
        for(let i = 0; i <= index; i++) {
            sum += this._statManager.calculate(StatID.SMITH, this._swords[i].cost);
        }

        return sum;
    }
    
    public getCalculatedSwordsByPieceId(pieceId: string): readonly SwordInfoByPiece[] {
        return this.getSwordsByPieceId(pieceId).map(
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
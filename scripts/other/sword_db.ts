import { Sword, SwordInfoByPiece } from "./entity";

export class SwordDB {
    private readonly _swords: readonly Sword[];

    public readonly swordCount: number;
    private readonly _pieceInfos: ReadonlyMap<String, readonly SwordInfoByPiece[]>;

    public readonly maxUpgradableIndex: number;

    public get swords(): readonly Sword[] {
        return this._swords;
    }

    constructor(swords?: readonly Sword[]) {

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


    public getSwordsByPieceId(pieceId: string): readonly SwordInfoByPiece[] {
        return this._pieceInfos.get(pieceId) ?? [];
    }

    public getSwordById(id: string): Sword {
        const res = this._swords.find(sword => sword.id == id)
        if(res === undefined) throw new Error(`Sword with ID ${id} not found.`);
        return res;
    }

    public getSwordByIndex(index: number): Sword {
        return this._swords[index];
    }

    public getIndexById(id: string): number {
        return this._swords.indexOf(this.getSwordById(id));
    }
}
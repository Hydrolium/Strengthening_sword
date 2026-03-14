import { SwordItem } from "./item";
import { Piece } from "./piece";


export class Sword {
    constructor(
        public readonly id: string,
        public readonly index: number,
        public readonly name: string,
        public readonly imgSrc: string,
        public readonly description: string, 
        public readonly prob: number,
        public readonly cost: number,
        public readonly price: number,
        public readonly requiredRepairs: number,
        public readonly canSave: boolean,
        public readonly pieces: ReadonlyArray<Piece>) { }

    public toItem(): SwordItem {
        return new SwordItem(this.id, this.name, this.imgSrc, this.description, 1);
    }
}

// 이거 인터페이스로 만들까
export class SwordInfoByPiece {
    constructor(
        public readonly id: string,
        public readonly index: number,
        public readonly name: string,
        public readonly imgSrc: string,

        public readonly prob: number,
        public readonly maxDrop: number
    ) { }
}


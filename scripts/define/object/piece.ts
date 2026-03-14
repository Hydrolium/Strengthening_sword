import { PieceItem } from "./item";

export class Piece {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly imgSrc: string,
        public readonly description: string,
        public readonly prob: number,
        public readonly maxDrop: number = 1) { }

    public drop(): PieceItem {
        if (Math.random() < this.prob) return new PieceItem(this.id, this.name, this.imgSrc, Math.floor(Math.random() * this.maxDrop + 1));
        return new PieceItem(this.id, this.name, this.imgSrc, 0);
    }
}

import { Card } from "./card";

export class CardModel {
    private card;

    constructor(card: Card) {
        this.card = card;
    }

    getCard(): Card {
        return Object.assign({}, this.card);
    }
}
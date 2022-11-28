import { Card } from "../types";
import { CardModel } from "../card/card.model";
import { CardView } from "../card/card.view";

export class CardComponent {
    constructor(container: HTMLElement | null, card: Card) {
        if(!container) {
            throw new Error('CardComponent container is not defined');
        }

        const model = new CardModel(card);
        const view = new CardView(model, container);
    }
}
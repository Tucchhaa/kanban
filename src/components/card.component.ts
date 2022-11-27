import { Card } from "../card/card";
import { CardModel } from "../card/card.model";
import { CardView } from "../card/card.view";

export class CardComponent {
    constructor(container: HTMLElement | null, card: Card) {
        if(!container) {
            throw new Error('column container is not defined');
        }

        const model = new CardModel(card);
        const view = new CardView(model, container);
    }
}
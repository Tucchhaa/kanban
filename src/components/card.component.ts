import { Card } from "../types";
import { CardModel } from "../card/card.model";
import { CardView } from "../card/card.view";
import { BaseComponent } from "../base/component";

export class CardComponent extends BaseComponent<Card, CardModel, CardView, object> {
    constructor(container: HTMLElement | null, card: Card) {
        super('Card', CardModel, CardView, CardController, container, card);
    }
}

class CardController {
    constructor(model: CardModel, view: CardView) {

    }
}
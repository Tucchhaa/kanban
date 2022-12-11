import { Card, CardOptions } from "../types";
import { CardState } from "../card/card.state";
import { CardView } from "../card/card.view";
import { BaseComponent } from "../base/component";
import { DragController } from "../drag-drop/drag.controller";
import { BaseController } from "../base/controller";

export class CardComponent extends BaseComponent<CardOptions, CardState, CardView, BaseController> {
    constructor(container: HTMLElement | null, card: Card) {
        const cardStateOptions = new CardOptions(card);
        super('Card', CardState, CardView, container, cardStateOptions, CardController);
        
        this.registerController(() => new DragController(this.state, this.container));
    }
}

class CardController extends BaseController {
    constructor(state: CardState, view: CardView) {
        super();
    }
}
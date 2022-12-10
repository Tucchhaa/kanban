import { Card } from "../types";
import { CardModel } from "../card/card.model";
import { CardView } from "../card/card.view";
import { BaseComponent } from "../base/component";
import { DragController } from "../drag-drop/drag.controller";
import { BaseController } from "../base/controller";

export class CardComponent extends BaseComponent<Card, CardModel, CardView, BaseController> {
    constructor(container: HTMLElement | null, card: Card) {
        super('Card', CardModel, CardView, container, card, CardController);
        
        this.registerController(() => new DragController(this.view, this.container));
    }
}

class CardController extends BaseController {
    constructor(model: CardModel, view: CardView) {
        super();
    }
}
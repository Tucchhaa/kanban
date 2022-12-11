import { Card } from "../types";
import { CardOptions, CardState } from "../card/card.state";
import { CardView } from "../card/card.view";
import { BaseComponent } from "../base/component";
import { DragController } from "../drag-drop/drag.controller";
import { BaseController } from "../base/controller";

export class CardComponent extends BaseComponent<CardOptions, CardState, CardView, BaseController> {
    constructor(container: HTMLElement | null, cardOptions: CardOptions) {
        super('Card', CardState, CardView, container, cardOptions, CardController);
        
        this.registerController(() => new DragController(this.state.card, this.container));
    }
}

class CardController extends BaseController {
    constructor(state: CardState, view: CardView) {
        super();
    }
}
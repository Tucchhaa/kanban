import { Card } from "../types";
import { CardOptions, CardState } from "../card/card.state";
import { CardView } from "../card/card.view";
import { BaseComponent } from "../base/component";
import { DragController } from "../drag-drop/drag.controller";
import { BaseController } from "../base/controller";
import { DragState } from "../drag-drop/drag.state";

export class CardComponent extends BaseComponent<CardOptions, CardState, CardView> {
    constructor(container: HTMLElement | null, cardOptions: CardOptions) {
        super('Card', CardState, CardView, container, cardOptions, CardController);
        
        this.registerState(() => new DragState({
            draggableArea: this.container
        }));
        this.registerController(() => new DragController<Card>(this.state.card));
        
        super.render();
    }
}

class CardController extends BaseController {
    constructor(state: CardState, view: CardView) {
        super();
    }
}
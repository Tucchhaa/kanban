import { Card } from "../types";
import { CardOptions, CardState } from "../card/card.state";
import { CardView } from "../card/card.view";
import { BaseComponent } from "../base/component";
import { DragController } from "../drag-drop/drag.controller";
import { BaseController } from "../base/controller";
import { DragState } from "../drag-drop/drag.state";
import { DragView } from "../drag-drop/drag.view";

export class CardComponent extends BaseComponent<CardOptions, CardState, CardView> {
    constructor(container: HTMLElement | null, cardOptions: CardOptions) {
        super('Card', CardState, CardView, container, cardOptions);
        
        this.registerController(() => new CardController());

        this.registerState(() => new DragState());
        this.extendView(() => new DragView());
        this.registerController(() => new DragController<Card>(this.state.card));
        
        super.render();
    }
}

class CardController extends BaseController {
    constructor() {
        super();
    }
}
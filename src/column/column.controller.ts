import { BaseController } from "../base/controller";
import { Card } from "../types";
import { ColumnState } from "./column.state";
import { ColumnView } from "./column.view";

export class ColumnController extends BaseController {
    private state: ColumnState;
    private view: ColumnView;
    
    constructor(state: ColumnState, view: ColumnView) {
        super();

        this.state = state;
        this.view = view;
        
        this.eventEmitter.on('create-new-card', (cardName: string) => this.createNewCard(cardName));
        this.eventEmitter.on('update-items-order', (cards: Card[]) => this.updateCardsOrder(cards))
    }

    private createNewCard(cardName: string) {   
        this.state.createCard(cardName);
        this.state.onUpdateColumn(this.state.column);
    }

    private updateCardsOrder(cards: Card[]) {
        this.state.updateCards(cards);
        this.eventEmitter.emit('items-updated', this.state.columnCards);
    }
}
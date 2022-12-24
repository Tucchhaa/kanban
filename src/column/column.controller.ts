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
        
        this.eventEmitter
            .on('change-column-name', (newName: string) => this.changeColumnName(newName))
            .on('create-new-card', (cardName: string) => this.createNewCard(cardName))
            .on('update-items-order', (cards: Card[]) => this.updateCardsOrder(cards));
    }

    private changeColumnName(newName: string) {
        this.state.updateBy(state => {
            state.column!.name = newName;
        }, true);

        this.eventEmitter.emit('column-updated', this.state.column);
    }

    private createNewCard(cardName: string) {
        this.state.addCard(new Card(cardName));

        this.eventEmitter.emit('column-updated', this.state.column);
        this.eventEmitter.emit('items-updated', this.state.columnCards);
    }

    private updateCardsOrder(cards: Card[]) {
        this.eventEmitter.emit('items-updated', this.state.columnCards);

        this.state.updateCards(cards);
        
        this.eventEmitter.emit('column-updated', this.state.column);
    }
}
import { BaseController } from "../base/controller";
import { Card } from "../types";
import { ColumnState } from "./column.state";
import { ColumnView } from "./column.view";

export class ColumnController extends BaseController<ColumnState, ColumnView> {
    constructor() {
        super();
        
        this.eventEmitter
            .on('change-column-name', this.onChangeColumnName.bind(this))
            .on('create-new-card', this.onCreateNewCard.bind(this))
            .on('update-card', this.onUpdateCard.bind(this))
            .on('update-items-order', this.onUpdateCardsOrder.bind(this));
    }

    private onChangeColumnName(newName: string) {
        this.state.updateByKey('column.name', newName);

        this.eventEmitter.emit('update-column', this.state.column);
    }

    private onCreateNewCard(cardName: string) {
        this.state.createCard(new Card(cardName));
        this.eventEmitter.emit('render');

        this.eventEmitter.emit('update-column', this.state.column);
    }

    private onUpdateCard(card: Card) {
        this.state.updateCard(card.id, card);

        this.eventEmitter.emit('update-column', this.state.column);
    }

    private onUpdateCardsOrder(cards: Card[]) {
        this.state.updateCards(cards);
        this.eventEmitter.emit('render');
        
        this.eventEmitter.emit('update-column', this.state.column);
    }
}
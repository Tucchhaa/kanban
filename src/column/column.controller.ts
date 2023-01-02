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
        this.state.updateBy(state => {
            state.column!.name = newName;
        }, false);

        this.eventEmitter.emit('update-column', this.state.column);
    }

    private onCreateNewCard(cardName: string) {
        this.state.addCard(new Card(cardName));

        this.eventEmitter.emit('update-column', this.state.column);
    }

    private onUpdateCard(card: Card) {
        this.state.updateBy(state => {
            const cardIndex = state.column!.cards.findIndex((_card) => _card.id === card.id);
            state.column!.cards[cardIndex] = card;
        }, false);

        this.eventEmitter.emit('update-column', this.state.column);
    }

    private onUpdateCardsOrder(cards: Card[]) {
        this.state.updateCards(cards);
        
        this.eventEmitter.emit('update-column', this.state.column);
    }
}
import { BaseController } from "../base/controller";
import { StateChange } from "../base/state";
import { isDeepEqual } from "../helpers";
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

    public stateChanged(change: StateChange): void {
        switch(change.name) {
            case 'column.name':
                break;

            case 'column.cards':
                const previousOrder = change.previousValue.map((card: Card) => card.id);
                const currentOrder = change.value.map((card: Card) => card.id);

                const isOrderChanged = !isDeepEqual(previousOrder, currentOrder); 

                if(isOrderChanged)
                    this.render();

                break;

            default:
                this.render();
        }
        this.eventEmitter.emit('update-column', this.state.column);
    }

    private onChangeColumnName(newName: string) {
        this.state.updateByKey('column.name', newName);
    }

    private onCreateNewCard(cardName: string) {
        this.state.createCard(new Card(cardName));
    }

    private onUpdateCard(card: Card) {
        this.state.updateCard(card.id, card);
    }

    private onUpdateCardsOrder(cards: Card[]) {
        this.state.updateCards(cards);
    }
}
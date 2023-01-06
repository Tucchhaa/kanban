import { BaseController } from "../base/controller";
import { StateChange } from "../base/state";
import { DropController } from "../drag-drop/drop.controller";
import { isDeepEqual } from "../helpers";
import { Card } from "../types";
import { smoothScroll } from "../utils/smooth-scroll";
import { ColumnState } from "./column.state";
import { ColumnView } from "./column.view";

export class ColumnController extends BaseController<ColumnState, ColumnView> {
    constructor() {
        super();
        
        this.eventEmitter
            .on('change-column-name', this.onChangeColumnName.bind(this))
            
            .on('create-new-card', this.onCreateNewCard.bind(this))
            .on('delete-card', this.onDeleteCard.bind(this))
            .on('add-card-field-opened', this.onAddCardFieldOpened.bind(this))

            .on('update-card', this.onUpdateCard.bind(this))
            .on('update-items-order', this.onUpdateCardsOrder.bind(this));
    }

    public stateChanged(change: StateChange): void {
        switch(change.name) {
            case 'column.name':
                break;

            case 'column.cards':
                if(change.value.length !== change.previousValue.length) {
                    const cardsContainer = this.view.getElementContainer('cards');
                    const { scrollTop } = cardsContainer;
                
                    this.getRequiredController(DropController.name).clear();
                    this.view.renderElement('cards');

                    cardsContainer.scrollTop = scrollTop;
                }
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

    private onDeleteCard(card: Card) {
        console.log(card);
        this.state.deleteCard(card);
    }

    private onAddCardFieldOpened() {
        const cardsContainer = this.view.getElementContainer('cards');

        smoothScroll(cardsContainer, { time: 500, speedY: 30 });
    }

    private onUpdateCard(card: Card) {
        console.log('daupte')
        this.state.updateCard(card.id, card);
    }

    private onUpdateCardsOrder(cards: Card[]) {
        this.state.updateCards(cards);
    }
}
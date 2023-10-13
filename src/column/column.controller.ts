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

            .on('disable-column-drag', this.onDisableColumnDrag.bind(this))
            .on('enable-column-drag', this.onEnableColumnDrag.bind(this))
            .on('update-toolbar-state', this.onUpdateToolbarState.bind(this))

            .on('delete-column-confirmed', this.onDeleteColumnConfirmed.bind(this))
            
            .on('create-new-card', this.onCreateNewCard.bind(this))
            .on('delete-card', this.onDeleteCard.bind(this))
            .on('add-card-field-opened', this.onAddCardFieldOpened.bind(this))

            .on('update-card', this.onUpdateCard.bind(this))
            .on('update-items-order', this.onUpdateCardsOrder.bind(this))
    }

    public stateChanged(change: StateChange): void {
        switch(change.name) {
            case 'toolbarState':
                this.view.renderElement('heading');
                break;

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

    private onDisableColumnDrag() {
        this.view.draggableAreaElement!.style.cursor = 'default';
        this.eventEmitter.emit('disable-drag');
    }

    private onEnableColumnDrag() {
        this.view.draggableAreaElement!.style.removeProperty('cursor');
        this.eventEmitter.emit('enable-drag');
    }

    private onUpdateToolbarState(toolbarState: 'default' | 'delete-prompt') {
        this.state.updateByKey('toolbarState', toolbarState);
    }

    private onDeleteColumnConfirmed() {
        this.eventEmitter.emit('delete-column', this.state.column);
    }

    private onCreateNewCard(cardName: string) {
        this.state.createCard(new Card(cardName));
    }

    private onDeleteCard(card: Card) {
        this.state.deleteCard(card);
    }

    private onAddCardFieldOpened() {
        const cardsContainer = this.view.getElementContainer('cards');

        smoothScroll(cardsContainer, { time: 500, speedY: 30 });
    }

    private onUpdateCard(card: Card) {
        this.state.updateCard(card.id, card);
    }

    private onUpdateCardsOrder(cards: Card[]) {
        this.state.updateCards(cards);
    }
}
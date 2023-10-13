import { CardComponent } from "../components/card.component";
import { ColumnState } from "./column.state";
import { EditableFieldComponent } from "../components/editable-field.component";
import { EditableFieldOptions } from "../editable-field/editable-field.state";
import { CardOptions } from "../card/card.state";
import { BaseView } from "../base/view";
import { Icon } from "../utils/icons";
import { cardNameValidation, columnNameValidation } from "../utils/validation";
import { concatClasses, trim } from "../helpers";
import { Card, ClassList } from "../types";

export class ColumnView extends BaseView<ColumnState> {
    public draggableAreaElement?: HTMLElement;

    public dropContainer?: HTMLElement;
    public dragElement?: HTMLElement;
    public dragWrapperElement?: HTMLElement;

    constructor(classes?: ClassList) {
        super(concatClasses(classes, 'column-wrapper'));
    }

    protected _render(fragment: DocumentFragment): void {
        const columnContainer = this.createDOMElement('div', 'column');

        columnContainer.append(
            this.createRenderElement('heading', this.createDOMElement('div', 'heading'), this.renderHeading.bind(this)),
            this.createRenderElement('cards', this.createDOMElement('div', 'cards'), this.renderCards.bind(this)),
            this.createRenderElement('add-card', this.createDOMElement('div', 'add-card'), this.renderAddCard.bind(this)),
        );

        this.dragWrapperElement = this.container;
        this.dragElement = columnContainer;

        fragment.append(columnContainer);
    }

    private renderHeading(container: HTMLElement) {
        this.draggableAreaElement = container;

        const options: EditableFieldOptions = {
            value: this.state.column.name,
            placeholder: 'Column\'s name',

            submitOnOutsideClick: true,
            resetValueOnClosed: false,

            buttonsTemplate: () => { return undefined; },
            
            prepareValue: trim,
            validation: columnNameValidation,
            
            onSubmit: (value: string) => this.eventEmitter.emit('change-column-name', value),
            onOpened: () => this.eventEmitter.emit('disable-drag'),
            onClosed: () => this.eventEmitter.emit('enable-drag')
        };
        this.createComponent(container, EditableFieldComponent, options, 'heading-field');
    }

    private renderCards(container: HTMLElement) {
        this.dropContainer = container;

        for(const card of this.state.column.cards) {
            const cardContainer = this.createDOMElement('div');

            const cardOptions: CardOptions = { card };
            const cardCompoment = this.createComponent(cardContainer, CardComponent, cardOptions, `card${card.id}`);

            // ===

            cardCompoment.eventEmitter.on('drag-start', () => this.eventEmitter.emit('card-drag-start'));
            cardCompoment.eventEmitter.on('drag-end',   () => this.eventEmitter.emit('card-drag-end'));

            // ===
            cardCompoment.eventEmitter.on('update-card', (card: Card) => this.eventEmitter.emit('update-card', card));
            cardCompoment.eventEmitter.on('delete-card', (card: Card) => this.eventEmitter.emit('delete-card', card));

            setTimeout(() => this.eventEmitter.emit('process-drag', cardCompoment));
            
            container.appendChild(cardContainer);
        }
    }

    private renderAddCard(container: HTMLElement) {
        const options: EditableFieldOptions = {
            title: '+ Add new card',
            placeholder: 'Enter new card\'s name',

            submitBtnContent: this.getAddCardSubmitBtnContent(),
            cancelBtnContent: this.getAddCardCancelBtnContent(),

            prepareValue: trim,
            validation: cardNameValidation,

            onSubmit: (value: string) => this.eventEmitter.emit('create-new-card', value),
            onOpened: () => this.eventEmitter.emit('add-card-field-opened'),
        };
        this.createComponent(container, EditableFieldComponent, options, 'add-card-field');
    }

    private getAddCardSubmitBtnContent() {
        const content = this.createDOMElement('span');
        content.innerText = 'create';
        
        return content;
    }

    private getAddCardCancelBtnContent() {
        const content = this.createDOMElement('span');
        content.append(Icon.cross);
        
        return content;
    }
}
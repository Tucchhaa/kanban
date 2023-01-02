import { Card } from "../types";
import { CardComponent } from "../components/card.component";
import { ColumnState } from "./column.state";
import { EditableFieldComponent } from "../components/editable-field.component";
import { EditableFieldOptions } from "../editable-field/editable-field.state";
import { CardOptions } from "../card/card.state";
import { BaseView } from "../base/view";
import { Icon } from "../utils/icons";
import { cardNameValidation, columnNameValidation } from "../utils/validation";
import { trim } from "../helpers";

export class ColumnView extends BaseView<ColumnState> {
    public draggableAreaElement?: HTMLElement;
    public dragsContainer?: HTMLElement;

    constructor() {
        super('kanban-column');
    }

    protected _render(fragment: DocumentFragment): void {
        this.renderHeading(fragment, this.state.column.name);
        this.renderContent(fragment, this.state.column.cards);
        this.renderAddCard(fragment);
    }

    private renderHeading(fragment: DocumentFragment, text: string) {
        const headingContainer = this.createDOMElement('div', 'heading');

        const options: EditableFieldOptions = {
            value: text,
            placeholder: 'Column\'s name',

            submitOnOutsideClick: true,
            resetValueOnClosed: false,

            buttonsTemplate: (close: () => void, submit: () => void) => { return undefined; },
            
            prepareValue: trim,
            validation: columnNameValidation,
            
            onSubmit: (value: string) => this.eventEmitter.emit('change-column-name', value),
            onOpened: () => this.eventEmitter.emit('disable-drag'),
            onClosed: () => this.eventEmitter.emit('enable-drag')
        };
        this.createComponent(headingContainer, EditableFieldComponent, options, 'heading-field');
        
        this.draggableAreaElement = headingContainer;

        fragment.appendChild(headingContainer);
    }

    private renderContent(fragment: DocumentFragment, cards: Card[]) {
        const content = this.createDOMElement('div', 'content');

        for(let index = 0; index < cards.length; index++) {
            const card = cards[index];
            const cardContainer = this.createDOMElement('div');

            const cardOptions: CardOptions = { card };
            const cardCompoment = this.createComponent(cardContainer, CardComponent, cardOptions, `card${card.id}`);

            setTimeout(() => this.eventEmitter.emit('process-shared-drag', cardCompoment));
            setTimeout(() => this.eventEmitter.emit('process-drag', cardCompoment));
            
            content.appendChild(cardContainer);
        }

        this.dragsContainer = content;
        fragment.appendChild(content);
    }

    private renderAddCard(fragment: DocumentFragment) {
        const addCardContainer = this.createDOMElement('div', 'add-card');

        const options: EditableFieldOptions = {
            title: '+ Add new card',
            placeholder: 'Enter new card\'s name',

            submitBtnContent: 'create',
            cancelBtnContent: Icon.cross.outerHTML,

            prepareValue: trim,
            onSubmit: (value: string) => this.eventEmitter.emit('create-new-card', value),
            validation: cardNameValidation
        };
        this.createComponent(addCardContainer, EditableFieldComponent, options, 'add-card-field');
        
        fragment.append(addCardContainer);
    }
}
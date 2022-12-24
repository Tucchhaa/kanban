import { Card } from "../types";
import { CardComponent } from "../components/card.component";
import { ColumnState } from "./column.state";
import { EditableFieldComponent } from "../components/editable-field.component";
import { DropView } from "../drag-drop/drop.view";
import { EditableFieldOptions } from "../editable-field/editable-field.state";
import { CardOptions } from "../card/card.state";

export class ColumnView extends DropView<ColumnState> {
    private _draggableArea?: HTMLElement;

    public get draggableArea() {
        return this._draggableArea!;
    }

    constructor(state: ColumnState) {
        super(state, 'kanban-column');
    }

    protected _render(fragment: DocumentFragment): void {
        this.renderHeading(fragment, this.state.column.name!);
        this.renderContent(fragment, this.state.columnCards);
        this.renderAddCard(fragment);
    }

    private renderHeading(fragment: DocumentFragment, text: string) {
        const headingContainer = this.createDOMElement('div', 'heading');

        const options: EditableFieldOptions = {
            title: text,
            defaultValue: text,
            placeholder: text,

            submitOnOutsideClick: true,
            buttonsTemplate: (close: () => void, submit: () => void) => { return undefined; },
            
            prepareValue: (value: string) => value.trim().replace(/\s\s+/g, ' '),
            onSubmit: (value: string) => this.eventEmitter.emit('change-column-name', value),
            validation: (value: string) => {
                if(value.length === 0)
                    return [false, 'Column name can\'t be empty'];
                
                if(value.length > 40)
                    return [false, 'Column name is too long'];

                return [true, ''];
            }
        };
        this.createComponent(headingContainer, EditableFieldComponent, options, 'heading-field');
        
        this._draggableArea = headingContainer;

        fragment.appendChild(headingContainer);
    }

    private renderContent(fragment: DocumentFragment, cards: Card[]) {
        const content = this.createDOMElement('div', 'content');

        for(let index = 0; index < cards.length; index++) {
            const card = cards[index];
            const cardContainer = this.createDOMElement('div');

            const cardOptions: CardOptions = { card };
            const cardCompoment = this.createComponent(cardContainer, CardComponent, cardOptions, `card${index}`);

            setTimeout(() => this.eventEmitter.emit('process-drag', cardCompoment));
            
            content.appendChild(cardContainer);
        }

        fragment.appendChild(content);
    }

    private renderAddCard(fragment: DocumentFragment) {
        const addCardContainer = this.createDOMElement('div', 'add-card');

        const options: EditableFieldOptions = {
            title: '+ Add new card',
            placeholder: 'Enter new card\'s name',

            prepareValue: (value: string) => value.trim().replace(/\s\s+/g, ' '),
            onSubmit: (value: string) => this.eventEmitter.emit('create-new-card', value),
            validation: (value: string) => {
                if(value.length === 0)
                    return [false, 'Card name can\'t be empty'];
                
                if(value.length > 120)
                    return [false, 'Card name is too long'];

                return [true, ''];
            }
        };
        this.createComponent(addCardContainer, EditableFieldComponent, options, 'add-card-field');
        
        fragment.append(addCardContainer);
    }
}
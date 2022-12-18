import { Card } from "../types";
import { CardComponent } from "../components/card.component";
import { ColumnState } from "./column.state";
import { EditableFieldComponent } from "../components/editable-field.component";
import { DroppableView } from "../drag-drop/drop.view";
import { EditableFieldOptions } from "../editable-field/editable-field.state";
import { CardOptions } from "../card/card.state";

export class ColumnView extends DroppableView<ColumnState> {
    constructor(state: ColumnState) {
        super(state, 'kanban-column');
    }

    protected render(fragment: DocumentFragment): void {
        this.renderHeading(fragment, this.state.column.name!);
        this.renderContent(fragment, this.state.columnCards);
        this.renderAddCard(fragment);
    }

    private renderHeading(fragment: DocumentFragment, text: string) {
        const heading = this.createDOMElement('div', 'heading');
        
        heading.innerText = text;

        fragment.appendChild(heading);
    }

    private renderContent(fragment: DocumentFragment, cards: Card[]) {
        const content = this.createDOMElement('div', 'content');

        for(let index = 0; index < cards.length; index++) {
            const card = cards[index];
            const cardContainer = this.createDOMElement('div');

            const cardOptions: CardOptions = { card };
            const cardCompoment = this.createComponent(cardContainer, CardComponent, cardOptions, `card${index}`);

            setTimeout(() => this.eventEmitter.emit('draggable-rendered', cardCompoment));
            
            content.appendChild(cardContainer);
        }

        fragment.appendChild(content);
    }

    private renderAddCard(fragment: DocumentFragment) {
        const addCardContainer = this.createDOMElement('div', 'add-card');

        const options: EditableFieldOptions = {
            btnText: '+ Add new card',
            placeholder: 'Enter new card\'s name',
            onSubmit: (value: string) => this.eventEmitter.emit('create-new-card', value),
            validation: (value: string) => {
                if(value.length === 0)
                    return [false, 'Card name can\'t be empty'];
                
                if(value.length > 40)
                    return [false, 'Card name is too long'];

                return [true, ''];
            }
        };
        this.createComponent(addCardContainer, EditableFieldComponent, options, 'add-card-field');
        
        fragment.append(addCardContainer);
    }
}
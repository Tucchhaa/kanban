import { Card, EditableFieldOptions } from "../types";
import { CardComponent } from "../components/card.component";
import { ColumnModel } from "./column.model";
import { EditableFieldComponent } from "../components/editable-field.component";
import { DroppableView } from "../drag-drop/drop.view";

export class ColumnView extends DroppableView<ColumnModel> {
    constructor(model: ColumnModel, container: HTMLElement) {
        super(model, container, 'kanban-column');
    }

    protected render(fragment: DocumentFragment): void {
        this.renderHeading(fragment, this.model.name);
        this.renderContent(fragment, this.model.cards);
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

            const cardCompoment = this.createComponent(cardContainer, CardComponent, card, `card${index}`);
            this.eventEmitter.emit('draggable-rendered', cardCompoment);
            
            content.appendChild(cardContainer);
        }

        fragment.appendChild(content);
    }

    private renderAddCard(fragment: DocumentFragment) {
        const addCardContainer = this.createDOMElement('div', 'add-card');

        const options = Object.assign(new EditableFieldOptions(), {
            btnText: '+ Add new card',
            placeholder: 'Enter new card\'s name',
            onSubmit: (value: string) => this.eventEmitter.emit('create-new-card', value),
            validation: (value: string) => {
                if(value.length === 0)
                    return [false, 'Card name can\'t be empty'];
                
                if(value.length > 40)
                    return [false, 'Card name is too long'];

                return [true];
            }
        });
        this.createComponent(addCardContainer, EditableFieldComponent, options, 'add-card-field');
        
        fragment.append(addCardContainer);
    }
}
import { BaseView } from "../base/view";
import { Card, EditableFieldOptions } from "../types";
import { CardComponent } from "../components/card.component";
import { ColumnModel } from "./column.model";
import { EditableFieldComponent } from "../components/editable-field.component";

class Droppable {
    
}

export class ColumnView extends BaseView<ColumnModel> {
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

        for(const card of cards) {
            const cardContainer = this.createDOMElement('div');

            new CardComponent(cardContainer, card);

            content.appendChild(cardContainer);
        }

        fragment.appendChild(content);
    }

    private renderAddCard(fragment: DocumentFragment) {
        const addCardContainer = this.createDOMElement('div', 'add-card');

        const options = Object.assign(new EditableFieldOptions(), {
            btnText: '+ Add new card',
            placeholder: 'Enter new card\'s name',
            onSubmit: (value: string) => this.emit('create-new-card', value),
            validation: (value: string) => {
                if(value.length === 0)
                    return [false, 'Card name can\'t be empty'];
                
                if(value.length > 40)
                    return [false, 'Card name is too long'];

                return [true];
            }
        });
        new EditableFieldComponent(addCardContainer, options);
        
        fragment.append(addCardContainer);
    }
}
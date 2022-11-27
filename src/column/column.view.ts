import { BaseView } from "../base/view";
import { Card } from "../card/card";
import { CardComponent } from "../components/card.component";
import { ColumnModel } from "./column.model";

export class ColumnView extends BaseView<ColumnModel> {
    constructor(model: ColumnModel, container: HTMLElement) {
        super(model, container, 'kanban-column');
    }

    protected _render(fragment: DocumentFragment): void {
        const column = this.model.getColumn();
        
        this.renderHeading(fragment, column.name);
        this.renderContent(fragment, column.cards);
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
}
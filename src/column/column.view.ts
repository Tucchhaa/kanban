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
        fragment.append(
            this.createRenderElement('heading', this.createDOMElement('div', 'heading'), this.renderHeading.bind(this)),
            this.createRenderElement('content', this.createDOMElement('div', 'content'), this.renderContent.bind(this)),
            this.createRenderElement('add-card', this.createDOMElement('div', 'add-card'), this.renderAddCard.bind(this)),
        );
    }

    private renderHeading(container: HTMLElement) {
        this.draggableAreaElement = container;

        const options: EditableFieldOptions = {
            value: this.state.column.name,
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
        this.createComponent(container, EditableFieldComponent, options, 'heading-field');
    }

    private renderContent(container: HTMLElement) {
        this.dragsContainer = container;

        for(const card of this.state.column.cards) {
            const cardContainer = this.createDOMElement('div');

            const cardOptions: CardOptions = { card };
            const cardCompoment = this.createComponent(cardContainer, CardComponent, cardOptions, `card${card.id}`);

            setTimeout(() => this.eventEmitter.emit('process-drag', cardCompoment));
            
            container.appendChild(cardContainer);
        }
    }

    private renderAddCard(container: HTMLElement) {
        const options: EditableFieldOptions = {
            title: '+ Add new card',
            placeholder: 'Enter new card\'s name',

            submitBtnContent: 'create',
            cancelBtnContent: Icon.cross.outerHTML,

            prepareValue: trim,
            onSubmit: (value: string) => this.eventEmitter.emit('create-new-card', value),
            validation: cardNameValidation
        };
        this.createComponent(container, EditableFieldComponent, options, 'add-card-field');
    }
}
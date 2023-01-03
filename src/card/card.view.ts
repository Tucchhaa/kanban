import { BaseView } from "../base/view";
import { EditableFieldComponent } from "../components/editable-field.component";
import { EditableFieldOptions } from "../editable-field/editable-field.state";
import { trim } from "../helpers";
import { Icon } from "../utils/icons";
import { cardNameValidation } from "../utils/validation";
import { CardState } from "./card.state";

export class CardView extends BaseView<CardState> {
    public editFieldComponent?: EditableFieldComponent;

    constructor() {
        super(['card']);
    }

    protected _render(fragment: DocumentFragment): void {
        fragment.append(
            this.createRenderElement('card', this.createDOMElement('div'), this.renderCard.bind(this)),
            this.createRenderElement('toolbar', this.createDOMElement('div', 'toolbar'), this.renderToolbar.bind(this)),
        );
    }

    private renderCard(container: HTMLElement) {
        const options: EditableFieldOptions = {
            value: this.state.card.name!,
            placeholder: 'Card\'s name',

            titleTemplate: () => {
                const title = this.createDOMElement('div');
                title.innerText = this.state.card.name;

                return title;
            },
            submitBtnContent: 'save',
            cancelBtnContent: Icon.cross.outerHTML,

            submitOnOutsideClick: true,
            resetValueOnClosed: false,
            
            prepareValue: trim,
            validation: cardNameValidation,

            onSubmit: (value: string) => this.eventEmitter.emit('change-card-name', value),
            onOpened: () => {
                this.eventEmitter.emit('edit-field-opened');
            },
            onClosed: () => {
                this.eventEmitter.emit('edit-field-closed');
            }
        };
        this.editFieldComponent = this.createComponent(container, EditableFieldComponent, options, 'card-name-field') as EditableFieldComponent;
    }

    private renderToolbar(container: HTMLElement) {
        container.style.display = this.state.isToolbarHidden ? 'none' : 'block';

        const changeNameBtn = this.createDOMElement('button', 'change-name');
        changeNameBtn.appendChild(Icon.pencil);
        changeNameBtn.addEventListener('click', () => this.eventEmitter.emit('change-card-name-click'));

        const deleteBtn = this.createDOMElement('button', 'delete-card');
        deleteBtn.appendChild(Icon.delete);
        deleteBtn.addEventListener('click', () => this.eventEmitter.emit('delete-card-click'));

        container.append(changeNameBtn, deleteBtn);
    }
}
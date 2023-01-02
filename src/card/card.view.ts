import { BaseView } from "../base/view";
import { EditableFieldComponent } from "../components/editable-field.component";
import { EditableFieldOptions } from "../editable-field/editable-field.state";
import { trim } from "../helpers";
import { Icon } from "../utils/icons";
import { cardNameValidation } from "../utils/validation";
import { CardState } from "./card.state";

type ToolbarHandlers = {
    changeNameHandler: (e: MouseEvent) => void,
    deleteHandler: (e: MouseEvent) => void
};

export class CardView extends BaseView<CardState> {
    constructor() {
        super(['card']);
    }

    protected _render(fragment: DocumentFragment): void {
        const nameFieldContainer = this.createDOMElement('div');

        const options: EditableFieldOptions = {
            value: this.state.card.name!,
            placeholder: 'Card\'s name',

            titleTemplate: (open: () => void) => {
                const fragment = document.createDocumentFragment();

                const title = this.createDOMElement('div');
                title.innerText = this.state.card.name;

                const toolbar = this.createToolbar({
                    changeNameHandler: open,
                    deleteHandler: () => {}
                });

                fragment.append(title, toolbar);

                return fragment;
            },
            submitBtnContent: 'save',
            cancelBtnContent: Icon.cross.outerHTML,

            submitOnOutsideClick: true,
            resetValueOnClosed: false,
            
            prepareValue: trim,
            validation: cardNameValidation,

            onSubmit: (value: string) => this.eventEmitter.emit('change-card-name', value),
            onOpened: () => {
                this.container.style.cursor = 'default';
                this.eventEmitter.emit('disable-drag');
            },
            onClosed: () => {
                this.container.style.removeProperty('cursor');
                this.eventEmitter.emit('enable-drag');
            }
        };
        this.createComponent(nameFieldContainer, EditableFieldComponent, options, 'card-name-field');
    
        fragment.appendChild(nameFieldContainer);
    }

    private createToolbar(handlers: ToolbarHandlers) {
        const changeNameBtn = this.createDOMElement('button', 'change-name');
        changeNameBtn.appendChild(Icon.pencil);
        changeNameBtn.addEventListener('click', handlers.changeNameHandler);

        const deleteBtn = this.createDOMElement('button', 'delete-card');
        deleteBtn.appendChild(Icon.delete);
        deleteBtn.addEventListener('click', handlers.deleteHandler);

        const toolbar = this.createDOMElement('div', 'toolbar');
        toolbar.append(changeNameBtn, deleteBtn);

        return toolbar;
    }
}
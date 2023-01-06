import { BaseView } from "../base/view";
import { ButtonOptions } from "../button/button.state";
import { ButtonComponent } from "../components/button.component";
import { EditableFieldComponent } from "../components/editable-field.component";
import { EditableFieldOptions } from "../editable-field/editable-field.state";
import { trim } from "../helpers";
import { Icon } from "../utils/icons";
import { cardNameValidation } from "../utils/validation";
import { CardState } from "./card.state";

export class CardView extends BaseView<CardState> {
    public editFieldComponent?: EditableFieldComponent;
    
    public dragElement?: HTMLElement;
    public dragWrapperElement?: HTMLElement;

    constructor() {
        super('card-wrapper');
    }

    protected _render(fragment: DocumentFragment): void {
        const cardContainer = this.createDOMElement('div', 'card');

        cardContainer.append(
            this.createRenderElement('card', this.createDOMElement('div'), this.renderCard.bind(this)),
            this.createRenderElement('toolbar', this.createDOMElement('div', 'toolbar'), this.renderToolbar.bind(this))
        );

        this.dragWrapperElement = this.container;
        this.dragElement = cardContainer;

        fragment.append(cardContainer);
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
                this.eventEmitter.emit('update-toolbar-state', 'hidden');
                this.eventEmitter.emit('disable-card-drag');
            },
            onClosed: () => {
                this.eventEmitter.emit('update-toolbar-state', 'default');
                this.eventEmitter.emit('enable-card-drag');
            }
        };
        this.editFieldComponent = this.createComponent(container, EditableFieldComponent, options, 'card-name-field') as EditableFieldComponent;
    }

    private renderToolbar(container: HTMLElement) {
        container.classList.remove('toolbar-hidden', 'toolbar-delete-prompt', 'toolbar-default');
        container.classList.add(`toolbar-${this.state.toolbarState}`);
        
        switch(this.state.toolbarState) {
            case 'hidden':
                container.style.display = 'none';

                this.onClearRenderElement('toolbar', () => container.style.removeProperty('display'))

                break;

            case 'delete-prompt':
                container.style.display = 'block';

                const prompt = this.createDOMElement('div', 'prompt-text');
                prompt.innerText = 'Delete this card?';

                const confirmBtnComponent = this.createComponent<ButtonOptions>('span', ButtonComponent, {
                    text: 'confirm',
                    className: 'prompt-confirm',
                    onClick: () => this.eventEmitter.emit('delete-card-confirmed')
                }, 'prompt-confirm-btn');

                const cancelBtnComponent = this.createComponent<ButtonOptions>('span', ButtonComponent, {
                    text: 'cancel',
                    className: 'prompt-cancel',
                    onClick: () => this.eventEmitter.emit('update-toolbar-state', 'default')
                }, 'prompt-cancel-btn');
               
                // ===
                
                const promptBtns = this.createDOMElement('div', 'prompt-btns');
                promptBtns.append(confirmBtnComponent.container, cancelBtnComponent.container);

                container.append(prompt, promptBtns);

                // ===
                this.eventEmitter.emit('disable-card-drag');

                setTimeout(() => {
                    const mouseDownHandler = () => this.eventEmitter.emit('update-toolbar-state', 'default');
                    document.addEventListener('click', mouseDownHandler);
                    this.onClearRenderElement('toolbar', () => document.removeEventListener('click', mouseDownHandler));
                    this.onClearRenderElement('toolbar', () => this.eventEmitter.emit('enable-card-drag'));
                });

                break;
            default:
                const changeNameBtn = this.createDOMElement('button', 'change-name');
                changeNameBtn.appendChild(Icon.pencil);
                changeNameBtn.addEventListener('click', () => this.eventEmitter.emit('change-card-name-click'));
        
                const deleteBtn = this.createDOMElement('button', 'delete-card');
                deleteBtn.appendChild(Icon.delete);
                deleteBtn.addEventListener('click', () => this.eventEmitter.emit('update-toolbar-state', 'delete-prompt'));
        
                container.append(changeNameBtn, deleteBtn);
        }
    }
}
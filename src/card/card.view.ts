import { BaseView } from "../base/view";
import { ButtonOptions } from "../button/button.state";
import { ButtonComponent } from "../components/button.component";
import { EditableFieldComponent } from "../components/editable-field.component";
import { PromptComponent } from "../components/prompt.component";
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
            submitBtnContent: this.getSubmitBtnContent(),
            cancelBtnContent: this.getCancelBtnContent(),

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

    private getSubmitBtnContent() {
        const content = this.createDOMElement('span');
        content.innerText = 'save';
        
        return content;
    }

    private getCancelBtnContent() {
        const content = this.createDOMElement('span');
        content.append(Icon.cross);
        
        return content;
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
                this.createComponent(container, PromptComponent, {
                    text: 'Delete this card?',
                    onConfirm: () => this.eventEmitter.emit('delete-card-confirmed'),
                    onCancel: () => this.eventEmitter.emit('update-toolbar-state', 'default')
                })

                this.eventEmitter.emit('disable-card-drag');

                setTimeout(() => {
                    const mouseDownHandler = () => this.eventEmitter.emit('update-toolbar-state', 'default');
                    document.addEventListener('click', mouseDownHandler);
                    this.onClearRenderElement('toolbar', () => document.removeEventListener('click', mouseDownHandler));
                    this.onClearRenderElement('toolbar', () => this.eventEmitter.emit('enable-card-drag'));
                });

                break;
            default:
                const changeNameBtn = this.createDOMElement('span');
                this.createComponent<ButtonOptions>(changeNameBtn, ButtonComponent, {
                    className: 'change-name',
                    icon: Icon.pencil,
                    onClick: () => this.eventEmitter.emit('change-card-name-click')
                }, 'change-name-btn');

                const deleteBtn = this.createDOMElement('span');
                this.createComponent<ButtonOptions>(deleteBtn, ButtonComponent, {
                    className: 'delete-card',
                    icon: Icon.delete,
                    onClick: () => this.eventEmitter.emit('update-toolbar-state', 'delete-prompt')
                }, 'delete-card');
        
                container.append(changeNameBtn, deleteBtn);
        }
    }
}
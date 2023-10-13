import { BaseView } from "../base/view";
import { ButtonComponent } from "../components/button.component";
import { EditableFieldState } from "./editable-field.state";

export class EditableFieldView extends BaseView<EditableFieldState> {
    public input?: HTMLElement;
    public placeholder?: HTMLElement;

    constructor() {
        super('editable-field');
    }

    protected _render(fragment: DocumentFragment): void {
        if(this.state.isOpen) {
            this.renderOpened(fragment);
            this.container.classList.add('state-opened');
            this.container.classList.remove('state-closed');
        }
        else {
            this.renderClosed(fragment);
            this.container.classList.add('state-closed');
            this.container.classList.remove('state-opened');
        }
    }

    private renderClosed(fragment: DocumentFragment) {
        const btn = this.createDOMElement('div', 'title');
        const open = () => this.eventEmitter.emit('open');

        if(this.state.titleTemplate) {
            const template = this.state.titleTemplate(open);

            template && btn.appendChild(template);
        }
        else {
            btn.innerText = this.state.title ? this.state.title : this.state.value;
            btn.addEventListener('click', open);
        }

        fragment.appendChild(btn);
    }

    private renderOpened(fragment: DocumentFragment) {
        fragment.append(
            this.createRenderElement('input', this.createDOMElement('div', 'input-wrapper'), this.renderInput.bind(this)),
            this.createRenderElement('validation-msg', this.createDOMElement('div'), this.renderValidationMessage.bind(this)),
            this.createRenderElement('buttons', this.createDOMElement('div', 'buttons'), this.renderButtons.bind(this))
        )

        setTimeout(() => this.setDocumentMouseDownListener());
    }

    private renderInput(inputWrapper: HTMLElement) {
        this.placeholder = this.createPlaceholder();
        this.input = this.createInput();

        const inputContainer = this.createDOMElement('div', 'input-container');
        inputContainer.append(this.placeholder, this.input);

        inputWrapper.appendChild(inputContainer);
    }

    private createPlaceholder() {
        const placeholder = this.createDOMElement('div', 'placeholder');
        placeholder.innerText = this.state.placeholder;

        return placeholder;
    }

    private createInput() {
        const input = this.createDOMElement('span', 'input') as HTMLInputElement;

        input.setAttribute('contenteditable', 'true');
        input.setAttribute('role', 'textbox');
        
        input.addEventListener('input', () => this.eventEmitter.emit('value-changed', input.innerText));
        input.addEventListener('keydown', (e: KeyboardEvent) => e.key === 'Enter' && this.eventEmitter.emit('enter-pressed'));
        input.addEventListener('focus', () => this.eventEmitter.emit('focus'));
        input.addEventListener('blur', (e: FocusEvent) => this.eventEmitter.emit('blur', e));

        input.innerText = this.state.value;

        return input;
    }

    private renderValidationMessage(container: HTMLElement) {
        if(this.state.validationMsg) {
            const message = this.createDOMElement('div', 'validation-msg');
            message.innerText = this.state.validationMsg;
            container.appendChild(message);
        }
    }

    private renderButtons(container: HTMLElement) {
        const submitAction = () => this.eventEmitter.emit('submit');
        const closeAction = () => this.eventEmitter.emit('close');

        if(this.state.buttonsTemplate) {
            this.state.buttonsTemplate(container, {
                submit: submitAction, 
                close: closeAction
            });
        }
        else {
            const submitBtn = this.createComponent('span', ButtonComponent, {
                className: 'submit',
                content: this.state.submitBtnContent, 
                onClick: submitAction
            }, 'submit-btn');

            const cancelBtn = this.createComponent('span', ButtonComponent, {
                className: 'cancel',
                content: this.state.cancelBtnContent, 
                onClick: closeAction
            }, 'cancel-btn');
            
            container.append(submitBtn.container, cancelBtn.container);
        }
    }

    private setDocumentMouseDownListener() {
        const onDocumentClick = (e: MouseEvent) => this.eventEmitter.emit('document-click', e);
        document.addEventListener('mousedown', onDocumentClick);
        this.onClear.push(() => {
            document.removeEventListener('mousedown', onDocumentClick)
        });
    }
}
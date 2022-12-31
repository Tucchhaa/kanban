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
        }
        else {
            this.renderClosed(fragment);
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
        this.renderInput(fragment);
        this.renderValidationMessage(fragment);
        this.renderButtons(fragment);

        setTimeout(() => this.setDocumentMouseDownListener());
    }

    private renderInput(fragment: DocumentFragment) {
        this.placeholder = this.createPlaceholder();
        this.input = this.createInput();

        const container = this.createDOMElement('div', 'input-container');
        container.append(this.placeholder, this.input);

        const wrapper = this.createDOMElement('div', 'input-wrapper');
        wrapper.append(container);

        fragment.appendChild(wrapper);
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
        input.addEventListener('focusin', () => this.eventEmitter.emit('focusin'));
        input.addEventListener('focusout', () => this.eventEmitter.emit('focusout'));

        input.innerText = this.state.value;

        return input;
    }

    private renderValidationMessage(fragment: DocumentFragment) {
        if(this.state.validationMsg) {
            const message = this.createDOMElement('div', 'validation-msg');
            message.innerText = this.state.validationMsg;
            fragment.appendChild(message);
        }
    }

    private renderButtons(fragment: DocumentFragment) {
        const submitAction = () => this.eventEmitter.emit('submit');
        const closeAction = () => this.eventEmitter.emit('close');

        if(this.state.buttonsTemplate) {
            const buttons = this.state.buttonsTemplate(submitAction, closeAction);

            buttons && fragment.appendChild(buttons);
        }
        else {
            const buttons = this.createDOMElement('div', 'buttons');
        
            const submitBtn = this.createDOMElement('span');
            this.createComponent(submitBtn, ButtonComponent, {
                text: 'submit', 
                onClick: submitAction
            }, 'submit-btn');

            const cancelBtn = this.createDOMElement('span');
            this.createComponent(cancelBtn, ButtonComponent, {
                text: 'cancel', 
                onClick: closeAction
            }, 'cancel-btn');
            
            buttons.append(submitBtn, cancelBtn);

            fragment.appendChild(buttons);
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
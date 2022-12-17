import { BaseView } from "../base/view";
import { ButtonComponent } from "../components/button.component";
import { EditableFieldState } from "./editable-field.state";

export class EditableFieldView extends BaseView<EditableFieldState> {
    public input?: HTMLElement;
    public placeholder?: HTMLElement;

    constructor(state: EditableFieldState) {
        super(state, 'editable-field');
    }

    protected render(fragment: DocumentFragment): void {
        if(this.state.isOpen) {
            this._renderOpened(fragment);
            this.container.classList.add('state-opened');
        }
        else {
            this._renderClosed(fragment);
            this.container.classList.remove('state-opened');
        }
    }

    private _renderClosed(fragment: DocumentFragment) {
        const btn = this.createDOMElement('div', 'title');

        btn.innerText = this.state.btnText;
        btn.addEventListener('click', () => this.eventEmitter.emit('open'));

        fragment.appendChild(btn);
    }

    private _renderOpened(fragment: DocumentFragment) {
        this.renderInput(fragment);
        this.renderValidationMessage(fragment);
        this.renderButtons(fragment);
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
        
        input.addEventListener('input', e => this.eventEmitter.emit('value-change', (e.target as HTMLInputElement).innerText));
        input.addEventListener('keydown', (e: KeyboardEvent) => e.key === 'Enter' && this.eventEmitter.emit('enter-pressed'))
        
        input.value = this.state.value;
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
        const buttons = this.createDOMElement('div', 'buttons');
        
        const submitBtn = this.createDOMElement('span');
        this.createComponent(submitBtn, ButtonComponent, {
            text: 'submit', 
            onClick: () => this.eventEmitter.emit('submit')
        }, 'submit-btn');

        const cancelBtn = this.createDOMElement('span');
        this.createComponent(cancelBtn, ButtonComponent, {
            text: 'cancel', 
            onClick: () => this.eventEmitter.emit('close')
        }, 'cancel-btn');
        
        buttons.append(submitBtn, cancelBtn);

        fragment.appendChild(buttons);
    }
}
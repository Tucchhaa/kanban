import { BaseView } from "../base/view";
import { ButtonComponent } from "../components/button.component";
import { EditableFieldState } from "./editable-field.state";

export class EditableFieldView extends BaseView<EditableFieldState> {
    constructor(state: EditableFieldState, container: HTMLElement) {
        super(state, container, 'editable-field');
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
        const btn = this.createDOMElement('div');

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
        const placeholder = this.createDOMElement('div', 'placeholder');
        placeholder.innerText = this.state.placeholder;

        const input = this.createDOMElement('span', 'input') as HTMLInputElement;
        input.setAttribute('contenteditable', 'true');
        input.setAttribute('role', 'textbox');
        input.addEventListener('input', e => this.eventEmitter.emit('value-change', (e.target as HTMLInputElement).innerText, placeholder));
        input.value = this.state.value;

        const container = this.createDOMElement('div', 'input-container');
        container.append(placeholder, input);

        const wrapper = this.createDOMElement('div', 'input-wrapper');
        wrapper.append(container);

        fragment.appendChild(wrapper);
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
            onClick: () => this.eventEmitter.emit('submit', this.state.value)
        }, 'submit-btn');

        const cancelBtn = this.createDOMElement('span');
        this.createComponent(cancelBtn, ButtonComponent, {
            text: 'cancel', 
            onClick: () => this.eventEmitter.emit('close', this.state.value)
        }, 'cancel-btn');
        
        buttons.append(submitBtn, cancelBtn);

        fragment.appendChild(buttons);
    }
}
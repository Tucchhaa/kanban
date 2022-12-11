import { BaseView } from "../base/view";
import { ButtonComponent } from "../components/button.component";
import { EditableFieldState } from "./editable-field.state";

export class EditableFieldView extends BaseView<EditableFieldState> {
    constructor(state: EditableFieldState, container: HTMLElement) {
        super(state, container);
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
        // Input
        const input = this.createDOMElement('input') as HTMLInputElement;
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', this.state.placeholder);
        input.addEventListener('input', (e) => this.eventEmitter.emit('value-change', (e.target as HTMLInputElement).value));
        input.value = this.state.value;
        fragment.appendChild(input);

        // Validation message
        if(this.state.validationMsg) {
            const message = this.createDOMElement('div', 'validation-msg');
            message.innerText = this.state.validationMsg;
            fragment.appendChild(message);
        }

        // Buttons
        const buttons = this.createDOMElement('div', 'buttons');
        
        const submitBtn = this.createDOMElement('span');
        this.createComponent(submitBtn, ButtonComponent, {
            text: 'submit', 
            onClick: () => this.eventEmitter.emit('submit', input.value)
        }, 'submit-btn');

        const cancelBtn = this.createDOMElement('span');
        this.createComponent(cancelBtn, ButtonComponent, {
            text: 'cancel', 
            onClick: () => this.eventEmitter.emit('close', input.value)
        }, 'cancel-btn');
        
        buttons.append(submitBtn, cancelBtn);

        fragment.appendChild(buttons);
    }
}
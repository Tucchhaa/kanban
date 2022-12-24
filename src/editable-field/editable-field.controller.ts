import { BaseController } from "../base/controller";
import { setEndOfContenteditable } from "../helpers";
import { EditableFieldState } from "./editable-field.state";
import { EditableFieldView } from "./editable-field.view";

export class EditableFieldController extends BaseController<EditableFieldState, EditableFieldView> {
    constructor() {
        super();
        
        this.eventEmitter
            .on('open', this.toggleInput.bind(this, true))
            .on('close', this.toggleInput.bind(this, false))

            .on('document-click', this.onDocumentClick.bind(this))
            .on('focusin', this.onFocusIn.bind(this))
            .on('focusout', this.onFocusOut.bind(this))
        
            .on('submit', this.onSubmit.bind(this))
            .on('enter-pressed', this.onEnterPressed.bind(this))
            .on('value-changed', this.onValueChanged.bind(this));
    }

    private focusInput() {
        const input = this.view.input as HTMLInputElement|undefined;

        if(input && this.state.isOpen) {
            const end = input.innerText.length;

            input.focus();
            setEndOfContenteditable(input);
        }
    }

    private toggleInput(isOpen: boolean) {
        this.state.update({ isOpen, validationMsg: null, value: this.state.defaultValue });
        
        if(isOpen) {
            this.focusInput();
            this.onFocusIn();
            this.state.onOpened();
        }
        else {
            this.onFocusOut();
            this.state.onClosed();
        }
    }

    private onDocumentClick(e: MouseEvent) {
        const isInnerClick = e.target === this.container || this.container.contains(e.target as Node);
        
        if(!isInnerClick) {
            if(this.state.submitOnOutsideClick)
                this.onSubmit();
            else
                this.toggleInput(false);
        }
    }

    private onFocusIn() {
        this.container.classList.add('state-focused');
    }

    private onFocusOut() {
        this.container.classList.remove('state-focused');
    }

    private onSubmit() {
        const value = this.state.prepareValue(this.state.value);
        const [result, msg] = this.state.validation(value);

        if(result) {
            this.toggleInput(false);
            this.state.onSubmit(value);
        }
        else {
            this.state.updateByKey('validationMsg', msg);
        }
    }

    private onEnterPressed() {
        this.onSubmit();
    }

    private onValueChanged(value: string) {
        this.state.updateByKey('value', value, false);

        this.view.placeholder!.style.display = value.length ? 'none' : 'block';
    }
}
import { BaseController } from "../base/controller";
import { setEndOfContenteditable } from "../helpers";
import { EditableFieldState } from "./editable-field.state";
import { EditableFieldView } from "./editable-field.view";

export class EditableFieldController extends BaseController {
    private state: EditableFieldState;
    private view: EditableFieldView;
    
    constructor(state: EditableFieldState, view: EditableFieldView) {
        super();

        this.state = state;
        this.view = view;
        
        this.eventEmitter
            .on('open', () => this.toggleInput(true))
            .on('close', () => this.toggleInput(false))

            .on('document-click', (e: MouseEvent) => this.onDocumentClick(e))
            .on('focusin', () => this.setFocusState())
            .on('focusout', () => this.resetFocusState())
        
            .on('submit', () => this.submit())
            .on('enter-pressed', () => this.onEnterPressed())
            .on('value-change', (value: string) => this.updateValue(value))
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
            this.setFocusState();
            this.state.onOpened();
        }
        else {
            this.resetFocusState();
            this.state.onClosed();
        }
    }

    private onDocumentClick(e: MouseEvent) {
        const isInnerClick = e.target === this.container || this.container.contains(e.target as Node);
        
        if(!isInnerClick) {
            if(this.state.submitOnOutsideClick)
                this.submit();
            else
                this.toggleInput(false);
        }
    }

    private setFocusState() {
        this.container.classList.add('state-focused');
    }

    private resetFocusState() {
        this.container.classList.remove('state-focused');
    }

    private submit() {
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
        this.submit();
    }

    private updateValue(value: string) {
        this.state.updateByKey('value', value, false);

        this.view.placeholder!.style.display = value.length ? 'none' : 'block';
    }
}
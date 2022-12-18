import { BaseController } from "../base/controller";
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
            .on('rendered', () => this.focusInput())
            .on('open', () => this.toggleInput(true))
            .on('close', () => this.toggleInput(false))

            .on('document-mousedown', (e: MouseEvent) => this.onDocumentClick(e))
            .on('focusin', () => this.setFocusState())
            .on('focusout', () => this.resetFocusState())
        
            .on('submit', () => this.submit())
            .on('enter-pressed', () => this.onEnterPressed())
            .on('value-change', (value: string) => this.updateValue(value))
    }

    private focusInput() {
        this.view.input?.focus();
    }

    private toggleInput(isOpen: boolean) {
        isOpen ? this.setFocusState() : this.resetFocusState();
        this.state.update({ isOpen, validationMsg: null, value: "" });
    }

    private onDocumentClick(e: MouseEvent) {
        const isInnerClick = e.target === this.container || this.container.contains(e.target as Node);
        
        if(!isInnerClick) {
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
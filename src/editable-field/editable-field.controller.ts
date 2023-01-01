import { BaseController } from "../base/controller";
import { focusEndOfContenteditable } from "../helpers";
import { EditableFieldState } from "./editable-field.state";
import { EditableFieldView } from "./editable-field.view";

export class EditableFieldController extends BaseController<EditableFieldState, EditableFieldView> {
    private lastSavedValue: string;

    constructor() {
        super();
        
        this.lastSavedValue = this.state.value;

        this.eventEmitter
            .on('open', this.toggleInput.bind(this, true))
            .on('close', this.toggleInput.bind(this, false))

            .on('document-click', this.onDocumentClick.bind(this))
            .on('focus', this.onFocus.bind(this))
            .on('blur', this.onBlur.bind(this))
        
            .on('submit', this.onSubmit.bind(this))
            .on('enter-pressed', this.onEnterPressed.bind(this))
            .on('value-changed', this.onValueChanged.bind(this));
    }

    private focusInput() {
        const input = this.view.input as HTMLInputElement|undefined;

        if(input && this.state.isOpen) {
            input.focus();
            this.onFocus();
            focusEndOfContenteditable(input);
        }
    }

    private toggleInput(isOpen: boolean) {
        this.state.update({ 
            isOpen, validationMsg: null, value: this.lastSavedValue
        });
        
        if(isOpen) {
            this.focusInput();
            this.updatePlaceholder();
            this.state.onOpened();
        }
        else {
            this.state.resetValueOnClosed && this.state.updateByKey('value', '', false);

            this.onBlur();
            this.state.onClosed();
        }
    }

    private onDocumentClick(e: MouseEvent) {
        const isInnerClick = e.target === this.container || this.container.contains(e.target as Node);

        if(!isInnerClick) {
            if(this.state.submitOnOutsideClick)
                this.onSubmit(e);
            
            // else 
            this.toggleInput(false);
        }
    }

    private onFocus() {
        this.container.classList.add('state-focused');
    }

    private onBlur() {
        this.container.classList.remove('state-focused');
    }

    private onSubmit(e?: MouseEvent) {
        const value = this.state.prepareValue(this.state.value);
        const [result, msg] = this.state.validation(value);

        if(result) {
            this.lastSavedValue = value;
            this.state.updateByKey('value', value, false);
            this.state.onSubmit(value);
            this.toggleInput(false);
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

        this.updatePlaceholder();
    }

    private updatePlaceholder() {
        this.view.placeholder!.style.display = this.state.value.length ? 'none' : 'block';
    }
}
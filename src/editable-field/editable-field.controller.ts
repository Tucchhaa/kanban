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
        
        this.eventEmitter.on('rendered', () => this.focusInput());
        this.eventEmitter.on('open', () => this.toggleInput(true));
        this.eventEmitter.on('close', () => this.toggleInput(false));
        this.eventEmitter.on('submit', () => this.submit());
        this.eventEmitter.on('enter-pressed', () => this.onEnterPressed());
        this.eventEmitter.on('value-change', (value: string) => this.updateValue(value));
    }

    public toggleInput(isOpen: boolean) {
        this.state.update({ isOpen, validationMsg: null, value: "" });
    }

    public focusInput() {
        this.view.input?.focus();
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
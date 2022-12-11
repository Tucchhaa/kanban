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
        
        this.eventEmitter.on('open', () => this.toggleForm(true));
        this.eventEmitter.on('close', () => this.toggleForm(false));
        this.eventEmitter.on('submit', (value: string) => this.submit(value));
        this.eventEmitter.on('value-change', (value: string, placeholder: HTMLElement) => this.updateValue(value, placeholder));
    }

    public toggleForm(isOpen: boolean) {
        this.state.update({ isOpen, validationMsg: null, value: "" });
    }

    private submit(value: string) {
        const [result, msg] = this.state.validation(value);

        if(result) {
            this.toggleForm(false);
            this.state.onSubmit(value);
        }
        else {
            this.state.updateByKey('validationMsg', msg);
        }
    }

    private updateValue(value: string, placeholder: HTMLElement) {
        this.state.updateByKey('value', value, false);

        placeholder.style.display = value.length ? 'none' : 'block';
    }
}
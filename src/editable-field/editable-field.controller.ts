import { EditableFieldModel } from "./editable-field.model";
import { EditableFieldView } from "./editable-field.view";

export class EditableFieldController {
    private model: EditableFieldModel;
    private view: EditableFieldView;
    
    constructor(model: EditableFieldModel, view: EditableFieldView) {
        this.model = model;
        this.view = view;
        
        this.view.on('open', () => this.toggleForm(true));
        this.view.on('close', () => this.toggleForm(false));
        this.view.on('submit', (value: string) => this._submit(value));
        this.view.on('value-change', (value: string) => this._updateValue(value));
    }

    public toggleForm(isOpen: boolean) {
        this.model.update({ isOpen, validationMsg: null, value: "" });
    }

    private _submit(value: string) {
        const [result, msg] = this.model.validation(value);

        if(result) {
            this.toggleForm(false);
            this.model.onSubmit(value);
        }
        else {
            this.model.updateByKey('validationMsg', msg);
        }
    }

    private _updateValue(value: string) {
        this.model.updateByKey('value', value, false);
    }
}
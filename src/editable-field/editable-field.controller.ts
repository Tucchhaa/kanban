import { BaseController } from "../base/controller";
import { EditableFieldModel } from "./editable-field.model";
import { EditableFieldView } from "./editable-field.view";

export class EditableFieldController extends BaseController {
    private model: EditableFieldModel;
    private view: EditableFieldView;
    
    constructor(model: EditableFieldModel, view: EditableFieldView) {
        super();

        this.model = model;
        this.view = view;
        
        this.eventEmitter.on('open', () => this.toggleForm(true));
        this.eventEmitter.on('close', () => this.toggleForm(false));
        this.eventEmitter.on('submit', (value: string) => this._submit(value));
        this.eventEmitter.on('value-change', (value: string) => this._updateValue(value));
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
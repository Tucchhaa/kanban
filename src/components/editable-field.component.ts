import { BaseComponent } from "../base/component";
import { EditableFieldController } from "../editable-field/editable-field.controller";
import { EditableFieldOptions, EditableFieldState } from "../editable-field/editable-field.state";
import { EditableFieldView } from "../editable-field/editable-field.view";

export class EditableFieldComponent extends BaseComponent<EditableFieldOptions, EditableFieldState, EditableFieldView> {
    constructor(container: HTMLElement | null, options: EditableFieldOptions) {
        super('EditableField', EditableFieldState, EditableFieldView, container, options, EditableFieldController);
        
        super.render();
    }
}
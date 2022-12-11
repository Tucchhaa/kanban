import { BaseComponent } from "../base/component";
import { EditableFieldController } from "../editable-field/editable-field.controller";
import { EditableFieldState } from "../editable-field/editable-field.state";
import { EditableFieldView } from "../editable-field/editable-field.view";
import { EditableFieldOptions } from "../types";

export class EditableFieldComponent extends BaseComponent<EditableFieldOptions, EditableFieldState, EditableFieldView, EditableFieldController> {
    constructor(container: HTMLElement | null, options: EditableFieldOptions) {
        super('EditableField', EditableFieldState, EditableFieldView, container, options, EditableFieldController);
    }
}
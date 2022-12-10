import { BaseComponent } from "../base/component";
import { EditableFieldController } from "../editable-field/editable-field.controller";
import { EditableFieldModel } from "../editable-field/editable-field.model";
import { EditableFieldView } from "../editable-field/editable-field.view";
import { EditableFieldOptions } from "../types";

export class EditableFieldComponent extends BaseComponent<EditableFieldOptions, EditableFieldModel, EditableFieldView, EditableFieldController> {
    constructor(container: HTMLElement | null, options: EditableFieldOptions) {
        super('EditableField', EditableFieldModel, EditableFieldView, container, options, EditableFieldController);
    }
}
import { EditableFieldController } from "../editable-field/editable-field.controller";
import { EditableFieldModel } from "../editable-field/editable-field.model";
import { EditableFieldView } from "../editable-field/editable-field.view";
import { EditableFieldOptions } from "../types";

export class TogglableInputComponent {
    constructor(container: HTMLElement | null, options: EditableFieldOptions) {
        if(!container) {
            throw new Error('TogglableInputComponent container is not defined');
        }

        const model = new EditableFieldModel(options);
        const view = new EditableFieldView(model, container);

        new EditableFieldController(model, view);
    }
}
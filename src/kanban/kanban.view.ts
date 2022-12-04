import { BaseView } from "../base/view";
import { ColumnComponent } from "../components/column.component";
import { EditableFieldComponent } from "../components/editable-field.component";
import { Column, EditableFieldOptions } from "../types";
import { KanbanModel } from "./kanban.model";

export class KanbanView extends BaseView<KanbanModel> {
    constructor(model: KanbanModel, container: HTMLElement) {
        super(model, container, ['kanban']);
    }

    protected render(fragment: DocumentFragment): void {
        this._renderColumns(fragment);
        this._renderAddColumn(fragment);
    }

    private _renderColumns(fragment: DocumentFragment) {
        const columns = this.model.columns;

        for(let index = 0; index < columns.length; index++) {
            const column = columns[index];

            const columnContainer = this.createDOMElement('div', ['column']);

            new ColumnComponent(columnContainer, column);

            fragment.appendChild(columnContainer);
        }
    }

    private _renderAddColumn(fragment: DocumentFragment) {
        const addColumnContainer = this.createDOMElement('div', ['column', 'add-column']);

        const options = Object.assign(new EditableFieldOptions(), {
            btnText: '+ Add new column',
            placeholder: 'Enter new column\'s name',
            onSubmit: (value: string) => this.emit('create-new-column', value),
            validation: (value: string) => {
                if(value.length === 0)
                    return [false, 'Column name can\'t be empty'];
                
                if(value.length > 40)
                    return [false, 'Column name is too long'];

                return [true];
            }
        });
        new EditableFieldComponent(addColumnContainer, options);
        
        fragment.append(addColumnContainer);
    }
}
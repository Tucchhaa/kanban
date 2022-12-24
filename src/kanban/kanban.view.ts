import { BaseView } from "../base/view";
import { ColumnOptions } from "../column/column.state";
import { ColumnComponent } from "../components/column.component";
import { EditableFieldComponent } from "../components/editable-field.component";
import { EditableFieldOptions } from "../editable-field/editable-field.state";
import { Column } from "../types";
import { KanbanState } from "./kanban.state";

export class KanbanView extends BaseView<KanbanState> {
    constructor() {
        super(['kanban']);
    }

    protected _render(fragment: DocumentFragment): void {
        this._renderColumns(fragment);
        this._renderAddColumn(fragment);
    }

    private _renderColumns(fragment: DocumentFragment) {
        const columns = this.state.columns;

        for(let index = 0; index < columns.length; index++) {
            const column = columns[index];

            const columnContainer = this.createDOMElement('div');
            const columnOptions: ColumnOptions = { column }

            const columnComponent = this.createComponent(columnContainer, ColumnComponent, columnOptions, `column${column.id}`);
            columnComponent.eventEmitter.on('update-column', (column: Column) => this.eventEmitter.emit('update-column', column));

            setTimeout(() => this.eventEmitter.emit('process-drag', columnComponent));

            fragment.appendChild(columnContainer);
        }
    }

    private _renderAddColumn(fragment: DocumentFragment) {
        const addColumnContainer = this.createDOMElement('div', ['add-column']);

        const options: EditableFieldOptions = {
            title: '+ Add new column',
            placeholder: 'Enter new column\'s name',
            
            prepareValue: (value: string) => value.trim().replace(/\s\s+/g, ' '),
            onSubmit: (value: string) => this.eventEmitter.emit('create-new-column', value),
            validation: (value: string) => {
                if(value.length === 0)
                    return [false, 'Column name can\'t be empty'];
                
                if(value.length > 40)
                    return [false, 'Column name is too long'];

                return [true, ''];
            }
        };
        
        this.createComponent(addColumnContainer, EditableFieldComponent, options, 'add-column-field');
        
        fragment.append(addColumnContainer);
    }
}
import { BaseView } from "../base/view";
import { ColumnComponent } from "../components/column.component";
import { EditableFieldComponent } from "../components/editable-field.component";
import { Column, ColumnOptions, EditableFieldOptions } from "../types";
import { KanbanState } from "./kanban.state";

export class KanbanView extends BaseView<KanbanState> {
    constructor(state: KanbanState, container: HTMLElement) {
        super(state, container, ['kanban']);
    }

    protected render(fragment: DocumentFragment): void {
        this._renderColumns(fragment);
        this._renderAddColumn(fragment);
    }

    private _renderColumns(fragment: DocumentFragment) {
        const columns = this.state.columns;

        for(let index = 0; index < columns.length; index++) {
            const column = columns[index];

            const columnContainer = this.createDOMElement('div', ['column']);
            const columnOptions: ColumnOptions = {
                column,
                onUpdateColumn: (column: Column) => this.eventEmitter.emit('update-column', column)
            }

            this.createComponent(columnContainer, ColumnComponent, columnOptions, `column${index}`);

            fragment.appendChild(columnContainer);
        }
    }

    private _renderAddColumn(fragment: DocumentFragment) {
        const addColumnContainer = this.createDOMElement('div', ['column', 'add-column']);

        const options = Object.assign(new EditableFieldOptions(), {
            btnText: '+ Add new column',
            placeholder: 'Enter new column\'s name',
            onSubmit: (value: string) => this.eventEmitter.emit('create-new-column', value),
            validation: (value: string) => {
                if(value.length === 0)
                    return [false, 'Column name can\'t be empty'];
                
                if(value.length > 40)
                    return [false, 'Column name is too long'];

                return [true];
            }
        });
        
        this.createComponent(addColumnContainer, EditableFieldComponent, options, 'add-column-field');
        
        fragment.append(addColumnContainer);
    }
}
import { BaseView } from "../base/view";
import { ColumnOptions } from "../column/column.state";
import { ColumnComponent } from "../components/column.component";
import { EditableFieldComponent } from "../components/editable-field.component";
import { EditableFieldOptions } from "../editable-field/editable-field.state";
import { trim } from "../helpers";
import { Column } from "../types";
import { Icon } from "../utils/icons";
import { columnNameValidation } from "../utils/validation";
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
            setTimeout(() => this.eventEmitter.emit('process-shared-drop', columnComponent));

            fragment.appendChild(columnContainer);
        }
    }

    private _renderAddColumn(fragment: DocumentFragment) {
        const addColumnContainer = this.createDOMElement('div', ['add-column']);

        const options: EditableFieldOptions = {
            title: '+ Add new column',
            placeholder: 'Enter new column\'s name',
            
            submitBtnContent: 'create',
            cancelBtnContent: Icon.cross.outerHTML,

            prepareValue: trim,
            onSubmit: (value: string) => this.eventEmitter.emit('create-new-column', value),
            validation: columnNameValidation
        };
        
        this.createComponent(addColumnContainer, EditableFieldComponent, options, 'add-column-field');
        
        fragment.append(addColumnContainer);
    }
}
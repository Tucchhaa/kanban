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
import {mouse} from "../utils/mouse-direction";

export class KanbanView extends BaseView<KanbanState> {
    public dropContainer: HTMLElement;

    constructor() {
        super(['kanban']);

        this.dropContainer = this.container;
    }

    protected _render(fragment: DocumentFragment): void {
        this._renderColumns(fragment);
        this._renderAddColumn(fragment);

        this.addMouseEventListeners();
    }

    private _renderColumns(fragment: DocumentFragment) {
        const columns = this.state.columns;

        for(let index = 0; index < columns.length; index++) {
            const column = columns[index];

            const columnContainer = this.createDOMElement('div', 'kanban-column');
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

    private addMouseEventListeners() {
        const mouseMoveHandler = mouse.setPosition.bind(mouse);
        document.addEventListener('mousemove', mouseMoveHandler);
        this.onClear.push(() => document.removeEventListener('mousemove', mouseMoveHandler));
    }
}
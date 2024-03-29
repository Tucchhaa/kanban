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
import {mouse} from "../utils/mouse";

export class KanbanView extends BaseView<KanbanState> {
    public dropContainer!: HTMLElement;
    public dropScrollElement!: HTMLElement;
    public grabScrollElement!: HTMLElement;

    constructor() {
        super(['kanban']);
    }

    protected _render(fragment: DocumentFragment): void {
        this.dropScrollElement = this.container;
        this.grabScrollElement = this.container;

        this.dropContainer = this.createRenderElement('columns', this.createDOMElement('div', 'columns'), this.renderColumns.bind(this));

        fragment.append(
            this.dropContainer,
            this.createRenderElement('add-column', this.createDOMElement('div', 'add-column'), this.renderAddColumn.bind(this))
        );

        this.addMouseEventListeners();
    }

    private renderColumns(container: HTMLElement) {
        const columns = this.state.columns;

        for(let index = 0; index < columns.length; index++) {
            const column = columns[index];

            const columnElement = this.createColumn(column);

            container.appendChild(columnElement);
        }
    }

    private createColumn(column: Column): HTMLElement {
        const columnElement = this.createDOMElement('div', 'kanban-column');
        const columnOptions: ColumnOptions = { column };

        const columnComponent = this.createComponent(columnElement, ColumnComponent, columnOptions, `column${column.id}`);
        columnComponent.eventEmitter.on('update-column', (column: Column) => this.eventEmitter.emit('update-column', column));
        columnComponent.eventEmitter.on('delete-column', (column: Column) => this.eventEmitter.emit('delete-column', column));

        // ===
        columnComponent.eventEmitter.on('drag-start', () => this.eventEmitter.emit('disable-grab-scroll'));
        columnComponent.eventEmitter.on('drag-end', () => this.eventEmitter.emit('enable-grab-scroll'));

        columnComponent.eventEmitter.on('card-drag-start', () => this.eventEmitter.emit('disable-grab-scroll'));
        columnComponent.eventEmitter.on('card-drag-end', () => this.eventEmitter.emit('enable-grab-scroll'));
        // ===

        setTimeout(() => this.eventEmitter.emit('process-drag', columnComponent));
        setTimeout(() => this.eventEmitter.emit('process-shared-drop', columnComponent));

        return columnElement;
    }

    private renderAddColumn(container: HTMLElement) {
        const options: EditableFieldOptions = {
            title: '+ Add new column',
            placeholder: 'Enter new column\'s name',
            
            submitBtnContent: this.getAddColumnSubmitBtnContent(),
            cancelBtnContent: this.getAddColumnCancelBtnContent(),

            prepareValue: trim,
            onSubmit: (value: string) => this.eventEmitter.emit('create-new-column', value),
            validation: columnNameValidation
        };
        
        this.createComponent(container, EditableFieldComponent, options, 'add-column-field');
    }

    private getAddColumnSubmitBtnContent() {
        const content = this.createDOMElement('span');
        content.innerText = 'create';
        
        return content;
    }

    private getAddColumnCancelBtnContent() {
        const content = this.createDOMElement('span');
        content.append(Icon.cross);
        
        return content;
    }

    private addMouseEventListeners() {
        const mouseMoveHandler = mouse.setPosition.bind(mouse);
        document.addEventListener('mousemove', mouseMoveHandler);
        this.onClear.push(() => document.removeEventListener('mousemove', mouseMoveHandler));
    }

    public appendNewColumn(column: Column) {
        const columnElement = this.createColumn(column);

        this.dropContainer.append(columnElement);
    }
}
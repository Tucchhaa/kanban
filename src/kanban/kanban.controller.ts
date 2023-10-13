import { BaseController } from "../base/controller";
import { StateChange } from "../base/state";
import { isDeepEqual } from "../helpers";
import { Column } from "../types";
import { KanbanState } from "./kanban.state";
import { KanbanView } from "./kanban.view";

export class KanbanController extends BaseController<KanbanState, KanbanView> {
    constructor() {
        super();
        
        this.eventEmitter
            .on('create-new-column', this.onCreateNewColumn.bind(this))
            .on('update-column', this.onUpdateColumn.bind(this))
            .on('delete-column', this.onDeleteColumn.bind(this))
            .on('update-items-order', this.onUpdateColumnsOrder.bind(this));
    }

    public stateChanged(change: StateChange): void {
        switch(change.name) {
            case 'columns':
                break;

            default:
                this.render();
        }
    }

    private onCreateNewColumn(columnName: string) {
        const column = new Column(columnName);

        this.state.createColumn(column);

        this.view.appendNewColumn(column);
    }

    private onUpdateColumn(column: Column) {
        this.state.updateColumn(column.id, column);
    }

    private onDeleteColumn(column: Column) {
        const index = this.state.columns.findIndex(_column => _column.id === column.id);

        this.state.deleteColumn(column);

        this.container.querySelectorAll('.kanban-column')[index].remove();

        this.eventEmitter.emit('drag-deleted', column);
    }

    private onUpdateColumnsOrder(columns: Column[]) {
        this.state.updateColumns(columns);
    }
}
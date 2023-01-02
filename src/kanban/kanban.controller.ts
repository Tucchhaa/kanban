import { BaseController } from "../base/controller";
import { Column } from "../types";
import { KanbanState } from "./kanban.state";
import { KanbanView } from "./kanban.view";

export class KanbanController extends BaseController<KanbanState, KanbanView> {
    constructor() {
        super();
        
        this.eventEmitter
            .on('create-new-column', this.onCreateNewColumn.bind(this))
            .on('update-column', this.onUpdateColumn.bind(this))
            .on('update-items-order', this.onUpdateColumnsOrder.bind(this));
    }

    private onCreateNewColumn(columnName: string) {
        const column = new Column(columnName);

        this.state.createColumn(column);
        this.eventEmitter.emit('render');
    }

    private onUpdateColumn(column: Column) {
        this.state.updateColumn(column.id, column);
    }

    private onUpdateColumnsOrder(columns: Column[]) {
        this.state.updateColumns(columns);
        this.eventEmitter.emit('render');
    }
}
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
    }

    private onUpdateColumn(column: Column) {
        const isUpdated = this.state.updateColumn(column);

        if(!isUpdated) {
            throw new Error(`${this.componentName} can not update column with id: ${column.id}, because it does not exist`);
        }
    }

    private onUpdateColumnsOrder(columns: Column[]) {
        this.state.updateColumns(columns);
    }
}
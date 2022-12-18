import { BaseController } from "../base/controller";
import { Column } from "../types";
import { KanbanState } from "./kanban.state";
import { KanbanView } from "./kanban.view";

export class KanbanController extends BaseController {
    private state: KanbanState;
    private view: KanbanView;
    
    constructor(state: KanbanState, view: KanbanView) {
        super();

        this.state = state;
        this.view = view;
        
        this.eventEmitter
            .on('create-new-column', (columnName: string) => this.createNewColumn(columnName))
            .on('update-column', (column: Column) => this.updateColumn(column))
            .on('update-items-order', (columns: Column[]) => this.updateColumnsOrder(columns));
    }

    private createNewColumn(columnName: string) {
        const column = new Column(columnName);

        this.state.createColumn(column);
        this.eventEmitter.emit('items-updated', this.state.columns);
    }

    private updateColumn(column: Column) {
        const isUpdated = this.state.updateColumn(column);

        if(!isUpdated) {
            throw new Error(`${this.componentName} can not update column with id: ${column.id}, because it does not exist`);
        }
    }

    private updateColumnsOrder(columns: Column[]) {
        this.state.updateColumns(columns);
        this.eventEmitter.emit('items-updated', this.state.columns);
    }
}
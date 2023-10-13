import { BaseState } from "../base/state";
import { Column } from "../types";
import { KanbanController } from "./kanban.controller";

export type KanbanOptions = {
    columns?: Column[];
}

export class KanbanState extends BaseState<KanbanOptions> {
    public get columns() {
        return this.options.columns!.slice(); 
    }

    // ===
    
    constructor(options: KanbanOptions) {
        const defaultOptions = {
            columns: []
        };

        super(defaultOptions, options, [KanbanController]);
    }

    public createColumn(column: Column) {
        this.updateColumns([...this.columns, column]);
    }

    public updateColumn(id: number | string, column: Column) {
        this.updateBy(options => {
            const columnIndex = options.columns!.findIndex((column) => id === column.id);
            options.columns![columnIndex] = column;
        });
    }

    public deleteColumn(column: Column) {
        const updatedColumns = this.columns.filter(_column => _column.id !== column.id);

        this.updateColumns(updatedColumns);
    }
    
    public updateColumns(columns: Column[]) {
        this.updateByKey('columns', columns);
    }
}
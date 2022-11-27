import { Column } from "../column/column";

export class KanbanModel {
    private columns: Column[];

    constructor(columns: Column[]) {
        this.columns = columns;
    }

    getColumns(): Column[] {
        return this.columns.slice();
    }
}
import { Column } from "./column";

export class ColumnModel {
    private column;

    constructor(column: Column) {
        this.column = column;
    }

    getColumn(): Column {
        return Object.assign({}, this.column);
    }
}
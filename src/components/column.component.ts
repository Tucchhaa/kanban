import { Column } from "../types";
import { ColumnModel } from "../column/column.model";
import { ColumnView } from "../column/column.view";
import { ColumnController } from "../column/column.controller";

export class ColumnComponent {
    constructor(container: HTMLElement | null, column: Column) {
        if(!container) {
            throw new Error('ColumnComponent container is not defined');
        }

        const model = new ColumnModel(column);
        const view = new ColumnView(model, container);

        new ColumnController(model, view);
    }
}
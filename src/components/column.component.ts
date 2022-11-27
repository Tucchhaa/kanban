import { Column } from "../column/column";
import { ColumnModel } from "../column/column.model";
import { ColumnView } from "../column/column.view";

export class ColumnComponent {
    constructor(container: HTMLElement | null, column: Column) {
        if(!container) {
            throw new Error('column container is not defined');
        }

        const model = new ColumnModel(column);
        const view = new ColumnView(model, container);
    }
}
import { Column } from "../types";
import { ColumnModel } from "../column/column.model";
import { ColumnView } from "../column/column.view";
import { ColumnController } from "../column/column.controller";
import { BaseComponent } from "../base/component";
import { DropController } from "../drag-drop/drop.controller";
import { DropState } from "../drag-drop/drop.state";

export class ColumnComponent extends BaseComponent<Column, ColumnModel, ColumnView, ColumnController> {
    constructor(container: HTMLElement | null, column: Column) {
        super('Column', ColumnModel, ColumnView, container, column, ColumnController);

        const state = new DropState({});
        this.registerController(() => new DropController(state, this.view, this.container));
    }
}
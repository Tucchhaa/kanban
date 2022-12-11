import { ColumnOptions } from "../types";
import { ColumnState } from "../column/column.state";
import { ColumnView } from "../column/column.view";
import { ColumnController } from "../column/column.controller";
import { BaseComponent } from "../base/component";
import { DropController } from "../drag-drop/drop.controller";
import { DropState } from "../drag-drop/drop.state";

export class ColumnComponent extends BaseComponent<ColumnOptions, ColumnState, ColumnView, ColumnController> {
    constructor(container: HTMLElement | null, columnOptions: ColumnOptions) {
        super('Column', ColumnState, ColumnView, container, columnOptions, ColumnController);

        const state = new DropState({
            items: this.state.columnCards
        });
        this.registerController(() => new DropController(state, this.view, this.container));
    }
}
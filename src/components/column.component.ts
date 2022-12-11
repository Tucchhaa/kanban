import { ColumnOptions, ColumnState } from "../column/column.state";
import { ColumnView } from "../column/column.view";
import { ColumnController } from "../column/column.controller";
import { BaseComponent } from "../base/component";
import { DropController } from "../drag-drop/drop.controller";
import { DropState } from "../drag-drop/drop.state";
import { Card } from "../types";

export class ColumnComponent extends BaseComponent<ColumnOptions, ColumnState, ColumnView, ColumnController> {
    constructor(container: HTMLElement | null, columnOptions: ColumnOptions) {
        super('Column', ColumnState, ColumnView, container, columnOptions, ColumnController);

        const state = new DropState<Card>({
            items: this.state.columnCards,
            isEqual: (cardA, cardB) => cardA.id === cardB.id
        });
        this.registerController(() => new DropController<Card>(state));
    }
}
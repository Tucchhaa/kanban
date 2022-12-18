import { ColumnOptions, ColumnState } from "../column/column.state";
import { ColumnView } from "../column/column.view";
import { ColumnController } from "../column/column.controller";
import { BaseComponent } from "../base/component";
import { DropController } from "../drag-drop/drop.controller";
import { DropState } from "../drag-drop/drop.state";
import { Card } from "../types";

export class ColumnComponent extends BaseComponent<ColumnOptions, ColumnState, ColumnView> {
    constructor(container: HTMLElement | null, columnOptions: ColumnOptions | ColumnState) {
        super('Column', ColumnState, ColumnView, container, columnOptions, ColumnController);

        this.registerState(() => new DropState<Card>({
            direction: 'vertical',
            items: this.state.columnCards,
            isEqual: (cardA, cardB) => cardA.id === cardB.id
        }))
        this.registerController(() => new DropController<Card>());
        
        super.render();
    }
}
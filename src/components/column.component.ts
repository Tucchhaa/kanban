import { ColumnOptions, ColumnState } from "../column/column.state";
import { ColumnView } from "../column/column.view";
import { ColumnController } from "../column/column.controller";
import { BaseComponent } from "../base/component";
import { DropController } from "../drag-drop/drop.controller";
import { DropState } from "../drag-drop/drop.state";
import { Card, Column } from "../types";
import { DragState } from "../drag-drop/drag.state";
import { DragController } from "../drag-drop/drag.controller";
import { DraggableColumnView } from "../column/column.drag-wrapper.view";
import { DropView } from "../drag-drop/drop.view";

export class ColumnComponent extends BaseComponent<ColumnOptions, ColumnState, ColumnView> {
    constructor(container: HTMLElement | null, columnOptions: ColumnOptions | ColumnState) {
        super('Column', ColumnState, ColumnView, container, columnOptions);

        this.registerController(() => new ColumnController());

        // DROP
        this.registerState(() => new DropState<Card>({
            direction: 'vertical',
            items: this.state.columnCards,
            isEqual: (cardA, cardB) => cardA.id === cardB.id
        }))
        this.extendView(() => new DropView());
        this.registerController(() => new DropController<Card>());

        // DRAG
        this.registerState(() => new DragState({}));
        this.extendView(() => new DraggableColumnView());
        this.registerController(() => new DragController<Column>(this.state.column));

        super.render();
    }
}
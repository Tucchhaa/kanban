import { ColumnOptions, ColumnState } from "../column/column.state";
import { BaseComponent } from "../base/component";
import { DragController } from "../drag-drop/drag.controller";
import { Column } from "../types";
import { DragState } from "../drag-drop/drag.state";
import { DraggableColumnView } from "../column/column.drag-wrapper.view";

export class DraggableColumnComponent extends BaseComponent<ColumnOptions, ColumnState, DraggableColumnView> {
    constructor(container: HTMLElement | null, columnOptions: ColumnOptions) {
        super('DraggableColumn', ColumnState, DraggableColumnView, container, columnOptions);

        this.registerState(() => new DragState({}))
        this.registerController(() => new DragController<Column>(this.state.column));

        super.render();
    }
}
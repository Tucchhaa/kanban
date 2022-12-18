import { ColumnOptions, ColumnState } from "../column/column.state";
import { BaseComponent } from "../base/component";
import { DragController } from "../drag-drop/drag.controller";
import { Column } from "../types";
import { DragState } from "../drag-drop/drag.state";

export class DraggableColumnComponent extends BaseComponent<ColumnOptions, ColumnState, DraggableColumnView> {
    constructor(container: HTMLElement | null, columnOptions: ColumnOptions) {
        super('DraggableColumn', ColumnState, DraggableColumnView, container, columnOptions);

        this.registerState(() => new DragState({}))
        this.registerController(() => new DragController<Column>(this.state.column));

        super.render();
    }
}

// ===

import { DragView } from "../drag-drop/drag.view";
import { ColumnComponent } from "./column.component";

export class DraggableColumnView extends DragView<ColumnState> {
    constructor(state: ColumnState) {
        super(state);
    }

    protected _render(fragment: DocumentFragment): void {
        const columnComponent = (this.createComponent(this.container, ColumnComponent, this.state) as ColumnComponent);
        columnComponent.eventEmitter.on('column-updated', (column: Column) => this.eventEmitter.emit('column-updated', column));

        const dragState = this.getRequiredState<DragState>(DragState.name);
        dragState.updateByKey('draggableArea', columnComponent.view.draggableArea, false);

        super._render(fragment);
    }
}

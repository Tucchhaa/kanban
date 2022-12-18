import { ColumnComponent } from "../components/column.component";
import { DragState } from "../drag-drop/drag.state";
import { DragView } from "../drag-drop/drag.view";
import { Column } from "../types";
import { ColumnState } from "./column.state";

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

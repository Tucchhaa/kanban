import { DragState } from "../drag-drop/drag.state";
import { DragView } from "../drag-drop/drag.view";
import { ColumnState } from "./column.state";
import { ColumnView } from "./column.view";

export class DraggableColumnView extends DragView<ColumnState> {
    private dragState: DragState;

    constructor() {
        super();

        this.dragState = this.getRequiredState<DragState>(DragState.name);
    }

    protected _render(fragment: DocumentFragment): void {
        this.dragState.updateByKey('draggableArea', (this.view as ColumnView).headingContainer, false);

        super._render(fragment);
    }
}

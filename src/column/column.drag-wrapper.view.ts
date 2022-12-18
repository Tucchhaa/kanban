import { DragView } from "../drag-drop/drag.view";
import { ColumnState } from "./column.state";

class ColumnDragWrapperView extends DragView<ColumnState> {
    constructor(state: ColumnState) {
        super(state, 'column-drag-wrapper');
    }
}
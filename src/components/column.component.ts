import { ColumnOptions, ColumnState } from "../column/column.state";
import { ColumnView } from "../column/column.view";
import { ColumnController } from "../column/column.controller";
import { BaseComponent } from "../base/component";
import { DropController } from "../drag-drop/drop.controller";
import { DropState } from "../drag-drop/drop.state";
import { Card, Column } from "../types";
import { DragState } from "../drag-drop/drag.state";
import { DragController } from "../drag-drop/drag.controller";
import { DropView } from "../drag-drop/drop.view";
import { DragView } from "../drag-drop/drag.view";

export class ColumnComponent extends BaseComponent<ColumnOptions, ColumnState, ColumnView> {
    constructor(container: HTMLElement | null, columnOptions: ColumnOptions | ColumnState) {
        super('Column', ColumnState, ColumnView, container, columnOptions);

        this.registerController(() => new ColumnController());

        // DROP
        const isAbleToDrop = (e: MouseEvent, dragElement: HTMLElement) => {
            const position = dragElement.getBoundingClientRect();

            const styles = getComputedStyle(dragElement);
            const marginLeft = parseInt(styles.marginLeft);
            const marginRight = parseInt(styles.marginRight);

            return e.clientY >= position.y - marginLeft && e.clientY <= position.y + position.height + marginRight;
        }

        this.registerState(() => new DropState<Card>({
            direction: 'vertical',
            isEqual: (cardA, cardB) => cardA.id === cardB.id
        }))
        this.extendView(() => new DropView());
        this.registerController(() => new DropController<Card>(isAbleToDrop));

        // DRAG
        this.registerState(() => new DragState());
        this.extendView(() => new DragView());
        this.registerController(() => new DragController<Column>(this.state.column));

        super.render();
    }
}
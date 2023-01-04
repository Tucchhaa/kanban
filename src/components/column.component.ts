import { ColumnOptions, ColumnState } from "../column/column.state";
import { ColumnView } from "../column/column.view";
import { ColumnController } from "../column/column.controller";
import { BaseComponent } from "../base/component";
import { DropController } from "../drag-drop/drop.controller";
import { DropState } from "../drag-drop/drop.state";
import { Card, Column } from "../types";
import { DragState } from "../drag-drop/drag.state";
import { DragController } from "../drag-drop/drag.controller";
import { DragView } from "../drag-drop/drag.view";
import { SharedDropController } from "../drag-drop/shared-drop.controller";
import { mouse } from "../utils/mouse-direction";

export class ColumnComponent extends BaseComponent<ColumnOptions, ColumnState, ColumnView> {
    constructor(container: HTMLElement | null, columnOptions: ColumnOptions | ColumnState) {
        super('Column', ColumnState, ColumnView, container, columnOptions);

        this.registerController(() => new ColumnController());

        // DROP
        const isAbleToDrop = (dragElement: HTMLElement) => {
            const mousePosition = mouse.getPosition();
            const position = dragElement.getBoundingClientRect();

            const styles = getComputedStyle(dragElement);
            const marginLeft = parseInt(styles.marginLeft);
            const marginRight = parseInt(styles.marginRight);

            return mousePosition.y >= position.y - marginLeft && mousePosition.y <= position.y + position.height + marginRight;
        }

        this.registerState(() => new DropState<Card>({
            direction: 'vertical',
            isEqual: (cardA, cardB) => cardA.id === cardB.id
        }));
        this.registerController(() => new DropController<Card>(isAbleToDrop));
        this.registerController(() => new SharedDropController<Card>());

        // DRAG
        this.registerState(() => new DragState());
        this.extendView(() => new DragView());
        this.registerController(() => new DragController<Column>(this.state.column));

        super.render();
    }
}
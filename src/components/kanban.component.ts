import { KanbanController } from "../kanban/kanban.controller";
import { KanbanOptions, KanbanState } from "../kanban/kanban.state";
import { KanbanView } from "../kanban/kanban.view";
import { BaseComponent } from "../base/component";
import { DropState } from "../drag-drop/drop.state";
import { Column } from "../types";
import { DropController } from "../drag-drop/drop.controller";
import { SharedDropManagerController } from "../drag-drop/shared-drop.manager.controller";
import { mouse } from "../utils/mouse";
import { GrabScrollController } from "../grab-scroll/grab-scroll.controller";
import { GrabScrollState } from "../grab-scroll/grab-scroll.state";

export class KanbanComponent extends BaseComponent<KanbanOptions, KanbanState, KanbanView> {
    constructor(container: HTMLElement | null, options: KanbanOptions) {
        super('Kanban', KanbanState, KanbanView, container, options);

        this.registerController(() => new KanbanController());

        // Shared drop
        const isAbleToDrop = (dropElement: HTMLElement) => {
            const mousePosition = mouse.position;
            const position = dropElement.getBoundingClientRect();

            return mousePosition.x >= position.x && mousePosition.x <= position.x + position.width;
        }
        this.registerController(() => new SharedDropManagerController(isAbleToDrop));

        // Drop
        this.registerState(() => new DropState<Column>({
            isItemsEqual: (cardA, cardB) => cardA.id === cardB.id,

            scrollBoundaryRange: 150,
            scrollSpeed: 100
        }))
        this.registerController(() => new DropController<Column>());

        // Grab scrolling
        this.registerState(() => new GrabScrollState({}));
        this.registerController(() => new GrabScrollController());

        super.render();
    }
}
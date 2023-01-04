import { KanbanController } from "../kanban/kanban.controller";
import { KanbanOptions, KanbanState } from "../kanban/kanban.state";
import { KanbanView } from "../kanban/kanban.view";
import { BaseComponent } from "../base/component";
import { DropState } from "../drag-drop/drop.state";
import { Column } from "../types";
import { DropController } from "../drag-drop/drop.controller";
import { SharedDropManagerController } from "../drag-drop/shared-drop.manager.controller";
import { mouse } from "../utils/mouse-direction";

export class KanbanComponent extends BaseComponent<KanbanOptions, KanbanState, KanbanView> {
    constructor(container: HTMLElement | null, options: KanbanOptions) {
        super('Kanban', KanbanState, KanbanView, container, options);

        this.registerController(() => new KanbanController());

        // Shared drop
        const isAbleToDrop = (dropElement: HTMLElement) => {
            const mousePosition = mouse.getPosition();
            const position = dropElement.getBoundingClientRect();

            return mousePosition.x >= position.x && mousePosition.x <= position.x + position.width;
        }
        this.registerController(() => new SharedDropManagerController(isAbleToDrop));

        // Drop
        this.registerState(() => new DropState<Column>({
            isEqual: (cardA, cardB) => cardA.id === cardB.id
        }))
        this.registerController(() => new DropController<Column>());

        super.render();
    }
}
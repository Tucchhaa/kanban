import { KanbanController } from "../kanban/kanban.controller";
import { KanbanOptions, KanbanState } from "../kanban/kanban.state";
import { KanbanView } from "../kanban/kanban.view";
import { BaseComponent } from "../base/component";
import { DropState } from "../drag-drop/drop.state";
import { Column } from "../types";
import { DropController } from "../drag-drop/drop.controller";
import { SharedDropController } from "../drag-drop/shared-drop.controller";
import { DropView } from "../drag-drop/drop.view";

export class KanbanComponent extends BaseComponent<KanbanOptions, KanbanState, KanbanView> {
    constructor(container: HTMLElement | null, options: KanbanOptions) {
        super('Kanban', KanbanState, KanbanView, container, options);

        this.registerController(() => new KanbanController());

        // Shared drop
        this.registerController(() => new SharedDropController());

        // Drop
        this.registerState(() => new DropState<Column>({
            isEqual: (cardA, cardB) => cardA.id === cardB.id
        }))
        this.extendView(() => new DropView());
        this.registerController(() => new DropController<Column>());

        super.render();
    }
}
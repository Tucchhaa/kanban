import { KanbanOptions } from "../types";
import { KanbanController } from "../kanban/kanban.controller";
import { KanbanState } from "../kanban/kanban.state";
import { KanbanView } from "../kanban/kanban.view";
import { BaseComponent } from "../base/component";

export class KanbanComponent extends BaseComponent<KanbanOptions, KanbanState, KanbanView, KanbanController> {
    constructor(container: HTMLElement | null, options: KanbanOptions) {
        super('Kanban', KanbanState, KanbanView, container, options, KanbanController);
    }
}
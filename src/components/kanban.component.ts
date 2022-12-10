import { KanbanOptions } from "../types";
import { KanbanController } from "../kanban/kanban.controller";
import { KanbanModel } from "../kanban/kanban.model";
import { KanbanView } from "../kanban/kanban.view";
import { BaseComponent } from "../base/component";

export class KanbanComponent extends BaseComponent<KanbanOptions, KanbanModel, KanbanView, KanbanController> {
    constructor(container: HTMLElement | null, options: KanbanOptions) {
        super('Kanban', KanbanModel, KanbanView, container, options, KanbanController);
    }
}
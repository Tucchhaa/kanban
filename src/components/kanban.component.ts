import { KanbanOptions } from "../types";
import { KanbanController } from "../kanban/kanban.controller";
import { KanbanModel } from "../kanban/kanban.model";
import { KanbanView } from "../kanban/kanban.view";

export class KanbanComponent {
    constructor(container: HTMLElement | null, options: KanbanOptions) {
        if(!container) {
            throw new Error('KanbanComponent container is not defined');
        }

        const model = new KanbanModel(options);
        const view = new KanbanView(model, container);
        
        new KanbanController(model, view);
    }
}
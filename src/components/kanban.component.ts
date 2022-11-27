import { KanbanOptions } from "../kanban/kanban.config";
import { KanbanModel } from "../kanban/kanban.model";
import { KanbanView } from "../kanban/kanban.view";

export class KanbanComponent {
    constructor(options: KanbanOptions) {
        if(!options.container) {
            throw new Error('kanban container is not defined');
        }

        const model = new KanbanModel(options.columns);
        const view = new KanbanView(model, options.container);
    }
}
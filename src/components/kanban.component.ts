import { isDefined } from "../helpers";
import { KanbanView } from "../kanban/kanban.view";

export class KanbanComponent {
    constructor(container: HTMLElement|null) {
        if(!isDefined(container)) {
            console.error('container is not defined');
            return;
        }

        new KanbanView(container!);
    }
}
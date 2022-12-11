import { KanbanComponent } from "./components/kanban.component";
import { KanbanOptions } from "./types";

window.addEventListener("load", () => {    
    const container = document.getElementById("kanban");

    const config: KanbanOptions = {
        columns: [{
            name: 'In Progress',
            id: 0,
            cards: [
                { id: 0, name: 'card 1' }, { id: 1, name: 'card 2' }, { id: 2, name: 'card 3' },
                { id: 3, name: 'card 1' }, { id: 4, name: 'card 2' }, { id: 5, name: 'card 3' },
                { id: 6, name: 'card 1' }, { id: 7, name: 'card 2' }, { id: 8, name: 'card 3' },
                { id: 9, name: 'card 1' }, { id: 10, name: 'card 2' }, { id: 11, name: 'card 3' },
                { id: 12, name: 'card 1' }, { id: 13, name: 'card 2' }, { id: 14, name: 'card 3' },
                { id: 15, name: 'card 1' }, { id: 16, name: 'card 2' }, { id: 17, name: 'card 3' }
            ]
        }, {
            name: 'Done',
            id: 1,
            cards: [{ id: 18, name: 'card 4' }, { id: 19, name: 'card 5' }, { id: 20, name: 'card 6' }]
        }]
    }

    new KanbanComponent(container, config);
});
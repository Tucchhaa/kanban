import { KanbanComponent } from "./components/kanban.component";
import { KanbanOptions } from "./types";

window.addEventListener("load", () => {    
    const container = document.getElementById("kanban");

    const config: KanbanOptions = {
        columns: [{
            name: 'In Progress',
            id: 0,
            cards: [
                { name: 'card 1' }, { name: 'card 2' }, { name: 'card 3' },
                { name: 'card 1' }, { name: 'card 2' }, { name: 'card 3' },
                { name: 'card 1' }, { name: 'card 2' }, { name: 'card 3' },
                { name: 'card 1' }, { name: 'card 2' }, { name: 'card 3' },
                { name: 'card 1' }, { name: 'card 2' }, { name: 'card 3' },
                { name: 'card 1' }, { name: 'card 2' }, { name: 'card 3' }
            ]
        }, {
            name: 'Done',
            id: 1,
            cards: [{ name: 'card 4' }, { name: 'card 5' }, { name: 'card 6' }]
        }]
    }

    new KanbanComponent(container, config);
});
import { KanbanComponent } from "./components/kanban.component";
import { KanbanOptions } from "./kanban/kanban.state";

/*
Known issues:
reopen editable-field - нужно передавать старое состояние при ререндере
перекрытия событий в eventEmitter: решение -> добавить неймспейсы

OPTIMIZATION: dragging: instead of iterating all cards on drag event, it is possible to add event listener on each card

BUG:
1) start drag
2) move card to another column
3) move card to its original position
4) drag end
=> Card is placed at the end

TODO:
scroll drop
local storage
delete card
scroll to down when adding card
save scroll position on renders
implement renderElements on all components
*/

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
            ]
        }, {
            name: 'Done',
            id: 1,
            cards: [
                { id: 18, name: 'card 4' }, { id: 19, name: 'card 5' },
                { id: 21, name: 'card 6 jsnda aksdn lsadm aas as lorem aksldm asdkl asld []wqekr saodj s wek nasda lskdan sdm lasjd kalns' }
            ]
        }, {
            name: 'Waiting',
            id: 2,
            cards: [
                { id: 9, name: 'card 1' }, { id: 10, name: 'card 2' }, { id: 11, name: 'card 3' },
                { id: 12, name: 'card 4' }, { id: 13, name: 'card 5' }, { id: 14, name: 'card 6' },
                { id: 15, name: 'card 7' }, { id: 16, name: 'card 8' }, { id: 17, name: 'card 9' },
                { id: 20, name: 'card 10' },
            ]
        }]
    }

    new KanbanComponent(container, config);
});
import { KanbanComponent } from "./components/kanban.component";
import { KanbanOptions } from "./kanban/kanban.state";

/*
Known issues:
reopen editable-field - нужно передавать старое состояние при ререндере
единый column component - нужно расширять view
refactor state
убрать методы в state которые меняют состояние. пример DropState.updateItems
drag-drop cards when column has scroll
user-select cards

BUG: start edit column name -> click any card

TODO:
rename column
rename card
drag and drop cards between columns
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
                { id: 18, name: 'card 4' }, { id: 19, name: 'card 5' }, { id: 20, name: 'card 6' },
                { id: 21, name: 'card 6 jsnda aksdn lsadm aas as lorem aksldm asdkl asld []wqekr saodj s wek nasda lskdan sdm lasjd kalns' }
            ]
        }, {
            name: 'Waiting',
            id: 2,
            cards: [
                { id: 9, name: 'card 1' }, { id: 10, name: 'card 2' }, { id: 11, name: 'card 3' },
                { id: 12, name: 'card 1' }, { id: 13, name: 'card 2' }, { id: 14, name: 'card 3' },
                { id: 15, name: 'card 1' }, { id: 16, name: 'card 2' }, { id: 17, name: 'card 3' }
            ]
        }]
    }

    new KanbanComponent(container, config);
});
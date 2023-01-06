import { KanbanComponent } from "./components/kanban.component";
import { KanbanOptions } from "./kanban/kanban.state";

/*
https://fontawesome.com/v4/icons/

Known issues:
reopen editable-field - нужно передавать старое состояние при ререндере
перекрытия событий в eventEmitter: решение -> добавить неймспейсы

OPTIMIZATION: dragging: instead of iterating all cards on drag event, it is possible to add event listener on each card

BUG:
1) scrollDirection is set even if no scrolling occuring
3) Drag column -> column name change starts

TODO:
local storage
do not render all columns on columnUpdate (scroll resets on columns)
when adding card -> mount element to .cards
grab kanban to scroll
animations
prompt component
*/

window.addEventListener("load", () => {    
    const container = document.getElementById("kanban");

    const config: KanbanOptions = {
        columns: [{
            name: 'Plans for day',
            id: 0,
            cards: [
                { id: 0, name: 'Learn chineese 1 hour' },
                { id: 1, name: 'Go to gym' },
                { id: 2, name: 'Prepare to Statistics exam' },
                { id: 3, name: 'Throw trash' },
                { id: 4, name: 'Wash clothes' },
                { id: 10, name: 'Complete Linux final project' },
            ]
        }, {
            name: 'Plans for week',
            id: 1,
            cards: [
                { id: 5, name: 'Visit Taipei 101' },
                { id: 6, name: 'Try new food' },
                { id: 7, name: 'Cook a dish' },
                { id: 8, name: 'Complete final project' },
                { id: 9, name: 'Find a part-time job' },
            ]
        }, {
            name: 'Books to read and films to watch',
            id: 2,
            cards: [
                { id: 11, name: '451 degrees fahrenheit' },
                { id: 12, name: 'State. Plato' },
                { id: 13, name: '1986' },
                { id: 14, name: 'Hunger Games' },
                { id: 15, name: 'Lord of the rings' },
                { id: 16, name: 'Avatar 2' },
                { id: 17, name: 'Doctor Strange 2' },
                { id: 18, name: 'Into the Spider-verse' },
                { id: 19, name: 'Black panther' },
                { id: 20, name: 'Avengers' },
                { id: 21, name: 'Bullet train' },
            ]
        }, {
            name: 'Favorite anime',
            id: 3,
            cards: [
                { id: 22, name: 'Attack on Titan' },
                { id: 23, name: 'Death note' },
                { id: 24, name: 'Code Geass' },
                { id: 25, name: 'The golden deity' },
                { id: 26, name: 'The future diary' },
                { id: 27, name: 'Reincarnation' },
                { id: 28, name: 'Code Geass 2' },
                { id: 29, name: 'Blame!' },
                { id: 30, name: 'Fairy Tail' },
                { id: 31, name: 'Jojo' },
                { id: 32, name: 'Game of friends' },
            ]
        }, {
            name: 'Motivation',
            id: 4,
            cards: [
                { id: 33, name: 'Stay away from those people who try to disparage your ambitions. Small minds will always do that, but great minds will give you a feeling that you can become great too' },
                { id: 34, name: 'When you give joy to other people, you get more joy in return. You should give a good thought to happiness that you can give out' },
                { id: 35, name: 'It is only when we take chances, when our lives improve. The initial and the most difficult risk that we need to take is to become honest' },
                { id: 36, name: 'We cannot solve problems with the kind of thinking we employed when we came up with them' },
                { id: 37, name: 'Learn as if you will live forever, live like you will die tomorrow' },
                { id: 38, name: 'When you change your thoughts, remember to also change your world' },
                { id: 39, name: 'Nature has given us all the pieces required to achieve exceptional wellness and health, but has left it to us to put these pieces together' },
                { id: 40, name: 'Develop success from failures. Discouragement and failure are two of the surest stepping stones to success' },
                { id: 41, name: 'There are three ways to ultimate success: The first way is to be kind. The second way is to be kind. The third way is to be kind.' },
                { id: 42, name: 'Success is peace of mind, which is a direct result of self-satisfaction in knowing you made the effort to become the best of which you are capable' },
                { id: 43, name: 'Success is getting what you want, happiness is wanting what you get' },
            ]
        }, {
            name: 'Empty column 1',
            id: 5,
            cards: []
        }, {
            name: 'Empty column 2',
            id: 6,
            cards: []
        }, {
            name: 'Empty column 3',
            id: 7,
            cards: []
        }, {
            name: 'Empty column 4',
            id: 8,
            cards: []
        }]
    }

    new KanbanComponent(container, config);
});
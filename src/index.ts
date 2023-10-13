import { KanbanComponent } from "./components/kanban.component";
import { KanbanOptions } from "./kanban/kanban.state";

/*
TODO:
local storage
when adding card -> mount element to .cards
animations
componentModule addClearableEventListener(docuemnt, event, handler)
*/

window.addEventListener("load", () => {    
    const container = document.getElementById("kanban");

    const config: KanbanOptions = {
        columns: [{
            name: 'Plans for day',
            id: 0,
            cards: [
                { id: 0, name: 'Learn chineese for 4 hours' },
                { id: 1, name: 'Go to gym' },
                { id: 2, name: 'Prepare to Physics mid-term' },
                { id: 3, name: 'Finish Khan Academy Calculus Unit 4' },
                { id: 4, name: 'Read book for 1 hour' },
                { id: 10, name: 'Solve couple Leetcode problems' },
            ]
        }, {
            name: 'Plans for month',
            id: 1,
            cards: [
                { id: 5, name: 'Visit Taipei 101' },
                { id: 6, name: 'Meet friends from Taichung' },
                { id: 7, name: 'Read "the man who laughs"' },
                { id: 8, name: 'Learn 200 new chinese characters' },
                { id: 9, name: 'Solve 100 Leetcode problems' },
            ]
        }, {
            name: 'Books to read and films to watch',
            id: 2,
            cards: [
                { id: 11, name: '451 degrees fahrenheit' },
                { id: 12, name: 'State. Plato' },
                { id: 13, name: '1986' },
                { id: 14, name: 'Daron Acemoglu. Why nations fail' },
                { id: 15, name: 'Lord of the rings' },
                { id: 16, name: 'Avatar 2' },
                { id: 17, name: 'Code da Vinci' },
                { id: 18, name: 'Into the Spider-verse' },
                { id: 19, name: 'Oppenheimer' },
                { id: 20, name: 'King Arthur: Legend of the Sword' },
                { id: 21, name: 'Bullet train' },
            ]
        }, {
            name: 'Favorite anime',
            id: 3,
            cards: [
                { id: 22, name: 'Attack on Titan' },
                { id: 46, name: 'Berserk' },
                { id: 47, name: 'Cowboy Bebop' },
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
                { id: 44, name: 'One-punch-man' },
                { id: 45, name: 'Darker than black' },
            ]
        }, {
            name: 'Motivation',
            id: 4,
            cards: [
                { id: 33, name: 'Stay away from those people who try to disparage your ambitions. Small minds will always do that, but great minds will give you a feeling that you can become great too' },
                { id: 34, name: 'When you give joy to other people, you get more joy in return. You should give a good thought to happiness that you can give out' },
                { id: 35, name: 'It is only when we take chances, when our lives improve. The initial and the most difficult risk that we need to take is to become honest' },
                { id: 36, name: 'The way to get started is to quit talking and begin doing.' },
                { id: 37, name: 'Do one thing every day that scares you.' },
                { id: 38, name: 'Well done is better than well said.' },
                { id: 39, name: 'Nature has given us all the pieces required to achieve exceptional wellness and health, but has left it to us to put these pieces together' },
                { id: 40, name: 'Develop success from failures. Discouragement and failure are two of the surest stepping stones to success' },
                { id: 41, name: 'There are three ways to ultimate success: The first way is to be kind. The second way is to be kind. The third way is to be kind.' },
                { id: 42, name: 'Don\'t worry when you are not recognized, but strive to be worthy of recognition' },
                { id: 43, name: 'Do not go where the path may lead, go instead where there is no path and leave a trail.' },
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
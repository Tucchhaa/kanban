export class KanbanView {
    constructor(container: HTMLElement) {
        const node = document.createElement('h1');
        node.innerText = 'hello world!';

        container.appendChild(node);
    }
}
import { KanbanComponent } from "./components/kanban.component";

window.addEventListener("load", () => {    
    const container = document.getElementById("kanban");
        
    new KanbanComponent(container);
});
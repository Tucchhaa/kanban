// import { Card } from "./card/card";
// import { Column } from "./column/column";
import { KanbanOptions } from "./kanban/kanban.config";

declare module 'mylib' {
    interface HTMLElement {
        // hello(): void;
        componentKanban(options: KanbanOptions): void;
    
        // componentColumn(container: HTMLElement | null, column: Column): void;
        
        // componentCard(container: HTMLElement | null, card: Card): void;
    }
}
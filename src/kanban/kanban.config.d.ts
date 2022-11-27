import { Column } from "../column/column";

export class KanbanOptions {
    columns!: Column[];
    container!: HTMLElement | null;
}
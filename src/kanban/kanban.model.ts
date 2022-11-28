import { EventEmitter } from "../base/event-emitter";
import { BaseState } from "../base/state";
import { Column, KanbanOptions } from "../types";

export class KanbanModel extends BaseState<KanbanOptions> {
    public get columns() {
        return this.state.columns!.slice(); 
    }

    // ===
    
    constructor(state: KanbanOptions) {
        const defaultState = {
            columns: []
        };

        super(state, defaultState);
    }

    public createColumn(columnName: string) {
        const created = new Column(columnName);

        this.updateByKey('columns', [...this.columns, created]);

        return created;
    }
}
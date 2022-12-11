import { BaseState } from "../base/state";
import { Column } from "../types";

export type KanbanOptions = {
    columns?: Column[];
}

export class KanbanState extends BaseState<KanbanOptions> {
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

    public createColumn(column: Column) {
        this.updateByKey('columns', [...this.columns, column]);
    }

    public updateColumn(updated: Column) {
        let isUpdated = false;

        this.updateBy(state => {
            for(const column of this.columns) {
                if(column.id === updated.id) {
                    Object.assign(column, updated);
                    isUpdated = true;
                    break;
                }
            }
        }, false);

        return isUpdated;
    } 
}
import { BaseState } from "../base/state";
import { Column } from "../types";

export type KanbanOptions = {
    columns?: Column[];
}

export class KanbanState extends BaseState<KanbanOptions> {
    public get columns() {
        return this.options.columns!.slice(); 
    }

    // ===
    
    constructor(options: KanbanOptions) {
        const defaultOptions = {
            columns: []
        };

        super(options, defaultOptions);
    }

    public createColumn(column: Column) {
        this.updateByKey('columns', [...this.columns, column]);
    }

    public updateColumn(updated: Column) {
        let isUpdated = false;

        this.updateBy(options => {
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
    
    public updateColumns(columns: Column[]) {
        this.updateBy((options) => { options.columns = columns });
    }
}
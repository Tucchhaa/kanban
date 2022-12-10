import { Dictionary } from "../types";
import { KanbanModel } from "./kanban.model";
import { KanbanView } from "./kanban.view";

export class KanbanController {
    private model: KanbanModel;
    private view: KanbanView;
    
    constructor(model: KanbanModel, view: KanbanView) {
        this.model = model;
        this.view = view;
        
        this.view.on('create-new-column', (columnName: string) => this._createNewColumn(columnName));
    }

    private _createNewColumn(columnName: string) {   
        this.model.createColumn(columnName);
    }
}
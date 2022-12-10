import { BaseController } from "../base/controller";
import { KanbanModel } from "./kanban.model";
import { KanbanView } from "./kanban.view";

export class KanbanController extends BaseController {
    private model: KanbanModel;
    private view: KanbanView;
    
    constructor(model: KanbanModel, view: KanbanView) {
        super();

        this.model = model;
        this.view = view;
        
        this.eventEmitter.on('create-new-column', (columnName: string) => this._createNewColumn(columnName));
    }

    private _createNewColumn(columnName: string) {   
        this.model.createColumn(columnName);
    }
}
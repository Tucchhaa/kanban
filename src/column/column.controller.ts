import { BaseController } from "../base/controller";
import { ColumnModel } from "./column.model";
import { ColumnView } from "./column.view";

export class ColumnController extends BaseController {
    private model: ColumnModel;
    private view: ColumnView;
    
    constructor(model: ColumnModel, view: ColumnView) {
        super();

        this.model = model;
        this.view = view;
        
        this.eventEmitter.on('create-new-card', (cardName: string) => this._createNewCard(cardName));
    }

    private _createNewCard(cardName: string) {   
        this.model.createCard(cardName);
    }
}
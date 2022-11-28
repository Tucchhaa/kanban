import { EditableFieldController } from "../editable-field/editable-field.controller";
import { ColumnModel } from "./column.model";
import { ColumnView } from "./column.view";

export class ColumnController {
    private model: ColumnModel;
    private view: ColumnView;
    
    constructor(model: ColumnModel, view: ColumnView) {
        this.model = model;
        this.view = view;
        
        this.view.on('create-new-card', (cardName: string) => this._createNewCard(cardName));
    }

    private _createNewCard(cardName: string) {   
        this.model.createCard(cardName);
    }
}
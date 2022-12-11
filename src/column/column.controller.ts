import { BaseController } from "../base/controller";
import { ColumnState } from "./column.state";
import { ColumnView } from "./column.view";

export class ColumnController extends BaseController {
    private state: ColumnState;
    private view: ColumnView;
    
    constructor(state: ColumnState, view: ColumnView) {
        super();

        this.state = state;
        this.view = view;
        
        this.eventEmitter.on('create-new-card', (cardName: string) => this._createNewCard(cardName));
    }

    private _createNewCard(cardName: string) {   
        this.state.createCard(cardName);
        this.state.onUpdateColumn(this.state.column);
    }
}
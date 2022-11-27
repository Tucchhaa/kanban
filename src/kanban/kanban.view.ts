import { throws } from "assert";
import { BaseView } from "../base/view";
import { ColumnComponent } from "../components/column.component";
import { KanbanModel } from "./kanban.model";

export class KanbanView extends BaseView<KanbanModel> {
    constructor(model: KanbanModel, container: HTMLElement) {
        super(model, container, ['kanban']);
    }

    protected _render(fragment: DocumentFragment): void {
        this._renderColumns(fragment);
        this._renderAddColumnsBtn(fragment);
    }

    private _renderColumns(fragment: DocumentFragment) {
        const columns = this.model.getColumns();

        for(const column of columns) {
            const columnContainer = this.createDOMElement('div', ['column']);

            new ColumnComponent(columnContainer, column);

            fragment.appendChild(columnContainer);
        }
    }

    private _renderAddColumnsBtn(fragment: DocumentFragment) {
        const addColumnBtn = this.createDOMElement('div', ['column', 'add-column']);

        addColumnBtn.innerText = '+ Add column';

        fragment.appendChild(addColumnBtn);
    }
}


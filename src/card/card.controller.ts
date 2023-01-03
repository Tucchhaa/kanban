import { BaseController } from "../base/controller";
import { StateChange } from "../base/state";
import { EditableFieldController } from "../editable-field/editable-field.controller";
import { CardState } from "./card.state";
import { CardView } from "./card.view";

export class CardController extends BaseController<CardState, CardView> {
    constructor() {
        super();

        this.eventEmitter
            .on('edit-field-opened', this.onEditFieldOpened.bind(this))
            .on('edit-field-closed', this.onEditFieldClosed.bind(this))

            .on('change-card-name-click', this.onChangeCardNameClick.bind(this))
            .on('delete-card-click', this.onDeleteCardClick.bind(this))

            .on('change-card-name', this.onChangeCardName.bind(this));
    }

    public stateChanged(change: StateChange): void {
        switch(change.name) {
            case 'isToolbarHidden':
                this.view.renderElement('toolbar');
                break;
            case 'card.name':
                break;
            default:
                this.render();
        }
    }

    private onEditFieldOpened() {
        this.state.updateByKey('isToolbarHidden', true);
        this.container.style.cursor = 'default';
        this.eventEmitter.emit('disable-drag');
    }

    private onEditFieldClosed() {
        this.state.updateByKey('isToolbarHidden', false);
        this.container.style.removeProperty('cursor');
        this.eventEmitter.emit('enable-drag');
    }

    private onChangeCardNameClick() {
        const editFieldController = this.view.editFieldComponent!.getRequiredController<EditableFieldController>(EditableFieldController.name);
    
        editFieldController.toggleInput(true);
        this.state.updateByKey('isToolbarHidden', true);
    }
    
    private onDeleteCardClick() {

    }

    private onChangeCardName(newName: string) {
        this.state.updateByKey('card.name', newName);

        this.eventEmitter.emit('update-card', this.state.card);
    }
}
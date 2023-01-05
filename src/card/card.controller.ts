import { BaseController } from "../base/controller";
import { StateChange } from "../base/state";
import { EditableFieldController } from "../editable-field/editable-field.controller";
import { CardState } from "./card.state";
import { CardView } from "./card.view";

export class CardController extends BaseController<CardState, CardView> {
    constructor() {
        super();

        this.eventEmitter
            .on('disable-card-drag', this.onDisableCardDrag.bind(this))
            .on('enable-card-drag', this.onEnableCardDrag.bind(this))

            .on('update-toolbar-state', this.onUpdateToolbarState.bind(this))

            .on('change-card-name-click', this.onChangeCardNameClick.bind(this))
            .on('delete-card-confirmed', this.onDeleteCardConfirmed.bind(this))
            .on('change-card-name', this.onChangeCardName.bind(this));
    }

    public stateChanged(change: StateChange): void {
        switch(change.name) {
            case 'toolbarState':
                this.view.renderElement('toolbar');
                break;
            case 'card.name':
                break;
            default:
                this.render();
        }
    }

    private onDisableCardDrag() {
        this.container.style.cursor = 'default';
        this.eventEmitter.emit('disable-drag');
    }

    private onEnableCardDrag() {
        this.container.style.removeProperty('cursor');
        this.eventEmitter.emit('enable-drag');
    }

    private onUpdateToolbarState(toolbarState: 'default' | 'hidden' | 'delete-prompt') {
        this.state.updateByKey('toolbarState', toolbarState);

    }

    private onChangeCardNameClick() {
        const editFieldController = this.view.editFieldComponent!.getRequiredController<EditableFieldController>(EditableFieldController.name);
    
        editFieldController.toggleInput(true);
        this.state.updateByKey('toolbarState', 'hidden');
    }

    private onChangeCardName(newName: string) {
        this.state.updateByKey('card.name', newName);

        this.eventEmitter.emit('update-card', this.state.card);
    }

    private onDeleteCardConfirmed() {
        this.eventEmitter.emit('delete-card', this.state.card);
    }
}
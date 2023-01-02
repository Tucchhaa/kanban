import { BaseController } from "../base/controller";
import { CardState } from "./card.state";

export class CardController extends BaseController<CardState> {
    constructor() {
        super();

        this.eventEmitter
            .on('change-card-name', this.onChangeCardName.bind(this));
    }

    private onChangeCardName(newName: string) {
        // this.state.updateBy(state => {
        //     state.card!.name = newName;
        // }, false);
        this.state.updateByKey('card.name', newName);

        this.eventEmitter.emit('update-card', this.state.card);
    }
}
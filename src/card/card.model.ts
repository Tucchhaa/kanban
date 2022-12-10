import { BaseState } from "../base/state";
import { Card } from "../types";

export class CardModel extends BaseState<Card> {
    public get name() {
        return this.state.name!;
    }

    constructor(state: Card) {
        const defaultState = {
            name: null
        }
        
        super(state, defaultState);
    }
}
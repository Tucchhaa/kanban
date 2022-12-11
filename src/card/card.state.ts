import { BaseState } from "../base/state";
import { Card, CardOptions } from "../types";

export class CardState extends BaseState<CardOptions> {
    public get card() {
        return this.state.card!;
    }

    constructor(state: CardOptions) {
        const defaultState = {
            card: null
        }
        
        super(state, defaultState);
    }
}
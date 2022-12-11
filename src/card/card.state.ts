import { BaseState } from "../base/state";
import { Card } from "../types";

export type CardOptions = {
    card?: Card;
}

export class CardState extends BaseState<CardOptions> {
    public get card() {
        return this.state.card!;
    }

    constructor(state: CardOptions) {
        const defaultState = {
            card: new Card("__empty-card__")
        }
        
        super(state, defaultState);
    }
}
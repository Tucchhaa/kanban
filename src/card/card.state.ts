import { BaseState, NewState } from "../base/state";
import { Card } from "../types";

export type CardOptions = {
    card?: Card;
}

export class CardState extends NewState<CardOptions> {
    public get card() {
        return this.options.card!;
    }

    constructor(options: CardOptions) {
        const defaultOptions = {
            card: new Card("__empty-card__")
        }
        
        super(defaultOptions, options);
    }
}
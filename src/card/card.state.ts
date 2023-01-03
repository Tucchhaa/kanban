import { BaseState } from "../base/state";
import { Card } from "../types";
import { CardController } from "./card.controller";

export type CardOptions = {
    card?: Card;
    isToolbarHidden?: boolean;
}

export class CardState extends BaseState<CardOptions> {
    public get card() {
        return this.options.card!;
    }

    public get isToolbarHidden() {
        return this.options.isToolbarHidden!;
    }

    constructor(options: CardOptions) {
        const defaultOptions: CardOptions = {
            card: new Card("__empty-card__"),
            isToolbarHidden: false
        }
        
        super(defaultOptions, options, [CardController]);
    }
}
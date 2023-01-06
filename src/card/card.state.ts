import { BaseState } from "../base/state";
import { Card } from "../types";
import { CardController } from "./card.controller";

export type CardOptions = {
    card?: Card;
    toolbarState?: 'default' | 'hidden' | 'delete-prompt';
}

export class CardState extends BaseState<CardOptions> {
    public get card() {
        return this.options.card!;
    }

    public get toolbarState() {
        return this.options.toolbarState!;
    }

    constructor(options: CardOptions) {
        const defaultOptions: CardOptions = {
            card: new Card("__empty-card__"),
            toolbarState: 'default'
        }
        
        super(defaultOptions, options, [CardController]);
    }
}
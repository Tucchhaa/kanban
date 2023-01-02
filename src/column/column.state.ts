import { BaseState } from "../base/state";
import { Card, Column } from "../types";
import { ColumnController } from "./column.controller";

export type ColumnOptions = {
    column?: Column;
}

export class ColumnState extends BaseState<ColumnOptions> {
    public get column() {
        return this.options.column!;
    }

    constructor(options: ColumnOptions) {
        const defaultOptions: ColumnOptions = {
            column: new Column('__empty-column__'),
        };

        super(defaultOptions, options, [ColumnController]);
    }

    public updateCard(id: number | string, card: Card) {
        this.updateBy(options => {
            const cardIndex = options.column!.cards.findIndex((card) => id === card.id);
            options.column!.cards[cardIndex] = card;
        });
    }

    public updateCards(cards: Card[]) {
        this.updateBy((options) => { options.column!.cards = cards });
    }

    public createCard(card: Card) {
        const updatedCards = [...this.column.cards, card];

        this.updateCards(updatedCards);
    }
}
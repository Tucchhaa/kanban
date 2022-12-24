import { BaseState } from "../base/state";
import { Card, Column } from "../types";

export type ColumnOptions = {
    column?: Column;
}

export class ColumnState extends BaseState<ColumnOptions> {
    public get column() {
        return this.options.column!;
    }

    public get columnCards() {
        return this.options.column!.cards!;
    }

    constructor(options: ColumnOptions) {
        const defaultOptions: ColumnOptions = {
            column: new Column('__empty-column__'),
        };

        super(options, defaultOptions);
    }

    public updateCards(cards: Card[]) {
        this.updateBy((options) => { options.column!.cards = cards });
    }

    public addCard(card: Card) {
        const updatedCards = [...this.columnCards!, card];

        this.updateCards(updatedCards);
    }
}
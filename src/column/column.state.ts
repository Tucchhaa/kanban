import { BaseState } from "../base/state";
import { Card, Column } from "../types";

export type ColumnOptions = {
    column?: Column;
}

export class ColumnState extends BaseState<ColumnOptions> {
    public get column() {
        return this.state.column!;
    }

    public get columnCards() {
        return this.state.column!.cards!;
    }

    constructor(state: ColumnOptions) {
        const defaultState: ColumnOptions = {
            column: new Column('__empty-column__'),
        };

        super(state, defaultState);
    }

    public updateCards(cards: Card[]) {
        this.updateBy((state) => { state.column!.cards = cards });
    }

    public addCard(card: Card) {
        const updatedCards = [...this.columnCards!, card];

        this.updateCards(updatedCards);
    }
}
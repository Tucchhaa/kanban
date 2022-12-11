import { BaseState } from "../base/state";
import { Card, Column } from "../types";

export type ColumnOptions = {
    column?: Column;
    onUpdateColumn?: ((column: Column) => void);
}

export class ColumnState extends BaseState<ColumnOptions> {
    public get column() {
        return this.state.column!;
    }

    public get columnCards() {
        return this.state.column!.cards!;
    }

    public get onUpdateColumn() {
        return this.state.onUpdateColumn!;
    }

    constructor(state: ColumnOptions) {
        const defaultState: ColumnOptions = {
            column: new Column('__empty-column__'),
            onUpdateColumn: () => {}
        };

        super(state, defaultState);
    }

    public updateCards(cards: Card[]) {
        this.updateBy((state) => { state.column!.cards = cards });
    }

    public createCard(cardName: string) {
        const created = new Card(cardName);
        const updatedCards = [...this.columnCards!, created];

        this.updateCards(updatedCards);
    }
}
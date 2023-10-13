import { BaseState } from "../base/state";
import { Card, Column } from "../types";
import { ColumnController } from "./column.controller";

export type ColumnOptions = {
    column?: Column;

    toolbarState?: 'default' | 'delete-prompt';
}

export class ColumnState extends BaseState<ColumnOptions> {
    public get column() {
        return this.options.column!;
    }

    public get toolbarState() {
        return this.options.toolbarState!;
    }

    constructor(options: ColumnOptions) {
        const defaultOptions: ColumnOptions = {
            column: new Column('__empty-column__'),
            toolbarState: 'default',
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

    public deleteCard(card: Card) {
        const updatedCards = this.column.cards.filter(_card => _card.id !== card.id);

        this.updateCards(updatedCards);
    }
}
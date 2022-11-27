import { EventEmitter } from "../base/event-emitter";
import { BaseState } from "../base/state";
import { Card, Column } from "../types";

export class ColumnModel extends BaseState<Column> {
    public get name() {
        return this.state.name!;
    }

    public get id() {
        return this.state.id!;
    }

    public get cards() {
        return this.state.cards!.slice();
    }

    constructor(state: Column) {
        const defaultState = {
            name: null,
            id: null,
            cards: []
        };

        super(state, defaultState);
    }

    public createCard(cardName: string) {
        const created = new Card(cardName);

        this.updateByKey('cards', [...this.cards, created]);

        return created;
    }
}
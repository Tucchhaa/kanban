export interface Dictionary<TValue> {
    [id: string]: TValue;
}

export class Column {
    name?: string;
    id?: number | string;
    cards?: Card[];

    constructor(name: string) {
        this.name = name;
        this.cards = [];
        this.id = "id";
    }
}

export class Card {
    id?: number | string;
    name?: string;

    constructor(name: string) {
        this.name = name;
    }
}
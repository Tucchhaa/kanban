export interface Dictionary<TValue> {
    [id: string]: TValue;
}

export class ButtonOptions {
    text?: string;
    onClick?: (event: MouseEvent) => any;
}

export class EditableFieldOptions {
    isOpen?: boolean;
    btnText?: string;
    value?: string;
    validationMsg?: string | null;
    placeholder?: string;
    onSubmit?: (value: string) => any;
    validation?: (value: string) => [boolean, string];
}

export class KanbanOptions {
    columns?: Column[];
}

export class ColumnOptions {
    column?: Column | null;
    onUpdateColumn?: ((column: Column) => void) | null;

    constructor(column: Column) {
        this.column = column;
    }
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

export class CardOptions {
    card?: Card | null;

    constructor(card: Card) {
        this.card = card;
    }
}

export class Card {
    id?: number | string;
    name?: string;

    constructor(name: string) {
        this.name = name;
    }
}
const noop = () => {};

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

export class Column {
    name?: string | null;
    id?: number | string | null;
    cards?: Card[] | null;

    constructor(name: string) {
        this.name = name;
        this.cards = [];
        this.id = "id";
    }
}

export class Card {
    name?: string | null;

    constructor(name: string) {
        this.name = name;
    }
}
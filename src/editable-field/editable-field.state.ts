import { BaseState } from "../base/state";
import { noop } from "../helpers";

export type EditableFieldOptions = {
    title?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;

    isOpen?: boolean;
    validationMsg?: string | null;
    prepareValue?: (value: string) => string,
    onSubmit?: (value: string) => any;
    validation?: (value: string) => [boolean, string];
}

export class EditableFieldState extends BaseState<EditableFieldOptions> {
    get title() {
        return this.state.title!;
    }

    get value() {
        return this.state.value!;
    }

    get defaultValue() {
        return this.state.defaultValue!;
    }

    get placeholder() {
        return this.state.placeholder!;
    }

    get isOpen() {
        return this.state.isOpen!;
    }


    get validationMsg() {
        return (this.state.validationMsg as string | null);
    }

    get prepareValue() {
        return this.state.prepareValue!;
    }

    get validation() {
        return this.state.validation!;
    }

    get onSubmit() {
        return this.state.onSubmit!;
    }

    constructor(state: EditableFieldOptions) {
        const defaultState: EditableFieldOptions = {
            title: 'toggle',
            value: "",
            defaultValue: "",
            placeholder: "",

            isOpen: false,
            validationMsg: null,
            prepareValue: value => value,
            onSubmit: noop,
            validation: () => [true, ""]
        };

        super(state, defaultState);
    }
}
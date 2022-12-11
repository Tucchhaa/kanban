import { BaseState } from "../base/state";
import { noop } from "../helpers";

export type EditableFieldOptions = {
    isOpen?: boolean;
    btnText?: string;
    value?: string;
    validationMsg?: string | null;
    placeholder?: string;
    onSubmit?: (value: string) => any;
    validation?: (value: string) => [boolean, string];
}

export class EditableFieldState extends BaseState<EditableFieldOptions> {
    get isOpen() {
        return this.state.isOpen!;
    }

    get btnText() {
        return this.state.btnText!;
    }

    get value() {
        return this.state.value!;
    }

    get placeholder() {
        return this.state.placeholder!;
    }

    get validationMsg() {
        return (this.state.validationMsg as string | null);
    }

    get validation() {
        return this.state.validation!;
    }

    get onSubmit() {
        return this.state.onSubmit!;
    }

    constructor(state: EditableFieldOptions) {
        const defaultState: EditableFieldOptions = {
            isOpen: false,
            btnText: 'toggle',
            value: "",
            validationMsg: null,
            placeholder: "",
            onSubmit: noop,
            validation: () => [true, ""]
        };
        
        super(state, defaultState);
    }
}
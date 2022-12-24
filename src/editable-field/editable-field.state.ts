import { BaseState } from "../base/state";
import { noop } from "../helpers";

export type EditableFieldOptions = {
    title?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;

    isOpen?: boolean;
    validationMsg?: string | null;

    submitOnOutsideClick?: boolean;
    buttonsTemplate?: (close: () => void, submit: () => void) => HTMLElement | undefined,
    
    prepareValue?: (value: string) => string,
    onSubmit?: (value: string) => void;
    onOpened?: () => void;
    onClosed?: () => void;
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

    get submitOnOutsideClick() {
        return this.state.submitOnOutsideClick!;
    }

    get buttonsTemplate() {
        return this.state.buttonsTemplate;
    }


    get prepareValue() {
        return this.state.prepareValue!;
    }

    get validation() {
        return this.state.validation!;
    }

    get onOpened() {
        return this.state.onOpened!;
    }

    get onClosed() {
        return this.state.onClosed!;
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
            
            submitOnOutsideClick: false,
            buttonsTemplate: undefined,

            prepareValue: value => value,
            validation: () => [true, ""],
            onOpened: noop,
            onClosed: noop,
            onSubmit: noop
        };

        super(state, defaultState);
    }
}
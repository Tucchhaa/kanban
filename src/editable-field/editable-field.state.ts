import { BaseState } from "../base/state";
import { noop } from "../helpers";

export type EditableFieldOptions = {
    title?: string;
    value?: string;
    // if true, editable field show value instead of title. In helps to 
    showValue?: boolean;
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
        return this.options.title!;
    }

    get value() {
        return this.options.value!;
    }

    get showValue() {
        return this.options.showValue!;
    }

    get placeholder() {
        return this.options.placeholder!;
    }


    get isOpen() {
        return this.options.isOpen!;
    }

    get validationMsg() {
        return (this.options.validationMsg as string | null);
    }

    get submitOnOutsideClick() {
        return this.options.submitOnOutsideClick!;
    }

    get buttonsTemplate() {
        return this.options.buttonsTemplate;
    }


    get prepareValue() {
        return this.options.prepareValue!;
    }

    get validation() {
        return this.options.validation!;
    }

    get onOpened() {
        return this.options.onOpened!;
    }

    get onClosed() {
        return this.options.onClosed!;
    }

    get onSubmit() {
        return this.options.onSubmit!;
    }

    constructor(options: EditableFieldOptions) {
        const defaultOptions: EditableFieldOptions = {
            title: 'toggle',
            value: "",
            showValue: false,
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

        super(options, defaultOptions);
    }
}
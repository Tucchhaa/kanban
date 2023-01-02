import { BaseState } from "../base/state";
import { noop } from "../helpers";

export type EditableFieldOptions = {
    title?: string;
    value?: string;
    // if true, editable field show value instead of title. In helps to 
    placeholder?: string;

    isOpen?: boolean;
    validationMsg?: string | null;

    submitOnOutsideClick?: boolean;
    resetValueOnClosed?: boolean;

    titleTemplate?: (open: () => void) => Node | undefined;
    buttonsTemplate?: (close: () => void, submit: () => void) => Node | undefined,

    submitBtnContent?: string;
    cancelBtnContent?: string;
    
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

    get placeholder() {
        return this.options.placeholder!;
    }

    // ===

    get isOpen() {
        return this.options.isOpen!;
    }

    get validationMsg() {
        return (this.options.validationMsg as string | null);
    }

    get submitOnOutsideClick() {
        return this.options.submitOnOutsideClick!;
    }

    get resetValueOnClosed() {
        return this.options.resetValueOnClosed!;
    }

    // ===

    get titleTemplate() {
        return this.options.titleTemplate;
    }

    get buttonsTemplate() {
        return this.options.buttonsTemplate;
    }

    get submitBtnContent() {
        return this.options.submitBtnContent!;
    }

    get cancelBtnContent() {
        return this.options.cancelBtnContent!;
    }

    // ===

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
            title: "",
            value: "",
            placeholder: "",

            isOpen: false,
            validationMsg: null,
            
            submitOnOutsideClick: false,
            resetValueOnClosed: true,

            titleTemplate: undefined,
            buttonsTemplate: undefined,
            submitBtnContent: 'submit',
            cancelBtnContent: 'cancel',

            prepareValue: value => value,
            validation: () => [true, ""],
            onOpened: noop,
            onClosed: noop,
            onSubmit: noop
        };

        super(defaultOptions, options);
    }
}
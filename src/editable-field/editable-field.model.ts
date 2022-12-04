import { BaseState } from "../base/state";
import { noop } from "../helpers";
import { EditableFieldOptions } from "../types";

export class EditableFieldModel extends BaseState<EditableFieldOptions> {
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
        return (this.state.placeholder as string);
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
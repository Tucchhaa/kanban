import { BaseState } from "../base/state";
import { noop } from "../helpers";
import { TogglableInputOptions } from "../types";

export class EditableFieldModel extends BaseState<TogglableInputOptions> {
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

    constructor(state: TogglableInputOptions) {
        const defaultState: TogglableInputOptions = {
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
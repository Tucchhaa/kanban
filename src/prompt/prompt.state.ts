import { BaseState } from "../base/state";
import { noop } from "../helpers";

export class PromptOptions {
    text?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export class PromptState extends BaseState<PromptOptions> {
    public get text() {
        return this.options.text!;
    }

    public get onConfirm() {
        return this.options.onConfirm!;
    }

    public get onCancel() {
        return this.options.onCancel!;
    }
    
    constructor(options: PromptOptions) {
        const defaultOptions: PromptOptions = {
            text: "",
            onConfirm: noop,
            onCancel: noop
        };

        super(defaultOptions, options);
    }
}
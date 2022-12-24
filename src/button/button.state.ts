import { BaseState } from "../base/state";
import { noop } from "../helpers";

export type ButtonOptions = {
    text?: string;
    onClick?: (event: MouseEvent) => any;
}

export class ButtonState extends BaseState<ButtonOptions> {
    get text() {
        return this.options.text!;
    }

    get onClick() {
        return this.options.onClick!;
    }

    constructor(state: ButtonOptions) {
        const defaultOptions = {
            text: "button",
            onClick: noop
        };
        
        super(state, defaultOptions);
    }
}
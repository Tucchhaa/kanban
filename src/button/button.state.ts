import { BaseState } from "../base/state";
import { noop } from "../helpers";

export type ButtonOptions = {
    text?: string;
    className?: string;
    onClick?: (event: MouseEvent) => any;
}

export class ButtonState extends BaseState<ButtonOptions> {
    get text() {
        return this.options.text!;
    }

    get className() {
        return this.options.className!;
    }

    get onClick() {
        return this.options.onClick!;
    }

    constructor(state: ButtonOptions) {
        const defaultOptions = {
            text: "button",
            className: "",
            onClick: noop
        };
        
        super(defaultOptions, state);
    }
}
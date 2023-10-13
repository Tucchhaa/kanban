import { BaseState } from "../base/state";
import { noop } from "../helpers";

export type ButtonOptions = {
    icon?: HTMLElement;
    text?: string;
    content?: HTMLElement;
    className?: string;
    onClick?: (event: MouseEvent) => any;
}

export class ButtonState extends BaseState<ButtonOptions> {
    get icon() {
        return this.options.icon;
    }

    get text() {
        return this.options.text!;
    }

    get content() {
        return this.options.content;
    }

    get className() {
        return this.options.className!;
    }

    get onClick() {
        return this.options.onClick!;
    }

    constructor(state: ButtonOptions) {
        const defaultOptions = {
            icon: undefined,
            text: "",
            content: undefined,
            className: "",
            onClick: noop
        };
        
        super(defaultOptions, state);
    }
}
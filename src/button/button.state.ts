import { BaseState } from "../base/state";
import { noop } from "../helpers";

export type ButtonOptions = {
    text?: string;
    onClick?: (event: MouseEvent) => any;
}

export class ButtonState extends BaseState<ButtonOptions> {
    get text() {
        return this.state.text!;
    }

    get onClick() {
        return this.state.onClick!;
    }

    constructor(state: ButtonOptions) {
        const defaultState = {
            text: "button",
            onClick: noop
        };
        
        super(state, defaultState);
    }
}
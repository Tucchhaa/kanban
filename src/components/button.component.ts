import { EventEmitter } from "stream";
import { BaseComponent } from "../base/component";
import { ButtonController } from "../button/button.controller";
import { ButtonState } from "../button/button.state";
import { ButtonView } from "../button/button.view";
import { ButtonOptions } from "../types";

export class ButtonComponent extends BaseComponent<ButtonOptions, ButtonState, ButtonView, ButtonController> {
    constructor(container: HTMLElement | null, options: ButtonOptions) {
        super('Button', ButtonState, ButtonView, container, options, ButtonController);
    }
}
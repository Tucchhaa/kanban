import { EventEmitter } from "stream";
import { BaseComponent } from "../base/component";
import { ButtonController } from "../button/button.controller";
import { ButtonModel } from "../button/button.model";
import { ButtonView } from "../button/button.view";
import { ButtonOptions } from "../types";

export class ButtonComponent extends BaseComponent<ButtonOptions, ButtonModel, ButtonView, ButtonController> {
    constructor(container: HTMLElement | null, options: ButtonOptions) {
        super('Button', ButtonModel, ButtonView, ButtonController, container, options);
    }
}
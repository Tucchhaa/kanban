import { EventEmitter } from "stream";
import { ButtonController } from "../button/button.controller";
import { ButtonModel } from "../button/button.model";
import { ButtonView } from "../button/button.view";
import { ButtonOptions } from "../types";

export class ButtonComponent {
    constructor(container: HTMLElement | null, options: ButtonOptions) {
        if(!container) {
            throw new Error('ButtonComponent container is not defined');
        }

        const model = new ButtonModel(options);
        const view = new ButtonView(model, container);

        new ButtonController(model, view);
    }
}
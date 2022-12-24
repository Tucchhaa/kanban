import { BaseComponent } from "../base/component";
import { ButtonController } from "../button/button.controller";
import { ButtonOptions, ButtonState } from "../button/button.state";
import { ButtonView } from "../button/button.view";

export class ButtonComponent extends BaseComponent<ButtonOptions, ButtonState, ButtonView> {
    constructor(container: HTMLElement | null, options: ButtonOptions) {
        super('Button', ButtonState, ButtonView, container, options);

        this.registerController(() => new ButtonController());

        super.render();
    }
}
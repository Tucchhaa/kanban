import { BaseController } from "../base/controller";
import { ButtonState } from "./button.state";
import { ButtonView } from "./button.view";

export class ButtonController extends BaseController<ButtonState, ButtonView> {
    constructor() {
        super();

        this.eventEmitter.on('click', (event: MouseEvent) => this.state.onClick(event));
    }
}
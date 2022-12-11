import { BaseController } from "../base/controller";
import { ButtonState } from "./button.state";
import { ButtonView } from "./button.view";

export class ButtonController extends BaseController {
    private state: ButtonState;
    private view: ButtonView;
    
    constructor(state: ButtonState, view: ButtonView) {
        super();

        this.state = state;
        this.view = view;
        
        this.eventEmitter.on('click', (event: MouseEvent) => this.state.onClick(event));
    }
}
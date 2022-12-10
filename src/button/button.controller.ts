import { BaseController } from "../base/controller";
import { ButtonModel } from "./button.model";
import { ButtonView } from "./button.view";

export class ButtonController extends BaseController {
    private model: ButtonModel;
    private view: ButtonView;
    
    constructor(model: ButtonModel, view: ButtonView) {
        super();

        this.model = model;
        this.view = view;
        
        this.eventEmitter.on('click', (event: MouseEvent) => this.model.onClick(event));
    }
}
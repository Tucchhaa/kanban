import { ButtonModel } from "./button.model";
import { ButtonView } from "./button.view";

export class ButtonController {
    private model: ButtonModel;
    private view: ButtonView;
    
    constructor(model: ButtonModel, view: ButtonView) {
        this.model = model;
        this.view = view;
        
        this.view.on('click', (event: MouseEvent) => this.model.onClick(event));
    }
}
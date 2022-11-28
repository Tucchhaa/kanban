import { BaseView } from "../base/view";
import { ButtonModel } from "./button.model";

export class ButtonView extends BaseView<ButtonModel> {
    constructor(model: ButtonModel, container: HTMLElement) {
        super(model, container);
    }

    protected _render(fragment: DocumentFragment): void {
        const btn = this.createDOMElement('button');

        btn.innerText = this.model.text;
        btn.className = this.model.text;
        btn.addEventListener('click', () => this.emit('click'));

        fragment.appendChild(btn);
    }
}
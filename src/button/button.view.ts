import { BaseView } from "../base/view";
import { ButtonState } from "./button.state";

export class ButtonView extends BaseView<ButtonState> {
    constructor() {
        super();
    }

    protected _render(fragment: DocumentFragment): void {
        const btn = this.createDOMElement('button');

        btn.innerHTML = this.state.text;
        btn.className = this.state.className;
        btn.addEventListener('click', () => this.eventEmitter.emit('click'));

        fragment.appendChild(btn);
    }
}
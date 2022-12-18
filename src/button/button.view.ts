import { BaseView } from "../base/view";
import { ButtonState } from "./button.state";

export class ButtonView extends BaseView<ButtonState> {
    constructor(state: ButtonState) {
        super(state);
    }

    protected _render(fragment: DocumentFragment): void {
        const btn = this.createDOMElement('button');

        btn.innerText = this.state.text;
        btn.className = this.state.text;
        btn.addEventListener('click', () => this.eventEmitter.emit('click'));

        fragment.appendChild(btn);
    }
}
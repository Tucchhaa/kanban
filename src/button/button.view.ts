import { BaseView } from "../base/view";
import { ButtonState } from "./button.state";

export class ButtonView extends BaseView<ButtonState> {
    constructor() {
        super();
    }

    protected _render(fragment: DocumentFragment): void {
        const btn = this.createDOMElement('button');

        const content = this.state.content ?? this.createContent();

        btn.appendChild(content);
        btn.className = this.state.className;
        btn.addEventListener('click', () => this.eventEmitter.emit('click'));

        fragment.appendChild(btn);
    }

    private createContent() {
        const fragment = document.createDocumentFragment();

        if(this.state.icon)
            fragment.append(this.state.icon);

        if(this.state.text) {
            const textElement = this.createDOMElement('span');
            textElement.innerText = this.state.text;

            fragment.append(textElement);
        }

        return fragment;
    }
}
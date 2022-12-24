import { BaseView } from "../base/view";
import { DragView } from "../drag-drop/drag.view";
import { CardState } from "./card.state";

export class CardView extends BaseView<CardState> {
    constructor() {
        super(['card']);
    }

    protected _render(fragment: DocumentFragment): void {
        const text = this.createDOMElement('span');
        text.innerText = this.state.card.name!;

        fragment.appendChild(text);
    }
}
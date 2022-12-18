import { DragView } from "../drag-drop/drag.view";
import { CardState } from "./card.state";

export class CardView extends DragView<CardState> {
    constructor(state: CardState) {
        super(state, ['card']);
    }

    protected render(fragment: DocumentFragment): void {
        const text = this.createDOMElement('span');
        text.innerText = this.state.card.name!;

        fragment.appendChild(text);

        super.render(fragment);
    }
}
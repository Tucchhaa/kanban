import { DragView } from "../drag-drop/drag.view";
import { CardModel } from "./card.model";

export class CardView extends DragView<CardModel> {
    constructor(model: CardModel, container: HTMLElement) {
        super(model, container, ['card']);
    }

    protected render(fragment: DocumentFragment): void {
        const text = this.createDOMElement('span');
        text.innerText = this.model.name;
        
        fragment.appendChild(text);

        super.render(fragment);
    }
}
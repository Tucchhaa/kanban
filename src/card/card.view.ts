import { BaseView } from "../base/view";
import { Card } from "./card";
import { CardModel } from "./card.model";

export class CardView extends BaseView<CardModel> {
    constructor(model: CardModel, container: HTMLElement) {
        super(model, container, ['card']);
    }

    protected _render(fragment: DocumentFragment): void {
        const card = this.model.getCard();
        
        const text = this.createDOMElement('span');
        text.innerText = card.name;
        
        fragment.appendChild(text);
    }

}
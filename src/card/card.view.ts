import { BaseView } from "../base/view";
import { Card } from "../types";
import { CardModel } from "./card.model";

export class CardView extends BaseView<CardModel> {
    constructor(model: CardModel, container: HTMLElement) {
        super(model, container, ['card']);
    }

    protected _render(fragment: DocumentFragment): void {
        const text = this.createDOMElement('span');
        text.innerText = this.model.name;
        
        fragment.appendChild(text);
    }

}
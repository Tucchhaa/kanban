
import { Console } from "console";
import { EventEmitter } from "../base/event-emitter";
import { BaseView } from "../base/view";
import { processClasses } from "../helpers";
import { Card } from "../types";
import { CardModel } from "./card.model";

abstract class DraggableView<TState extends EventEmitter> extends BaseView<TState> {
    constructor(model: TState, container: HTMLElement, classes?: string[] | string) {
        const _classes = ['draggable', ...processClasses(classes)];
        super(model, container, _classes);
    }

    protected _render(fragment: DocumentFragment): void {
        let sizes: { width: number, height: number }; 
        let offset: { x: number, y: number };

        const dragStart = (e: MouseEvent) => {
            e.preventDefault();
            
            sizes = this.getElementSizes(this.container);
            offset = this.getMouseOffsetInElement(this.container, e);

            this.container.style.position = 'absolute';
            this.container.style.width = sizes.width + 'px';
            this.container.style.height = sizes.height + 'px';
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        };

        const drag = (e: MouseEvent) => {
            console.log(e);
            this.container.style.top = (e.clientY - offset.y) + 'px';
            this.container.style.left = (e.clientX - offset.x) + 'px';
        }

        const dragEnd = (e: MouseEvent) => {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
        };
        
        this.container.addEventListener('mousedown', dragStart);
    }

    private getElementSizes(element: HTMLElement) {
        var css = getComputedStyle(element);

        var paddingX = parseFloat(css.paddingLeft) + parseFloat(css.paddingRight);
        var paddingY = parseFloat(css.paddingTop) + parseFloat(css.paddingBottom);

        var borderX = parseFloat(css.borderLeftWidth) + parseFloat(css.borderRightWidth);
        var borderY = parseFloat(css.borderTopWidth) + parseFloat(css.borderBottomWidth);

        // Element width and height minus padding and border
        const width = element.offsetWidth - paddingX - borderX;
        const height = element.offsetHeight - paddingY - borderY;

        return { width, height };
    }

    private getMouseOffsetInElement(element: HTMLElement, e: MouseEvent) {
        return {
            x: e.clientX - element.offsetLeft,
            y: e.clientY - element.offsetTop
        };
    }
}

export class CardView extends DraggableView<CardModel> {
    constructor(model: CardModel, container: HTMLElement) {
        super(model, container, ['card']);
    }

    protected _render(fragment: DocumentFragment): void {
        const text = this.createDOMElement('span');
        text.innerText = this.model.name;
        
        fragment.appendChild(text);

        super._render(fragment);
    }

}
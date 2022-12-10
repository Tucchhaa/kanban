import { EventEmitter } from "../base/event-emitter";

export class DragController {
    private view: EventEmitter;
    
    private _dragElement: HTMLElement;
    public get dragElement() {
        return this._dragElement;
    }
    
    constructor(view: EventEmitter, element: HTMLElement) {
        this.view = view;
        this._dragElement = element;
        
        this.view.on('drag-start', (e: MouseEvent) => this.dragStart(e));
        this.view.on('drag', (e: MouseEvent) => this.drag(e));
        this.view.on('drag-end', (e: MouseEvent) => this.dragEnd(e));
    }

    private _sizes: { width: number, height: number } = { width: 50, height: 50 };
    public get sizes() {
        return this._sizes;
    }
    
    private offset: { x: number, y: number } = { x: 50, y: 50 };

    // ===

    private dragStart(e: MouseEvent) {
        e.preventDefault();
            
        this._sizes = this.getElementSizes(this._dragElement);
        this.offset = this.getMouseOffsetInElement(this._dragElement, e);

        this._dragElement.style.position = 'absolute';
        this._dragElement.style.width = this._sizes.width + 'px';
        this._dragElement.style.height = this._sizes.height + 'px';

        this.drag(e);
    }

    private drag(e: MouseEvent) {
        this._dragElement.style.top = (e.clientY - this.offset.y) + 'px';
        this._dragElement.style.left = (e.clientX - this.offset.x) + 'px';
    }
    
    private dragEnd(e: MouseEvent) {
        this._dragElement.style.position = "";
        this._dragElement.style.top = "";
        this._dragElement.style.left = "";
    }

    private getElementSizes(element: HTMLElement) {
        var css = getComputedStyle(element);

        var paddingX = parseFloat(css.paddingLeft) + parseFloat(css.paddingRight);
        var paddingY = parseFloat(css.paddingTop) + parseFloat(css.paddingBottom);

        var borderX = parseFloat(css.borderLeftWidth) + parseFloat(css.borderRightWidth);
        var borderY = parseFloat(css.borderTopWidth) + parseFloat(css.borderBottomWidth);

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

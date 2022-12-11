import { BaseController } from "../base/controller";

export class DragController<ItemType extends object> extends BaseController {
    private _item: ItemType;
    private _element: HTMLElement;
    
    constructor(item: ItemType, element: HTMLElement) {
        super();

        this._item = item;
        this._element = element;
        
        this.eventEmitter.on('drag-start', (e: MouseEvent) => this.dragStart(e));
        this.eventEmitter.on('drag', (e: MouseEvent) => this.drag(e));
        this.eventEmitter.on('drag-end', (e: MouseEvent) => this.dragEnd(e));
    }

    private _sizes: { width: number, height: number } = { width: 50, height: 50 };
    private offset: { x: number, y: number } = { x: 50, y: 50 };
    
    // ===

    public get item() {
        return this._item;
    }
    
    public get element() {
        return this._element;
    }

    public get sizes() {
        return this._sizes;
    }

    // ===

    private dragStart(e: MouseEvent) {
        e.preventDefault();
            
        this._sizes = this.getElementSizes(this._element);
        this.offset = this.getMouseOffsetInElement(this._element, e);

        this._element.style.position = 'absolute';
        this._element.style.width = this._sizes.width + 'px';
        this._element.style.height = this._sizes.height + 'px';

        this.drag(e);
    }

    private drag(e: MouseEvent) {
        this._element.style.top = (e.clientY - this.offset.y) + 'px';
        this._element.style.left = (e.clientX - this.offset.x) + 'px';
    }
    
    private dragEnd(e: MouseEvent) {
        this._element.style.position = "";
        this._element.style.top = "";
        this._element.style.left = "";
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

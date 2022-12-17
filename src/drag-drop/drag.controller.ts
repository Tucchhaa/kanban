import { BaseController } from "../base/controller";

export class DragController<ItemType extends object> extends BaseController {
    private _item: ItemType;
    
    constructor(item: ItemType) {
        super();

        this._item = item;
        
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
        return this.container;
    }

    public get sizes() {
        return this._sizes;
    }

    // ===

    private dragStart(e: MouseEvent) {
        e.preventDefault();

        this.element.classList.add('state-dragging');
        this.element.style.cursor = 'grabbing';

        this._sizes = this.getElementSizes(this.element);
        this.offset = this.getMouseOffsetInElement(this.element, e);

        this.element.style.position = 'absolute';
        this.element.style.width = this._sizes.width + 'px';
        this.element.style.height = this._sizes.height + 'px';

        this.drag(e);
    }

    private drag(e: MouseEvent) {
        this.element.style.top = (e.clientY - this.offset.y) + 'px';
        this.element.style.left = (e.clientX - this.offset.x) + 'px';
    }
    
    private dragEnd(e: MouseEvent) {
        this.element.classList.remove('state-dragging');
        this.element.style.removeProperty('cursor');
        
        this.element.style.removeProperty('position');
        this.element.style.removeProperty('top');
        this.element.style.removeProperty('left');

        this.element.style.removeProperty('width');
        this.element.style.removeProperty('height');
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

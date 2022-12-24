import { BaseController } from "../base/controller";
import { DragState } from "./drag.state";

export class DragController<TItem extends object> extends BaseController {
    private state: DragState;

    private _item: TItem;
    private _element: HTMLElement;
    
    constructor(item: TItem) {
        super();
        
        this.state = this.getRequiredState<DragState>(DragState.name);

        this._item = item;
        this._element = this.container;
        
        this.eventEmitter
            .on('drag-start', (e: MouseEvent) => this.dragStart(e))
            .on('drag', (e: MouseEvent) => this.drag(e))
            .on('drag-end', (e: MouseEvent) => this.dragEnd(e))

            .on('disable-drag', () => this.disableDrag())
            .on('enable-drag', () => this.enableDrag());
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
        this.state.updateByKey('isDragging', true, false);

        this.element.classList.add('state-dragging');
        this.element.style.cursor = 'grabbing';

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
        this.state.updateByKey('isDragging', false, false);
        this.element.classList.remove('state-dragging');

        this.element.style.removeProperty('cursor');
        
        this.element.style.removeProperty('position');
        this.element.style.removeProperty('top');
        this.element.style.removeProperty('left');

        this.element.style.removeProperty('width');
        this.element.style.removeProperty('height');
    }

    private getElementSizes(element: HTMLElement) {
        let css = getComputedStyle(element);

        let paddingX = parseFloat(css.paddingLeft) + parseFloat(css.paddingRight);
        let paddingY = parseFloat(css.paddingTop) + parseFloat(css.paddingBottom);

        let borderX = parseFloat(css.borderLeftWidth) + parseFloat(css.borderRightWidth);
        let borderY = parseFloat(css.borderTopWidth) + parseFloat(css.borderBottomWidth);


        let width = element.offsetWidth;
        let height = element.offsetHeight;

        if(css.boxSizing !== 'border-box') {
            width = width - paddingX - borderX;
            height = height - paddingY - borderY;
        }

        return { width, height };
    }

    private getMouseOffsetInElement(element: HTMLElement, e: MouseEvent) {
        return {
            x: e.clientX - element.offsetLeft,
            y: e.clientY - element.offsetTop
        };
    }

    // ===
    private disableDrag() {
        this.state.updateByKey('disabled', true, false);
    }

    private enableDrag() {
        this.state.updateByKey('disabled', false, false);
    }
}

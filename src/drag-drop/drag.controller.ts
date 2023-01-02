import { BaseController } from "../base/controller";
import { mouse } from "../utils/mouse-direction";
import { DragState } from "./drag.state";

export class DragController<TItem extends object> extends BaseController {
    private dragState: DragState;

    private _item: TItem;
    private _element: HTMLElement;
    
    constructor(item: TItem) {
        super();
        
        this.dragState = this.getRequiredState<DragState>(DragState.name);

        this._item = item;
        this._element = this.container;
        
        this.eventEmitter
            .on('drag-start', this.onDragStart.bind(this))
            .on('drag', this.onDrag.bind(this))
            .on('drag-end', this.dragEnd.bind(this))

            .on('disable-drag', this.onDisableDrag.bind(this))
            .on('enable-drag', this.onEnableDrag.bind(this));
    }

    private _sizes: { width: number, height: number } = { width: 50, height: 50 };
    private mouseOffset: { x: number, y: number } = { x: 50, y: 50 };
    
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

    private onDragStart(e: MouseEvent) {
        e.preventDefault();
        mouse.setPosition(e);
        this.dragState.updateByKey('isDragging', true);

        this.element.classList.add('state-dragging');
        this.element.style.cursor = 'grabbing';

        this._sizes = this.getElementSizes(this._element);
        this.mouseOffset = this.getMouseOffsetInElement(this._element, e);

        this._element.style.position = 'fixed';
        this._element.style.width = this._sizes.width + 'px';
        this._element.style.height = this._sizes.height + 'px';

        this.onDrag(e);
    }

    private onDrag(e: MouseEvent) {
        mouse.setPosition(e);

        this._element.style.top = (e.clientY - this.mouseOffset.y) + 'px';
        this._element.style.left = (e.clientX - this.mouseOffset.x) + 'px';
    }
    
    private dragEnd(e: MouseEvent) {
        this.dragState.updateByKey('isDragging', false);
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
        const position = element.getBoundingClientRect();

        return {
            x: e.clientX - position.left,
            y: e.clientY - position.top
        };
    }

    // ===
    private onDisableDrag() {
        this.dragState.updateByKey('disabled', true);
    }

    private onEnableDrag() {
        this.dragState.updateByKey('disabled', false);
    }
}

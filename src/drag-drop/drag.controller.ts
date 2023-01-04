import { BaseController } from "../base/controller";
import { StateChange } from "../base/state";
import { UndefinedViewPropertyError } from "../utils/errors";
import { mouse } from "../utils/mouse";
import { DragState } from "./drag.state";

export class DragController<TItem extends object> extends BaseController {
    private dragState: DragState;

    public readonly item: TItem;

    private _element?: HTMLElement;
    private _wrapperElement?: HTMLElement;
    private shadowElement: HTMLElement = document.createElement('div');
    
    constructor(item: TItem) {
        super();
        
        this.dragState = this.getRequiredState<DragState>(DragState.name);

        this.item = item;

        this.eventEmitter
            .on('drag-start', this.onDragStart.bind(this))
            .on('drag', this.onDrag.bind(this))
            .on('drag-end', this.onDragEnd.bind(this))

            .on('disable-drag', this.onDisableDrag.bind(this))
            .on('enable-drag', this.onEnableDrag.bind(this))

            .on('rendered', () => {
                const { dragElement, dragWrapperElement } = this.view as any;

                if(!dragElement)
                    throw new UndefinedViewPropertyError(DragController.name, this.componentName, 'dragElement');


                if(!dragElement)
                    throw new UndefinedViewPropertyError(DragController.name, this.componentName, 'dragWrapperElement');

                this._element = dragElement;
                this._wrapperElement = dragWrapperElement;

                this._element?.classList.add('draggable');
                this._wrapperElement?.classList.add('draggable-wrapper');
            });
    }

    private _sizes: { width: number, height: number } = { width: 50, height: 50 };
    private mouseOffset: { x: number, y: number } = { x: 50, y: 50 };

    // ===

    public get element() {
        return this._element!;
    }

    public get wrapperElement() {
        return this._wrapperElement!;
    }

    // ===

    public stateChanged(change: StateChange): void {
        switch(change.name) {
            case "isDragging":
            case "disabled":
                break;
            
            default:
                this.render();
        }
    }

    // ===

    private onDragStart(e: MouseEvent) {
        e.preventDefault();

        this.dragState.updateByKey('isDragging', true);

        this._sizes = this.getElementSizes(this.element);
        this.mouseOffset = this.getMouseOffsetInElement(this.element, e);

        this.showShadow();
        this.addDragStyles();

        this.onDrag();
    }

    private onDrag() {
        const mousePosition = mouse.position;

        this.element.style.top = (mousePosition.y - this.mouseOffset.y) + 'px';
        this.element.style.left = (mousePosition.x - this.mouseOffset.x) + 'px';
    }
    
    private onDragEnd() {
        this.dragState.updateByKey('isDragging', false);

        this.hideShadow();
        this.removeDragStyles();
    }

    // === Calculations

    private getElementSizes(element: HTMLElement) {
        let width = element.offsetWidth;
        let height = element.offsetHeight;

        if(this.elementStyles.boxSizing !== 'border-box') {
            const paddingX = this.elementStyles.paddingX;
            const paddingY = this.elementStyles.paddingY;
    
            const borderX = this.elementStyles.borderX;
            const borderY = this.elementStyles.borderY;

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

    private _elementStyles: any;

    private get elementStyles() {
        if(!this._elementStyles)
            this.calculateElementStyles();

        return this._elementStyles;
    }

    private calculateElementStyles() {
        const styles = getComputedStyle(this.element);
        
        const computedStyles: any = {
            paddingLeft:   parseFloat(styles.paddingLeft),
            paddingRight:  parseFloat(styles.paddingRight),
            paddingTop:    parseFloat(styles.paddingTop),
            paddingBottom: parseFloat(styles.paddingBottom),

            borderLeftWidth:   parseFloat(styles.borderLeftWidth),
            borderRightWidth:  parseFloat(styles.borderRightWidth),
            borderTopWidth:    parseFloat(styles.borderTopWidth),
            borderBottomWidth: parseFloat(styles.borderBottomWidth),

            margin: styles.margin,
            boxSizing: styles.boxSizing
        }

        computedStyles.paddingX = computedStyles.paddingLeft + computedStyles.paddingRight; 
        computedStyles.paddingY = computedStyles.paddingTop + computedStyles.paddingBottom; 
        computedStyles.borderX = computedStyles.borderLeftWidth + computedStyles.borderRightWidth; 
        computedStyles.borderY = computedStyles.borderTopWidth + computedStyles.borderBottomWidth; 

        this._elementStyles = computedStyles;
    }

    // === Styles

    private showShadow() {
        this.shadowElement.classList.add('shadow');

        this.shadowElement.style.margin = this.elementStyles.margin;
        this.shadowElement.style.width = this.element.clientWidth + 'px';
        this.shadowElement.style.height = this.element.clientHeight + 'px';
        
        this.element.before(this.shadowElement);
    }

    private hideShadow() {
        this.shadowElement.remove();
    }

    private addDragStyles() {
        this.element.classList.add('state-dragging');

        this.element.style.cursor = 'grabbing';

        this.element.style.position = 'fixed';

        this.element.style.width = this._sizes.width + 'px';
        this.element.style.height = this._sizes.height + 'px';
    }

    private removeDragStyles() {
        this.element.classList.remove('state-dragging');

        this.element.style.removeProperty('cursor');

        this.element.style.removeProperty('position');
        this.element.style.removeProperty('top');
        this.element.style.removeProperty('left');

        this.element.style.removeProperty('width');
        this.element.style.removeProperty('height');
    }

    // === Disabled
    private onDisableDrag() {
        this.dragState.updateByKey('disabled', true);
    }

    private onEnableDrag() {
        this.dragState.updateByKey('disabled', false);
    }
}

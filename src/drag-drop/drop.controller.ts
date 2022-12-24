import { BaseComponentType } from "../base/component";
import { BaseController } from "../base/controller";
import { isMouseInsideElement } from "../helpers";
import { MouseDirection } from "../utils/mouse-direction";
import { DragController } from "./drag.controller";
import { DropState } from "./drop.state";

export class DropController<TItem extends object> extends BaseController {
    private dropState: DropState<TItem>;
    
    private draggingDirection: 'horizontal' | 'vertical';
    private drags: BaseComponentType[] = [];
    private shadowElement: HTMLElement = document.createElement('div');
    private mouseDirection: MouseDirection = new MouseDirection();
    private shadowIndex: number = -1;
    private isItemsEqual: (itemA: any, itemB: any) => boolean;

    constructor() {
        super();

        this.dropState = this.getRequiredState<DropState<TItem>>(DropState.name);
        this.draggingDirection = this.dropState.direction;
        this.isItemsEqual = this.dropState.isEqual();
        
        this.eventEmitter
            .on('process-drag', this.onProcessDrag.bind(this))
            .on('update-items', this.onUpdateItems.bind(this));
    }

    public onProcessDrag(drag: BaseComponentType) {
        this.drags.push(drag);
        
        const dragController = drag.getRequiredController<DragController<TItem>>(DragController.name);
        
        drag.eventEmitter.on('drag-start', (e: MouseEvent) => this.onDragStart(e, dragController));
        drag.eventEmitter.on('drag', (e: MouseEvent) => this.onDrag(e, dragController));
        drag.eventEmitter.on('drag-end', (e: MouseEvent) => this.onDragEnd(e, dragController))
    }

    private onDragStart(e: MouseEvent, dragController: DragController<TItem>) {
        this.showShadow(dragController.element)

        this.shadowIndex = this.getIndex(dragController.item);
        this.mouseDirection.setMousePosition(e);
    }

    private getIndex(item: any): number {
        for(let index=0; index < this.dropState.items.length; index++) {
            const itemB = this.dropState.items[index];

            if(this.isItemsEqual(item, itemB)) {
                return index;
            }
        }

        return -1;
    }

    private onDrag(e: MouseEvent, dragController: DragController<TItem>) {
        const currentDragElement = dragController.element;

        this.mouseDirection.calculateMouseDirection(e);

        for(let index=0; index < this.drags.length; index++) {
            const drag = this.drags[index];
            const dragElement = drag.container; 
        
            if(dragElement !== currentDragElement && isMouseInsideElement(e, dragElement)) {
                const isInsertBefore = this.isInsertBefore();
                
                if(isInsertBefore) {
                    dragElement.before(this.shadowElement);
                    this.shadowIndex = index;
                }
                else {
                    dragElement.after(this.shadowElement);
                    this.shadowIndex = index + 1; 
                }

                break;
            }
        }
    }

    private onDragEnd(e: MouseEvent, dragController: DragController<TItem>) {
        this.hideShadow();
        this.updateItemsOrder(dragController);
    }

    private updateItemsOrder(dragController: DragController<TItem>) {
        const items = this.dropState.items;
        const currentItem = dragController.item;
        const newOrder: any[] = [];
        const insertBeforeIndex = this.shadowIndex;

        for(let index=0; index < items.length; index++) {
            const item = items[index];

            if(index === insertBeforeIndex)
                newOrder.push(currentItem);

            if(this.isItemsEqual(item, currentItem)) {
                continue;
            }
            
            newOrder.push(item);
        }

        if(insertBeforeIndex === items.length)
            newOrder.push(currentItem);

        this.eventEmitter.emit('update-items-order', newOrder);
    }

    private onUpdateItems(items: any) {
        this.shadowIndex = -1;
        this.dropState.updateItems(items);
        this.drags = [];
    }

    private showShadow(element: HTMLElement) {
        this.shadowElement.classList.add('shadow');
        this.shadowElement.style.display = 'block';
        this.shadowElement.style.margin = getComputedStyle(element).margin;
        this.shadowElement.style.width = element.clientWidth + 'px';
        this.shadowElement.style.height = element.clientHeight + 'px';

        element.before(this.shadowElement);
    }

    private hideShadow() {
        this.shadowElement.style.display = 'none';
    }

    private isInsertBefore() {
        return this.draggingDirection === 'vertical' ? this.mouseDirection.vertical === 'up' : this.mouseDirection.horizontal === 'left'
    }
}
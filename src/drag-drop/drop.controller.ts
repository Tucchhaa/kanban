import { BaseComponent, BaseComponentType } from "../base/component";
import { BaseController } from "../base/controller";
import { isMouseInsideElement } from "../helpers";
import { MouseDirection } from "../utils/mouse-direction";
import { DragController } from "./drag.controller";
import { DropState } from "./drop.state";

export class DropController<TItem extends object> extends BaseController {
    private dropState: DropState<TItem>;
    
    private draggingDirection: 'horizontal' | 'vertical';
    private mouseDirection: MouseDirection = new MouseDirection();

    private drags: DragController<TItem>[] = [];
    private items: TItem[] = [];

    private shadowElement: HTMLElement = document.createElement('div');
    private shadowIndex: number = -1;

    private isItemsEqual: (itemA: TItem, itemB: TItem) => boolean;

    constructor() {
        super();

        this.dropState = this.getRequiredState<DropState<TItem>>(DropState.name);
        this.draggingDirection = this.dropState.direction;
        this.isItemsEqual = this.dropState.isEqual();
        
        this.eventEmitter
            .on('process-drag', this.onProcessDrag.bind(this))
    }

    public onProcessDrag(dragComponent: BaseComponentType | DragController<TItem>) {
        const dragController = 
            dragComponent instanceof BaseComponent ?
            dragComponent.getRequiredController<DragController<TItem>>(DragController.name) : dragComponent;
        
        this.drags.push(dragController);
        this.items.push(dragController.item);

        // ===

        const onDragStart = (e: MouseEvent) => this.startDrag(e, dragController);
        const onDrag = (e: MouseEvent) => this.drag(e, dragController);
        const onDragEnd = (e: MouseEvent) =>this.endDrag(e, dragController);

        dragController.eventEmitter
            .on('drag-start', onDragStart)
            .on('drag', onDrag)
            .on('drag-end', onDragEnd);

        // ===

        dragController.eventEmitter.once('unsubscribe-drag-listeners', () => {
            dragController.eventEmitter            
                .unsubscribe('drag-start', onDragStart)
                .unsubscribe('drag', onDrag)
                .unsubscribe('drag-end', onDragEnd)
        });
    }


    // === DRAG EVENTS
    public startDrag(e: MouseEvent, dragController: DragController<TItem>) {
        this.eventEmitter.emit('shared-drag-start', e, this, dragController);
        this.showShadow(dragController.element)

        this.shadowIndex = this.getItemIndex(dragController.item);
        this.mouseDirection.setMousePosition(e);

        this.drag(e, dragController);
    }

    private drag(e: MouseEvent, dragController: DragController<TItem>) {
        this.eventEmitter.emit('shared-drag', e, this, dragController);
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

    private endDrag(e: MouseEvent, dragController: DragController<TItem>) {
        this.eventEmitter.emit('shared-drag-end', e, this, dragController);
        this.hideShadow();
        this.updateItemsOrder(dragController);
    }

    private updateItemsOrder(dragController: DragController<TItem>) {
        const currentItem = dragController.item;
        const newOrder: TItem[] = [];
        const insertBeforeIndex = this.shadowIndex;

        for(let index=0; index < this.items.length; index++) {
            const item = this.items[index];

            if(index === insertBeforeIndex)
                newOrder.push(currentItem);

            if(this.isItemsEqual(item, currentItem)) {
                continue;
            }
            
            newOrder.push(item);
        }

        if(insertBeforeIndex === this.items.length)
            newOrder.push(currentItem);

        this.eventEmitter.emit('update-items-order', newOrder);
    }

    public clear() {
        this.shadowIndex = -1;
        this.items = [];
        this.drags = [];
    }

    // === SHARED DROP
    public onDragToSharedDrop(dragController: DragController<TItem>) {
        this.hideShadow();
        dragController.eventEmitter.emit('unsubscribe-drag-listeners');
    }

    public onDragEndToSharedDrop(dragController: DragController<TItem>) {
        this.items = this.items.filter(item => !this.isItemsEqual(item, dragController.item));

        this.eventEmitter.emit('update-items-order', this.items);
    }

    // === PRIVATE METHODS
    private getItemIndex(item: TItem): number {
        for(let index=0; index < this.items.length; index++) {
            const itemB = this.items[index];

            if(this.isItemsEqual(item, itemB)) {
                return index;
            }
        }

        return -1;
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
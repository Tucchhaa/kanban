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
    private dragsContainer?: HTMLElement;

    private shadowElement: HTMLElement = document.createElement('div');
    private shadowIndex: number = -1;

    private isAbleToDrop: (e: MouseEvent, dropElement: HTMLElement) => boolean;
    private isItemsEqual: (itemA: TItem, itemB: TItem) => boolean;

    // columnName: string = (this.container.querySelector('.title') as HTMLElement).innerText;

    constructor(isAbleToDrop?: (e: MouseEvent, dropElement: HTMLElement) => boolean) {
        super();

        this.dropState = this.getRequiredState<DropState<TItem>>(DropState.name);
        this.draggingDirection = this.dropState.direction;

        this.isAbleToDrop = isAbleToDrop ?? isMouseInsideElement;
        this.isItemsEqual = this.dropState.isEqual();
        
        this.eventEmitter
            .on('process-drag', this.onProcessDrag.bind(this))
            .on('drags-container-rendered', (dragsContainer: HTMLElement) => this.dragsContainer = dragsContainer);
    }

    public onProcessDrag(dragComponent: BaseComponentType | DragController<TItem>) {
        const dragController = 
            dragComponent instanceof BaseComponent ?
            dragComponent.getRequiredController<DragController<TItem>>(DragController.name) : dragComponent;
        
        this.drags.push(dragController);
        this.items.push(dragController.item);

        // ===

        const onDragStart = (e: MouseEvent) => {
            this.eventEmitter.emit('shared-drag-start', e, this, dragController);
            this.startDrag(e, dragController);
        };

        const onDrag = (e: MouseEvent) => {
            this.eventEmitter.emit('shared-drag', e, this, dragController);
            this.drag(e, dragController);
        };
        const onDragEnd = (e: MouseEvent) => {
            this.eventEmitter.emit('shared-drag-end', e, this, dragController);
            this.endDrag(e, dragController);
        }

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
        this.showShadow(dragController.element);

        this.shadowIndex = this.getItemIndex(dragController.item);
        this.mouseDirection.setMousePosition(e);

        this.drag(e, dragController);
    }

    private drag(e: MouseEvent, dragController: DragController<TItem>) {
        this.mouseDirection.calculateMouseDirection(e);

        const direction = this.dropState.direction;
        const isInsertBefore = this.isInsertBefore();
        const dropPosition = this.dragsContainer!.getBoundingClientRect();
        const currentDragElement = dragController.element;

        // Shadow above or left
        if(
            (direction === 'vertical' && e.clientY <= dropPosition.y) || (direction === 'horizontal' && e.clientX <= dropPosition.x)
        ) {
            this.shadowIndex = 0;

            this.dragsContainer?.children.length ?
                this.dragsContainer!.firstChild?.before(this.shadowElement) :
                this.dragsContainer!.appendChild(this.shadowElement);
        }
        // Shadow below
        else if(
            (direction === 'vertical' && e.clientY >= dropPosition.y + dropPosition.height) || 
            (direction === 'horizontal' && e.clientX >= dropPosition.x + dropPosition.width)
        ) {
            this.shadowIndex = this.drags.length;

            this.dragsContainer?.children.length ?
                this.dragsContainer!.lastChild?.after(this.shadowElement) :
                this.dragsContainer!.appendChild(this.shadowElement);
        }
        // Shadow inside
        else  {
            for(let index=0; index < this.drags.length; index++) {
                const drag = this.drags[index];
                const dragElement = drag.container; 
            
                if(dragElement !== currentDragElement) {
                    if(this.isAbleToDrop(e, dragElement)) {
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
        }
    }

    private endDrag(e: MouseEvent, dragController: DragController<TItem>) {
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
    public onSharedDropDragStart(e: MouseEvent, dragController: DragController<TItem>) {
        this.onProcessDrag(dragController);
        
        this.startDrag(e, dragController);
    }

    public onDragStartToSharedDrop(dragController: DragController<TItem>) {
        this.removeDrag(dragController);
        this.hideShadow();

        dragController.eventEmitter.emit('unsubscribe-drag-listeners');
    }

    public onDragEndToSharedDrop(dragController: DragController<TItem>) {
        this.removeDrag(dragController);

        this.eventEmitter.emit('update-items-order', this.items);
    }

    private removeDrag(dragController: DragController<TItem>) {
        this.drags = this.drags.filter(drag => drag !== dragController);
        this.items = this.items.filter(item => !this.isItemsEqual(item, dragController.item));
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
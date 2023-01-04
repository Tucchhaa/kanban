import { BaseComponent, BaseComponentType } from "../base/component";
import { BaseController } from "../base/controller";
import { mouse } from "../utils/mouse-direction";
import { DragController } from "./drag.controller";
import { DropState } from "./drop.state";

export class DropController<TItem extends object> extends BaseController {
    private dropState: DropState<TItem>;
    
    private draggingDirection: 'horizontal' | 'vertical';

    public drags: DragController<TItem>[] = [];
    private dropContainer?: HTMLElement;

    private shadowElement: HTMLElement = document.createElement('div');
    private shadowIndex: number = -1;

    private isAbleToDrop: (dropElement: HTMLElement) => boolean;
    public isItemsEqual: (itemA: TItem, itemB: TItem) => boolean;

    public columnName: string = "";

    constructor(isAbleToDrop?: (dropElement: HTMLElement) => boolean) {
        super();

        this.dropState = this.getRequiredState<DropState<TItem>>(DropState.name);
        this.draggingDirection = this.dropState.direction;

        this.isAbleToDrop = isAbleToDrop ?? mouse.isInsideElement.bind(mouse);
        this.isItemsEqual = this.dropState.isEqual();
        
        setTimeout(() => {
            this.columnName = (this.container.querySelector('.title') as HTMLElement).innerText;
        })

        this.eventEmitter
            .on('process-drag', this.onProcessDrag.bind(this))
            .on('drags-container-rendered', (dragsContainer: HTMLElement) => this.dropContainer = dragsContainer);
    }

    // ===

    public onProcessDrag(dragComponent: BaseComponentType | DragController<TItem>) {
        const dragController = 
            dragComponent instanceof BaseComponent ?
            dragComponent.getRequiredController<DragController<TItem>>(DragController.name) : dragComponent;
        
        this.drags.push(dragController);

        // ===

        const onDragStart = (e: MouseEvent) => this.startDrag(e, dragController);
        const onDrag = (e: MouseEvent) => this.drag(e, dragController);
        const onDragEnd = (e: MouseEvent) => this.endDrag(e, dragController);

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
        this.shadowIndex = this.getItemIndex(dragController.item);

        this.showShadow(dragController.element);
        this.drag(e, dragController);
    }

    private drag(e: MouseEvent, dragController: DragController<TItem>) {
        const direction = this.dropState.direction;
        const isInsertBefore = this.isInsertBefore();
        const dropPosition = this.dropContainer!.getBoundingClientRect();
        const currentDragElement = dragController.element;

        // Shadow above or left
        if(
            (direction === 'vertical' && e.clientY <= dropPosition.y) || 
            (direction === 'horizontal' && e.clientX <= dropPosition.x)
        ) {
            this.shadowIndex = 0;

            this.dropContainer?.children.length ?
                this.dropContainer!.firstChild?.before(this.shadowElement) :
                this.dropContainer!.appendChild(this.shadowElement);
        }
        // Shadow below or right
        else if(
            (direction === 'vertical' && e.clientY >= dropPosition.y + dropPosition.height) || 
            (direction === 'horizontal' && e.clientX >= dropPosition.x + dropPosition.width)
        ) {
            this.shadowIndex = this.drags.length;

            this.dropContainer?.children.length ?
                this.dropContainer!.lastChild?.after(this.shadowElement) :
                this.dropContainer!.appendChild(this.shadowElement);
        }
        // Shadow inside
        else  {
            for(let index=0; index < this.drags.length; index++) {
                const drag = this.drags[index];
                const dragElement = drag.container; 
            
                if(dragElement !== currentDragElement) {
                    if(this.isAbleToDrop(dragElement)) {
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
        this.shadowElement.before(dragController.element);
        this.hideShadow();
        this.updateItemsOrder(dragController);
    }

    private updateItemsOrder(dragController: DragController<TItem>) {
        const currentItem = dragController.item;
        const newOrder: TItem[] = [];
        const insertBeforeIndex = this.shadowIndex;

        for(let index=0; index < this.drags.length; index++) {
            const item = this.drags[index].item;

            if(index === insertBeforeIndex)
                newOrder.push(currentItem);

            if(this.isItemsEqual(item, currentItem)) {
                continue;
            }
            
            newOrder.push(item);
        }

        if(insertBeforeIndex === this.drags.length)
            newOrder.push(currentItem);

        this.eventEmitter.emit('update-items-order', newOrder);
    }

    public clear() {
        this.shadowIndex = -1;
        this.drags = [];
    }

    // === SHARED DROP
    public removeDrag(dragController: DragController<TItem>) {
        this.drags = this.drags.filter(drag => drag !== dragController);
    }

    // === PRIVATE METHODS
    private getItemIndex(item: TItem): number {
        for(let index=0; index < this.drags.length; index++) {
            const itemB = this.drags[index].item;

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

    public hideShadow() {
        this.shadowElement.style.display = 'none';
    }

    private isInsertBefore() {
        return this.draggingDirection === 'vertical' ? mouse.vertical === 'up' : mouse.horizontal === 'left'
    }
}

/*

    private scrollDropContainer() {
        const direction = this.dropState.direction;
        const mousePosition = mouse.getPosition();
        const dropPosition = this.dropContainer!.getBoundingClientRect();

        if(direction === 'vertical') {
            if(mousePosition.y >= dropPosition.top && mousePosition.y <= dropPosition.top + 50) {
                mouse.vertical = 'up';
                this.dropContainer?.scrollBy({top: -40, behavior: 'smooth' });
            }
            else if(mousePosition.y <= dropPosition.bottom && mousePosition.y >= dropPosition.bottom - 50) {
                mouse.vertical = 'down';
                this.dropContainer?.scrollBy({top: +40, behavior: 'smooth' });
            }
        }
        else {

        }
    }
*/
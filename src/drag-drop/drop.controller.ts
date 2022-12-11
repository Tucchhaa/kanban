import { BaseComponentType } from "../base/component";
import { BaseController } from "../base/controller";
import { BaseViewType } from "../base/view";
import { MouseDirection } from "../utils/mouse-direction";
import { DragController } from "./drag.controller";
import { DropState } from "./drop.state";

export class DropController extends BaseController {
    private state: DropState;
    private view: BaseViewType;
    private element: HTMLElement;
    
    private drags: BaseComponentType[] = [];
    private shadowElement: HTMLElement = document.createElement('div');
    private mouseDirection: MouseDirection = new MouseDirection();
    private shadowIndex: number = -1;
    private startIndex: number = -1;

    constructor(state: DropState, view: BaseViewType, element: HTMLElement) {
        super();

        this.state = state;
        this.view = view;
        this.element = element;
        
        this.eventEmitter.on('draggable-rendered', (drag: BaseComponentType) => this.processDraggable(drag))
        this.eventEmitter.on('items-updated', (items: any) => this.onUpdateItems(items));
    }

    public processDraggable(drag: BaseComponentType) {
        this.drags.push(drag);
        
        const dragController = drag.getRequiredController<DragController>(DragController.name);
        
        drag.eventEmitter.on('drag-start', (e: MouseEvent) => this.dragStart(e, dragController));
        drag.eventEmitter.on('drag', (e: MouseEvent) => this.drag(e, dragController));
        drag.eventEmitter.on('drag-end', (e: MouseEvent) => this.dragEnd(e, dragController))
    }

    private dragStart(e: MouseEvent, dragController: DragController) {
        this.shadowElement.style.display = 'block';
        this.shadowElement.style.backgroundColor = 'lightgrey';
        this.shadowElement.style.margin = getComputedStyle(dragController.dragElement).margin;
        this.shadowElement.style.width = dragController.dragElement.clientWidth + 'px';
        this.shadowElement.style.height = dragController.dragElement.clientHeight + 'px';

        dragController.dragElement.before(this.shadowElement);

        // ===

        this.startIndex = this.state.getIndex(dragController.item);
        this.shadowIndex = this.startIndex;

        this.mouseDirection.setMousePosition(e);
    }

    private drag(e: MouseEvent, dragController: DragController) {
        const currentDragElement = dragController.dragElement;

        this.mouseDirection.calculateMouseDirection(e);

        for(let index=0; index < this.drags.length; index++) {
            const drag = this.drags[index];
            const dragElement = drag.container; 

            const position = dragElement.getBoundingClientRect();
        
            if(
                dragElement !== currentDragElement &&
                e.clientX >= position.x && e.clientX <= position.x + position.width &&
                e.clientY >= position.y && e.clientY <= position.y + position.height
            ) {
                const isInsertBefore = this.mouseDirection.vertical === 'up';
                
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

    private dragEnd(e: MouseEvent, dragController: DragController) {
        this.shadowElement.style.display = 'none';

        // ===

        this.updateItemsOrder(dragController);
    }

    private updateItemsOrder(dragController: DragController) {
        const items = this.state.items;
        const currentItem = dragController.item;
        const newOrder: any[] = [];

        for(let index=0; index < items.length; index++) {
            const item = items[index];

            if(index === this.shadowIndex)
                newOrder.push(currentItem);

            if(item === currentItem) {
                continue;
            }
            
            newOrder.push(item);
        }

        if(this.shadowIndex === items.length)
            newOrder.push(currentItem);

        this.eventEmitter.emit('update-items-order', newOrder);
    }

    private onUpdateItems(items: any) {
        this.drags = [];
        this.state.updateItems(items);
    }
}
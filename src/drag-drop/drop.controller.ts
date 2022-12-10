import { BaseComponentType } from "../base/component";
import { EventEmitter } from "../base/event-emitter";
import { MouseDirection } from "../utils/mouse-direction";
import { DragController } from "./drag.controller";
import { DropState } from "./drop.state";

export class DroppableController {
    private state: DropState;
    private view: EventEmitter;
    private element: HTMLElement;
    
    private drags: BaseComponentType[] = [];
    private shadowElement: HTMLElement = document.createElement('div');
    private mouseDirection: MouseDirection = new MouseDirection();

    constructor(state: DropState, view: EventEmitter, element: HTMLElement) {
        this.state = state;
        this.view = view;
        this.element = element;
        
        view.on('draggable-rendered', (drag: BaseComponentType) => this.processDraggable(drag))
    }

    public processDraggable(drag: BaseComponentType) {
        this.drags.push(drag);
        
        const dragController = drag.getRequiredController<DragController>(DragController.name);
        
        drag.view.on('drag-start', (e: MouseEvent) => this.dragStart(e, dragController));
        drag.view.on('drag', (e: MouseEvent) => this.drag(e, dragController));
        drag.view.on('drag-end', (e: MouseEvent) => this.dragEnd(e, dragController))
    }

    private dragStart(e: MouseEvent, dragController: DragController) {
        this.shadowElement.style.display = 'block';
        this.shadowElement.style.backgroundColor = 'lightgrey';
        this.shadowElement.style.margin = getComputedStyle(dragController.dragElement).margin;
        this.shadowElement.style.width = dragController.dragElement.clientWidth + 'px';
        this.shadowElement.style.height = dragController.dragElement.clientHeight + 'px';

        dragController.dragElement.before(this.shadowElement);

        // ===

        this.mouseDirection.setMousePosition(e);
    }

    private drag(e: MouseEvent, dragController: DragController) {
        const currentDragElement = dragController.dragElement;

        this.mouseDirection.calculateMouseDirection(e);

        for(const drag of this.drags) {
            const dragElement = drag.container; 

            const position = dragElement.getBoundingClientRect();
        
            if(
                dragElement !== currentDragElement &&
                e.clientX >= position.x && e.clientX <= position.x + position.width &&
                e.clientY >= position.y && e.clientY <= position.y + position.height
            ) {
                const isInsertBefore = this.mouseDirection.vertical === 'up';
                
                isInsertBefore ? dragElement.before(this.shadowElement) : dragElement.after(this.shadowElement); 

                break;
            }
        }
    }

    private dragEnd(e: MouseEvent, dragController: DragController) {
        this.shadowElement.style.display = 'none';

        // ===
        
    }

    protected updateOrder() {

    }
}
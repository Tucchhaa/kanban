import { BaseComponent, BaseComponentType } from "../base/component";
import { BaseController } from "../base/controller";
import { hasHorizontalScroll, hasVerticalScroll } from "../helpers";
import { UndefinedViewPropertyError } from "../utils/errors";
import { mouse } from "../utils/mouse";
import { smoothScroll, SmoothScrollOptions } from "../utils/smooth-scroll";
import { DragController } from "./drag.controller";
import { DropState } from "./drop.state";

export class DropController<TItem extends object> extends BaseController {
    private dropState: DropState<TItem>;

    private _dropScrollContainer?: HTMLElement;
    private _dropContainer?: HTMLElement;
    
    private dropInterval?: any;

    public drags: DragController<TItem>[] = [];
    private draggingDirection: 'horizontal' | 'vertical';

    private isMouseInsideDrag: (drag: DragController<TItem>) => boolean;
    private isItemsEqual: (itemA: TItem, itemB: TItem) => boolean;

    private scrollDirection?: 'start' | 'end';

    public columnName: string = "";

    // ===
    public get dropContainer() {
        return this._dropContainer!;
    }

    public get dropScrollContainer() {
        return this._dropScrollContainer!;
    }
    // ===

    constructor(isMouseInsideDrag?: (drag: DragController<TItem>) => boolean) {
        super();

        this.dropState = this.getRequiredState<DropState<TItem>>(DropState.name);
        this.draggingDirection = this.dropState.direction;

        const isMouseInsideElement = mouse.isInsideElement.bind(mouse);

        this.isMouseInsideDrag = isMouseInsideDrag ?? ((drag: DragController<TItem>) => isMouseInsideElement(drag.element));
        this.isItemsEqual = this.dropState.isItemsEqual;
        
        setTimeout(() => {
            this.columnName = (this.container.querySelector('.title') as HTMLElement).innerText;
        });

        this.eventEmitter
            .on('process-drag', this.onProcessDrag.bind(this))
            .on('rendered', () => {
                const { dropContainer, dropScrollContainer } = this.view as any;

                if(!dropContainer)
                    throw new UndefinedViewPropertyError(DropController.name, this.componentName, 'dropContainer');

                this._dropContainer = dropContainer;
                this._dropScrollContainer = dropScrollContainer ?? dropContainer;

                this.dropContainer.classList.add('droppable');
            });
    }

    // ===

    public clear() {
        this.clearDropInterval();
        this.drags = [];
    }

    public clearDropInterval() {
        clearInterval(this.dropInterval);
    }

    // ===

    public onProcessDrag(dragComponent: BaseComponentType | DragController<TItem>) {
        const dragController = 
            dragComponent instanceof BaseComponent ?
            dragComponent.getRequiredController<DragController<TItem>>(DragController.name) : dragComponent;
        
        this.drags.push(dragController);

        // ===

        const onDragStart = () => this.startDrag(dragController);
        const onDrag      = () => this.drag(dragController);
        const onDragEnd   = () => this.endDrag();

        dragController.eventEmitter
            .on('drag-start', onDragStart)
            // .on('drag', onDrag)
            .on('drag-end', onDragEnd);

        // ===

        dragController.eventEmitter.once('unsubscribe-drag-listeners', () => {
            dragController.eventEmitter            
                .unsubscribe('drag-start', onDragStart)
                // .unsubscribe('drag', onDrag)
                .unsubscribe('drag-end', onDragEnd)
        });
    }

    // === DRAG EVENTS
    public startDrag(drag: DragController<TItem>) {
        this.drag(drag);
        console.log('dragstart', this.columnName)

        this.dropInterval = setInterval(() => {
            this.scrollDropContainer();
            this.drag(drag);
        }, 100);
    }

    private drag(drag: DragController<TItem>) {
        const scrollTop = this.dropContainer.scrollTop;

        const dragPosition = this.calculateDragPosition(drag);
        const positionChanged = this.changeDragPosition(drag, dragPosition);

        if(positionChanged) {
            this.dropContainer.scrollTop = scrollTop;
            this.moveDragToIndex(drag, dragPosition.index);
        }
    }

    public endDrag() {
        this.clearDropInterval();
        this.eventEmitter.emit('update-items-order', this.drags.map(drag => drag.item));
    }

    // === SCROLLING

    private getScrollBoundaries() {
        const scrollPosition = this.dropScrollContainer.getBoundingClientRect();
        const direction = this.dropState.direction;

        if(direction === 'vertical') {
            return {
                boundary: {
                    start: scrollPosition.top,
                    end: scrollPosition.bottom,
                },
                currentPosition: mouse.position.y
            }
        }

        return {
            boundary: {
                start: scrollPosition.left,
                end: scrollPosition.right,
            },
            currentPosition: mouse.position.x
        }
    }

    private scrollDropContainer() {
        let scrollOptions: SmoothScrollOptions | undefined;
        const { scrollBoundaryRange, scrollSpeed } = this.dropState;
        const { boundary, currentPosition } = this.getScrollBoundaries();

        if(hasVerticalScroll(this.dropScrollContainer) || hasHorizontalScroll(this.dropScrollContainer)) {
            if(currentPosition < boundary.start + scrollBoundaryRange) {
                // scroll to very start
                if(currentPosition < boundary.start) {
                    scrollOptions = { time: 500, speedY: -15 };
                }
                // scroll to start
                else {
                    const scrollDistance = (1 - (currentPosition - boundary.start) / scrollBoundaryRange) * scrollSpeed;
                    scrollOptions = { time: 80, y: -scrollDistance };
                }

            }
            else if(currentPosition > boundary.end - scrollBoundaryRange) {
                // scroll to very end
                if(currentPosition > boundary.end) {
                    scrollOptions = { time: 500, speedY: 15 };
                }
                // scroll to end
                else {
                    const scrollDistance = (1 - (boundary.end - currentPosition) / scrollBoundaryRange) * scrollSpeed;
                    scrollOptions = { time: 80, y: scrollDistance };
                }
            }
        }

        if(scrollOptions) {
            this.scrollDirection = scrollOptions.y! > 0 || scrollOptions.speedY! > 0 ? 'end' : 'start';

            if(this.dropState.direction === 'horizontal') {
                scrollOptions.speedX = scrollOptions.speedY;
                scrollOptions.x = scrollOptions.y;

                delete scrollOptions.speedY;
                delete scrollOptions.y;
            }

            smoothScroll(this.dropScrollContainer, scrollOptions);
            // smoothScroll(this.dropContainer, scrollOptions, () => { this.scrollDirection = undefined; });
        }
        else {
            this.scrollDirection = undefined;
        }
    }

    // == PRIVATE

    private calculateDragPosition(drag: DragController<TItem>): ({ index: number, isInsertBefore: boolean }) {
        const direction = this.dropState.direction;
        const mousePosition = mouse.position;
        const dropPosition = this.dropContainer.getBoundingClientRect();
        
        let isInsertBefore = this.isInsertBefore();
        let index = -1;

        // Shadow above or left
        if(
            (direction === 'vertical' && mousePosition.y <= dropPosition.y) || 
            (direction === 'horizontal' && mousePosition.x <= dropPosition.x)
        ) {
            index = 0;
            isInsertBefore = true;
        }
        // Shadow below or right
        else if(
            (direction === 'vertical' && mousePosition.y >= dropPosition.y + dropPosition.height) || 
            (direction === 'horizontal' && mousePosition.x >= dropPosition.x + dropPosition.width)
        ) {
            index = this.drags.length - 1;
            isInsertBefore = false;
        }
        // Shadow inside
        else  {
            for(let i = 0; i < this.drags.length; i++) {
                if(!this.isSameDrag(this.drags[i], drag) && this.isMouseInsideDrag(this.drags[i])) {
                    index = i;
                    break;
                }
            }
        }

        return { index, isInsertBefore };
    }

    private changeDragPosition(drag: DragController<TItem>, dragPosition: { index: number, isInsertBefore: boolean }): boolean {
        const { index, isInsertBefore } = dragPosition;
        
        if(index === -1)
            return false;

        const insertNearDrag = this.drags[index];

        if(insertNearDrag && !this.isSameDrag(insertNearDrag, drag)) {
            if(isInsertBefore) {
                if(index === 0 || !this.isSameDrag(this.drags[index - 1], drag)) {
                    insertNearDrag.container.before(drag.container)
                    return true;
                }
            }
            else {
                if(index + 1 === this.drags.length || !this.isSameDrag(this.drags[index + 1], drag)) {
                    insertNearDrag.container.after(drag.container);
                    return true;
                }
            }

        }
        else if(this.dropContainer.children.length !== this.drags.length) {
            this.dropContainer.appendChild(drag.container);
            return true;
        }

        return false;
    }

    private isSameDrag(dragA: DragController<TItem>, dragB: DragController<TItem>) {
        return this.isItemsEqual(dragA.item, dragB.item);
    }

    private moveDragToIndex(drag: DragController<TItem>, toIndex: number) {
        const fromIndex = this.drags.indexOf(drag);

        // remove from old index
        this.drags.splice(fromIndex, 1);

        // add to new index
        this.drags.splice(toIndex, 0, drag);
    }

    private isInsertBefore() {
        if(this.scrollDirection)
            return this.scrollDirection === 'start';

        return this.draggingDirection === 'vertical' ? mouse.vertical === 'up' : mouse.horizontal === 'left';
    }
}
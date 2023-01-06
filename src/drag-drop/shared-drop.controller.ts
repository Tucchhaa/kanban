import { BaseComponent, BaseComponentType } from "../base/component";
import { BaseController } from "../base/controller";
import { DragController } from "./drag.controller";
import { DropController } from "./drop.controller";
import { DropState } from "./drop.state";

export class SharedDropController<TItem extends object> extends BaseController {
    private dropState: DropState<TItem>;
    private dropController: DropController<TItem>;

    private isItemsEqual: (itemA: TItem, itemB: TItem) => boolean;

    constructor() {
        super();

        this.dropState = this.getRequiredState<DropState<TItem>>(DropState.name);
        this.dropController = this.getRequiredController<DropController<TItem>>(DropController.name);

        this.isItemsEqual = this.dropState.isItemsEqual;

        this.eventEmitter.on('process-drag', this.onProcessDrag.bind(this));
    }

    public get dropContainer() {
        return this.dropController.dropContainer;
    }

    public get columnName() {
        return this.dropController.columnName;
    }

    public onProcessDrag(dragComponent: BaseComponentType | DragController<TItem>) {
        const dragController = 
            dragComponent instanceof BaseComponent ?
            dragComponent.getRequiredController<DragController<TItem>>(DragController.name) : dragComponent;

        const onDragStart = () => this.eventEmitter.emit('shared-drag-start', this, dragController);
        const onDrag      = () => this.eventEmitter.emit('shared-drag', this, dragController);
        const onDragEnd   = () => this.eventEmitter.emit('shared-drag-end', this, dragController);

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

    public onSharedDragStart(dragController: DragController<TItem>) {
        this.onProcessDrag(dragController);
        this.dropController.onProcessDrag(dragController);

        this.dropController.startDrag(dragController);
    }

    public onDragStartInShared(dragController: DragController<TItem>) {
        this.removeDrag(dragController);

        this.dropController.clearDropInterval();

        dragController.eventEmitter.emit('unsubscribe-drag-listeners');
    }

    public onDragEndInShared(dragController: DragController<TItem>) {
        this.removeDrag(dragController);

        this.dropController.endDrag();
        
        // this.eventEmitter.emit('update-items-order', this.dropController.drags.map(drag => drag.item));
    }

    private removeDrag(dragController: DragController<TItem>) {
        this.dropController.drags = this.dropController.drags.filter(drag => !this.isItemsEqual(drag.item, dragController.item))
    }
}
import { BaseComponent, BaseComponentType } from "../base/component";
import { BaseController } from "../base/controller";
import { DragController } from "./drag.controller";
import { DropController } from "./drop.controller";

export class SharedDropController<TItem extends object> extends BaseController {
    private dropController: DropController<TItem>;

    constructor() {
        super();

        this.dropController = this.getRequiredController<DropController<TItem>>(DropController.name);
    
        this.eventEmitter.on('process-shared-drag', this.onProcessSharedDrag.bind(this));
    }

    public get columnName() {
        return this.dropController.columnName;
    }

    public onProcessSharedDrag(dragComponent: BaseComponentType | DragController<TItem>) {
        const dragController = 
            dragComponent instanceof BaseComponent ?
            dragComponent.getRequiredController<DragController<TItem>>(DragController.name) : dragComponent;

        const onDragStart = (e: MouseEvent) => this.eventEmitter.emit('shared-drag-start', e, this, dragController);
        const onDrag      = (e: MouseEvent) => this.eventEmitter.emit('shared-drag', e, this, dragController);
        const onDragEnd   = (e: MouseEvent) => this.eventEmitter.emit('shared-drag-end', e, this, dragController);

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

    public onSharedDragStart(e: MouseEvent, dragController: DragController<TItem>) {
        this.onProcessSharedDrag(dragController);
        this.dropController.onProcessDrag(dragController);

        this.dropController.startDrag(e, dragController);
    }

    public onDragStartToShared(dragController: DragController<TItem>) {
        dragController.eventEmitter.emit('unsubscribe-drag-listeners');

        this.dropController.removeDrag(dragController);
        this.dropController.hideShadow();
    }

    public onDragEndToShared(dragController: DragController<TItem>) {
        this.dropController.removeDrag(dragController);

        this.eventEmitter.emit('update-items-order', this.dropController.drags.map(drag => drag.item));
    }
}
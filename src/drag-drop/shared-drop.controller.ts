import { BaseComponentType } from "../base/component";
import { BaseController } from "../base/controller";
import { DropController } from "./drop.controller";
import { DragController } from "./drag.controller";
import { isMouseInsideElement } from "../helpers";

export class SharedDropController<TItem extends object> extends BaseController {
    private drops: DropController<TItem>[];

    private isDragging: boolean;
    private originDrop?: DropController<TItem>;
    private currentDrop?: DropController<TItem>;

    constructor() {
        super();

        this.drops = [];

        this.isDragging = false;

        this.eventEmitter.on('process-shared-drop', (dropComponent: BaseComponentType) => this.processDrop(dropComponent));
    }

    private processDrop(dropComponent: BaseComponentType) {
        const dropController = dropComponent.getRequiredController<DropController<TItem>>(DropController.name);

        dropController.eventEmitter
            .on('shared-drag-start', this.onDragStart.bind(this))
            .on('shared-drag', this.onDrag.bind(this))
            .on('shared-drag-end', this.onDragEnd.bind(this));

        this.drops.push(dropController);
    }

    private onDragStart(e: MouseEvent, fromDrop: DropController<TItem>, dragController: DragController<TItem>) {
        if(!this.isDragging) {
            this.isDragging = true;
            this.originDrop = fromDrop;
            this.currentDrop = fromDrop;
        }
    }

    private onDrag(e: MouseEvent, fromDrop: DropController<TItem>, dragController: DragController<TItem>) {
        for(const toDrop of this.drops) {

            if(toDrop !== fromDrop && isMouseInsideElement(e, toDrop.container)) {

                if(toDrop !== this.currentDrop) {
                    this.currentDrop?.onDragToSharedDrop(dragController);

                    toDrop.onProcessDrag(dragController);
                    toDrop.startDrag(e, dragController);
                    
                    this.currentDrop = toDrop;
                }

                continue;
            }
        }
    }

    private onDragEnd(e: MouseEvent, toDrop: DropController<TItem>, dragController: DragController<TItem>) {
        this.isDragging = false;

        if(toDrop !== this.originDrop) {
            this.originDrop?.onDragEndToSharedDrop(dragController);
        }
    }
}
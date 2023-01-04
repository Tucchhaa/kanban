import { BaseComponentType } from "../base/component";
import { BaseController } from "../base/controller";
import { DragController } from "./drag.controller";
import { SharedDropController } from "./shared-drop.controller";
import { mouse } from "../utils/mouse-direction";

export class SharedDropManagerController<TItem extends object> extends BaseController {
    private drops: SharedDropController<TItem>[];

    private isDragging: boolean;
    private originDrop?: SharedDropController<TItem>;
    private currentDrop?: SharedDropController<TItem>;

    private isAbleToDrop: (dropElement: HTMLElement) => boolean;

    constructor(isAbleToDrop?: (dropElement: HTMLElement) => boolean) {
        super();

        this.drops = [];

        this.isDragging = false;

        this.isAbleToDrop = isAbleToDrop ?? mouse.isInsideElement;

        this.eventEmitter.on('process-shared-drop', (dropComponent: BaseComponentType) => this.processDrop(dropComponent));
    }

    private processDrop(dropComponent: BaseComponentType) {
        const dropController = dropComponent.getRequiredController<SharedDropController<TItem>>(SharedDropController.name);

        dropController.eventEmitter
            .on('shared-drag-start', this.onDragStart.bind(this))
            .on('shared-drag', this.onDrag.bind(this))
            .on('shared-drag-end', this.onDragEnd.bind(this));

        this.drops.push(dropController);
    }

    private onDragStart(e: MouseEvent, fromDrop: SharedDropController<TItem>, dragController: DragController<TItem>) {
        if(!this.isDragging) {
            this.isDragging = true;
            this.originDrop = fromDrop;
            this.currentDrop = fromDrop;
        }
    }

    private onDrag(e: MouseEvent, fromDrop: SharedDropController<TItem>, dragController: DragController<TItem>) {
        for(const toDrop of this.drops) {
            if(toDrop !== this.currentDrop  && this.isAbleToDrop(toDrop.container)) {
                this.currentDrop?.onDragStartInShared(dragController);

                toDrop.onSharedDragStart(e, dragController);
                
                this.currentDrop = toDrop;
                
                break;
            }
        }
    }

    private onDragEnd(e: MouseEvent, toDrop: SharedDropController<TItem>, dragController: DragController<TItem>) {
        this.isDragging = false;

        if(toDrop !== this.originDrop) {
            this.originDrop?.onDragEndInShared(dragController);
        }
    }
}
import { BaseComponentType } from "../base/component";
import { BaseController } from "../base/controller";
import { DragController } from "./drag.controller";
import { SharedDropController } from "./shared-drop.controller";
import { mouse } from "../utils/mouse";
import { DropController } from "./drop.controller";

export class SharedDropManagerController<TItem extends object> extends BaseController {
    private drops: SharedDropController<TItem>[];

    private isDragging: boolean;
    private originDrop?: SharedDropController<TItem>;
    private currentDrop?: SharedDropController<TItem>;

    private scrollInterval?: any;

    private isAbleToDrop: (dropElement: HTMLElement) => boolean;

    constructor(isAbleToDrop?: (dropElement: HTMLElement) => boolean) {
        super();

        this.drops = [];

        this.isDragging = false;

        this.isAbleToDrop = isAbleToDrop ?? mouse.isInsideElement;

        this.eventEmitter.on('process-shared-drop', (dropComponent: BaseComponentType) => this.processDrop(dropComponent));
    }

    public clear(): void {
        clearInterval(this.scrollInterval);
    }

    private _dropController?: DropController<TItem>;
    private get dropController() {
        if(!this._dropController)
            this._dropController = this.getController<DropController<TItem>>(DropController.name);

        return this._dropController!;
    }

    private processDrop(dropComponent: BaseComponentType) {
        const dropController = dropComponent.getRequiredController<SharedDropController<TItem>>(SharedDropController.name);

        dropController.eventEmitter
            .on('shared-drag-start', this.onDragStart.bind(this))
            // .on('shared-drag', this.onDrag.bind(this))
            .on('shared-drag-end', this.onDragEnd.bind(this));

        this.drops.push(dropController);
    }

    private onDragStart(fromDrop: SharedDropController<TItem>, dragController: DragController<TItem>) {
        if(!this.isDragging) {
            this.isDragging = true;
            this.originDrop = fromDrop;
            this.currentDrop = fromDrop;

            this.scrollInterval = setInterval(() => {
                this.dropController.scrollDropContainer();
                this.onDrag(fromDrop, dragController);
            }, 100);
        }
    }

    private onDrag(fromDrop: SharedDropController<TItem>, dragController: DragController<TItem>) {
        for(const toDrop of this.drops) {
            if(toDrop !== this.currentDrop  && this.isAbleToDrop(toDrop.dropContainer)) {
                this.currentDrop?.onDragStartInShared(dragController);

                toDrop.onSharedDragStart(dragController);
                
                this.currentDrop = toDrop;
                
                break;
            }
        }
    }

    private onDragEnd(toDrop: SharedDropController<TItem>, dragController: DragController<TItem>) {
        this.isDragging = false;
        clearInterval(this.scrollInterval);

        if(toDrop !== this.originDrop) {
            this.originDrop?.onDragEndInShared(dragController);
        }
    }
}
import { BaseComponentType } from "../base/component";
import { BaseController } from "../base/controller";
import { DropController } from "./drop.controller";
import { DragController } from "./drag.controller";
import { DropState } from "./drop.state";
import { isMouseInsideElement } from "../helpers";

export class SharedDropController<TItem extends object> extends BaseController {
    private drops: BaseComponentType[];

    private currentDrop?: BaseComponentType;

    constructor() {
        super();

        this.drops = [];

        this.eventEmitter.on('process-shared-drop', (dropComponent: BaseComponentType) => this.processDrop(dropComponent));
    }

    private processDrop(dropComponent: BaseComponentType) {
        dropComponent.eventEmitter
            .on(
                'shared-drag', 
                (e: MouseEvent, originDrop: BaseComponentType, dragController: DragController<TItem>) => this.onDrag(e, originDrop, dragController)
            )
            .on(
                'shared-drag-end',
                (e: MouseEvent, originDrop: BaseComponentType, dragController: DragController<TItem>) => this.onDragEnd(e, originDrop, dragController)
            );
        
        this.drops.push(dropComponent);
    }

    private onDrag(e: MouseEvent, originDrop: BaseComponentType, dragController: DragController<TItem>) {
        for(const drop of this.drops) {

            if(drop !== originDrop && isMouseInsideElement(e, drop.container)) {
                console.log('drag-start')
                const fromDropController = originDrop.getRequiredController<DropController<TItem>>(DropController.name);
                const fromDropState = originDrop.getRequiredState<DropState<TItem>>(DropState.name);

                const toDropController = drop.getRequiredController<DropController<TItem>>(DropController.name);
                const toDropState = drop.getRequiredState<DropState<TItem>>(DropState.name);

                if(this.currentDrop === drop) {
                    drop.eventEmitter.emit('drag-start', e, dragController);
                    this.currentDrop = drop;
                }

                toDropController.eventEmitter.emit('drag', e, dragController);

                continue;
            }
        }
    }

    private onDragEnd(e: MouseEvent, originDrop: BaseComponentType, dragController: DragController<TItem>) {

    }
}

/*
слушать у каждого дропа драгСтарт, драг и драгэнд

если во время драга, окажется что курсор находится внутри дропа, то
перемещать айтем из одного дропа в другой таким образом:

мы не меняем состояние и не рендерим компоненты, но мы меняем
айтемсы у дропов.


*/
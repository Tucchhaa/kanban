import { EventEmitter } from "../base/event-emitter";
import { BaseStateType } from "../base/state";
import { BaseView } from "../base/view";
import { processClasses } from "../helpers";

export abstract class DroppableView<TState extends BaseStateType> extends BaseView<TState> {
    constructor(model: TState, container: HTMLElement, classes?: string[] | string) {
        const _classes = ['droppable', ...processClasses(classes)];
        super(model, container, _classes);
    }
}
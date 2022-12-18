import { EventEmitter } from "../base/event-emitter";
import { BaseStateType } from "../base/state";
import { BaseView } from "../base/view";
import { processClasses } from "../helpers";

export abstract class DropView<TState extends BaseStateType> extends BaseView<TState> {
    constructor(state: TState, classes?: string[] | string) {
        const _classes = ['droppable', ...processClasses(classes)];
        super(state, _classes);
    }
}
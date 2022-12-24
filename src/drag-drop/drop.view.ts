import { BaseStateType } from "../base/state";
import { BaseView } from "../base/view";
import { concatClasses } from "../helpers";

export abstract class DropView<TState extends BaseStateType> extends BaseView<TState> {
    constructor(state: TState, classes?: string[] | string) {
        const _classes = concatClasses('droppable', classes);
        super(state, _classes);
    }
}
import { BaseStateType } from "../base/state";
import { BaseView } from "../base/view";
import { concatClasses } from "../helpers";

export class DropView<TState extends BaseStateType = BaseStateType> extends BaseView<TState> {
    constructor(classes?: string[] | string) {
        const _classes = concatClasses('droppable', classes);
        super(_classes);
    }

    protected _render(fragment: DocumentFragment): void { }
}
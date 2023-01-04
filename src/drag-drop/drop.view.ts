import { BaseStateType } from "../base/state";
import { BaseView } from "../base/view";
import { concatClasses } from "../helpers";
import { ClassList } from "../types";

export class DropView<TState extends BaseStateType = BaseStateType> extends BaseView<TState> {
    constructor(classes?: ClassList) {
        super(concatClasses(classes, 'droppable'));
    }

    protected _render(fragment: DocumentFragment): void { }
}
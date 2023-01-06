import { ComponentModule } from "./component-module";
import { BaseStateType, StateChange } from "./state";
import { BaseView } from "./view";

export class BaseController<
    TState extends BaseStateType = BaseStateType,
    TView extends BaseView = BaseView
> extends ComponentModule<TState, TView> {
    protected onClear: { (): void }[] = [];

    public clear(): void {
        for(const func of this.onClear)
            func();
    }

    public stateChanged(change: StateChange): void {}

    protected render() {
        this.eventEmitter.emit('render');
    }
}
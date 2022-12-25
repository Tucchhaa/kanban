import { ComponentModule } from "./component-module";
import { BaseStateType } from "./state";
import { BaseView } from "./view";

export class BaseController<
    TState extends BaseStateType = BaseStateType,
    TView extends BaseView = BaseView
> extends ComponentModule<TState, TView> {
    public clear(): void {}
}
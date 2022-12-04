import { BaseState } from "../base/state";
import { BaseView } from "../base/view";

export type BaseComponentType = BaseComponent<object, BaseState<object>, BaseView<BaseState<object>>, object>;

export class BaseComponent<
    TOptions extends object, 
    TState extends BaseState<TOptions>, 
    TView extends BaseView<TState>, 
    TController extends object
> {
    private state: TState;
    private view: TView;
    private controller: TController;

    constructor(
        name: string,
        modelType: new(options: TOptions) => TState, 
        viewType: new(state: TState, container: HTMLElement) => TView, 
        controllerType: new(state: TState, view: TView) => TController,
        container: HTMLElement | null, options: TOptions
    ) {
        if(!container) {
            throw new Error(`${name}Component container is not defined`);
        }

        this.state = new modelType(options);
        this.view = new viewType(this.state, container);
        this.controller = new controllerType(this.state, this.view);
    }

    dispose() {
        this.view.dispose();
    }
}
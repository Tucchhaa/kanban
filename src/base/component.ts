import { BaseState } from "../base/state";
import { BaseView } from "../base/view";
import { IDisposable } from "./idisposable";

export type BaseComponentType = BaseComponent<object, BaseState<object>, BaseView<BaseState<object>>, object>;

export class BaseComponent<
    TOptions extends object, 
    TState extends BaseState<TOptions>, 
    TView extends BaseView<TState>, 
    TController extends object
> implements IDisposable {
    private _name: string;
    private _container: HTMLElement;

    private state: TState;
    private _view: TView;
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

        this._name = name;
        this._container = container;
        
        this.state = new modelType(options);
        this._view = new viewType(this.state, container);
        this.controller = new controllerType(this.state, this._view);
    }

    public getController<T extends object>(name: string): T {
        return this._view.getController(name) as T;
    }

    public getRequiredController<T extends object>(name: string): T {
        return this._view.getRequiredController(name) as T;
    }

    public dispose() {
        this._view.dispose();
    }

    // ===
    public get name() {
        return this._name;
    }
    public get container() {
        return this._container;
    }
    public get view() {
        return this._view;
    }
}
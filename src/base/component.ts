import { BaseState } from "../base/state";
import { BaseView } from "../base/view";
import { Dictionary } from "../types";
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
    
    private _state: TState;
    private _view: TView;
    private controllers: Dictionary<object | undefined> = {};

    constructor(
        name: string,
        modelType: new(options: TOptions) => TState, 
        viewType: new(state: TState, container: HTMLElement) => TView, 
        container: HTMLElement | null, options: TOptions,
        controllerType?: new(state: TState, view: TView) => TController
    ) {
        if(!container) {
            throw new Error(`${name}Component container is not defined`);
        }

        this._name = name;
        this._container = container;
        
        this._state = new modelType(options);
        this._view = new viewType(this._state, container);

        if(controllerType)
            this.registerController(new controllerType(this._state, this._view));
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
    public get state() {
        return this._state;
    }

    // ===

    public registerController(controller: object, name?: string) {
        name = name ?? controller.constructor.name;

        if(this.controllers[name])
            throw new Error(`Controller with ${name} is already registered`);

        this.controllers[name] = controller;
    }

    public getController<T extends object>(name: string) {
        return this.controllers[name] as T;
    }

    public getRequiredController<T extends object>(name: string) {
        return this.controllers[name]! as T;
    }

    // ===

    public dispose() {
        this._view.dispose();
    }
}
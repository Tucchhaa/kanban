import { BaseState } from "../base/state";
import { BaseView } from "../base/view";
import { Dictionary } from "../types";
import { ComponentModule } from "./component-module";
import { BaseController } from "./controller";
import { EventEmitter, IEventEmitter } from "./event-emitter";
import { IDisposable } from "./idisposable"; 

export type BaseComponentType = BaseComponent<object, BaseState<object>, BaseView<BaseState<object>>, BaseController>;

export class BaseComponent<
    TOptions extends object, 
    TState extends BaseState<TOptions>, 
    TView extends BaseView<TState>, 
    TController extends BaseController
> implements IDisposable {
    private _name: string;
    private _container: HTMLElement;
    
    private _state: TState;
    private _view: TView;
    private controllers: Dictionary<object | undefined> = {};

    public eventEmitter: IEventEmitter;

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

        this.eventEmitter = new EventEmitter();
        
        this.beforeCreateComponentModules();

        this._state = new modelType(options);
        this._view = new viewType(this._state, container);

        if(controllerType)
            this.registerControllerCore(new controllerType(this._state, this._view));

        this.afterCreateComponentModules();
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

    private beforeCreateComponentModules() {
        (ComponentModule.prototype as any)._eventEmitter = this.eventEmitter;
    }
    private afterCreateComponentModules() {
        (ComponentModule.prototype as any)._eventEmitter = undefined;
    }

    // ===

    public registerController(createController: () => BaseController, name?: string) {
        this.beforeCreateComponentModules();
        
        const controller = createController();
        this.registerControllerCore(controller, name);

        this.afterCreateComponentModules();
    }

    private registerControllerCore(controller: BaseController, name?: string) {
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
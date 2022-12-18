import { BaseState, BaseStateType } from "../base/state";
import { BaseView } from "../base/view";
import { Dictionary } from "../types";
import { ComponentModule, ComponentProps } from "./component-module";
import { BaseController } from "./controller";
import { EventEmitter, IEventEmitter } from "./event-emitter";
import { IClearable } from "./idisposable"; 

export type BaseComponentType = BaseComponent<object, BaseState<object>, BaseView<BaseState<object>>>;

export class BaseComponent<
    TOptions extends object, 
    TState extends BaseState<TOptions>, 
    TView extends BaseView<TState>
> implements IClearable {
    private _name: string;
    private _container: HTMLElement;
    
    private _state: TState;
    private _view: TView;
    private states: Dictionary<object | undefined> = {};
    private controllers: Dictionary<object | undefined> = {};

    public eventEmitter: IEventEmitter;

    constructor(
        name: string,
        stateType: new(options: TOptions) => TState, 
        viewType: new(state: TState, container: HTMLElement) => TView, 
        container: HTMLElement | null, options: TOptions | TState,
        controllerType?: new(state: TState, view: TView) => BaseController
    ) {
        if(!container) {
            throw new Error(`${name}Component container is not defined`);
        }

        this._name = name;
        this._container = container;

        this.eventEmitter = new EventEmitter();
        
        this.beforeCreateComponentModules();

        this._state = options instanceof BaseState ? options : new stateType(options);
        this.registerState(() => this._state);

        this._view = new viewType(this._state, container);

        if(controllerType)
            this.registerController(() => new controllerType(this._state, this._view));

        this.afterCreateComponentModules();
    }

    protected render() {
        this._view.render();
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
        const componentProps: ComponentProps = { 
            componentName: this._name,
            getContainer: () => this.container,
            eventEmitter: this.eventEmitter,

            getController: this.getController.bind(this),
            getRequiredController: this.getRequiredController.bind(this),

            getState: this.getState.bind(this),
            getRequiredState: this.getRequiredState.bind(this)
        };

        ComponentModule.startCreatingComponent(componentProps);
    }
    private afterCreateComponentModules() {
        ComponentModule.endCreatingComponent();
    }

    // === Controller

    public registerController(controllerFactory: () => BaseController, name?: string) {
        this.beforeCreateComponentModules();
        
        const controller = controllerFactory();
        name = name ?? controller.constructor.name;

        if(this.controllers[name])
            throw new Error(`Controller with ${name} is already registered`);

        this.controllers[name] = controller;

        this.afterCreateComponentModules();
    }

    public getController<T extends BaseController>(name: string) {
        return this.controllers[name] as T | undefined;
    }

    public getRequiredController<T extends BaseController>(name: string): T {
        const controller = this.controllers[name] as T;

        if(!controller)
            throw new Error(`getRequiredController: controller \'${name}\' is not registered`);

        return controller;
    }

    // === State

    public registerState(stateFactory: () => BaseStateType, name?: string) {
        this.beforeCreateComponentModules();
        
        const state = stateFactory();
        name = name ?? state.constructor.name;

        if(this.states[name])
            throw new Error(`State with ${name} is already registered`);

        this.states[name] = state;

        this.afterCreateComponentModules();
    }

    public getState<T extends BaseStateType>(name: string) {
        return this.states[name] as T | undefined;
    }

    public getRequiredState<T extends BaseStateType>(name: string): T {
        const state = this.states[name] as T;

        if(!state) {
            console.log(this.states, this.container);
            throw new Error(`getRequiredState: state \'${name}\' is not registered`);
        }

        return state;
    }

    // ===

    public clear() {
        this._view.clear();
    }
}
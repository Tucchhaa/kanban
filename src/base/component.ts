import { BaseState, BaseStateType, IState } from "../base/state";
import { BaseView } from "../base/view";
import { Dictionary } from "../types";
import { ComponentModule, ComponentProps } from "./component-module";
import { BaseController } from "./controller";
import { EventEmitter, IEventEmitter } from "./event-emitter";
import { IClearable } from "./idisposable"; 

export type BaseComponentType = BaseComponent<object, IState<object>, BaseView>;

export class BaseComponent<
    TOptions extends object, 
    TState extends IState<TOptions>, 
    TView extends BaseView
> implements IClearable {
    private _name: string;
    private _container: HTMLElement;
    
    private _state: TState;
    private _view: TView;
    private states: Dictionary<object | undefined> = {};
    private controllers: Dictionary<BaseController | undefined> = {};

    public eventEmitter: IEventEmitter;

    constructor(
        name: string,
        stateType: new(options: TOptions) => TState, 
        viewType: new(container: HTMLElement) => TView, 
        container: HTMLElement | null, 
        options: TOptions
    ) {
        if(!container) {
            throw new Error(`${name}Component container is not defined`);
        }

        this._name = name;
        this._container = container;
        this.eventEmitter = new EventEmitter();
        
        // === Create state

        this._state = this.createComponentModule(() => new stateType(options));

        this.registerState(() => this._state);

        // === Create view

        this._view = this.createComponentModule(() => new viewType(container));
        this.eventEmitter.on('render', () => {
            this.clear();
            this.render();
        });
    }

    // ===

    protected extendView(viewExtenderFactory: () => BaseView) {
        const viewExtender = this.createComponentModule(viewExtenderFactory);
        this._view.extendView(viewExtender);
    }

    protected render() {
        this._view.render();
    }

    public clear() {
        this._view.clear();

        for(const controllerName in this.controllers!) {
            const controller = this.controllers[controllerName];

            controller?.clear();
        }
    }

    // === GETTERS

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

    // === CREATE COMPONENT MODULE

    private beforeCreateComponentModule() {
        const componentProps: ComponentProps = { 
            componentName: this._name,
            getContainer: () => this.container,
            eventEmitter: this.eventEmitter,

            getController: this.getController.bind(this),
            getRequiredController: this.getRequiredController.bind(this),

            getState: this.getState.bind(this),
            getRequiredState: this.getRequiredState.bind(this),

            state: this.state,
            view: this.view
        };

        ComponentModule.startCreatingComponent(componentProps);
    }
    private afterCreateComponentModule() {
        ComponentModule.endCreatingComponent();
    }

    private createComponentModule(createFunc: () => any) {
        this.beforeCreateComponentModule();
        
        const module = createFunc();

        this.afterCreateComponentModule();
    
        return module;
    }

    // === Controller

    public registerController(controllerFactory: () => BaseController, name?: string) {
        const controller = this.createComponentModule(controllerFactory) as BaseController;
        name = name ?? controller.constructor.name;

        if(this.controllers[name])
            throw new Error(`Controller with ${name} is already registered`);

        this.controllers[name] = controller;
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
        const state = this.createComponentModule(stateFactory) as BaseStateType;
        name = name ?? state.constructor.name;

        if(this.states[name])
            throw new Error(`State with ${name} is already registered`);

        this.states[name] = state;
    }

    public getState<T extends BaseStateType>(name: string) {
        return this.states[name] as T | undefined;
    }

    public getRequiredState<T extends BaseStateType>(name: string): T {
        const state = this.states[name] as T;

        if(!state) {
            throw new Error(`getRequiredState: state \'${name}\' is not registered`);
        }

        return state;
    }
}
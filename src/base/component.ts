import { BaseState } from "../base/state";
import { BaseView } from "../base/view";
import { Dictionary } from "../types";
import { ComponentModule, ComponentProps } from "./component-module";
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
    public container: HTMLElement;
    public isFirstRender: boolean;
    
    private _state: TState;
    private _view: TView;
    private controllers: Dictionary<object | undefined> = {};

    public eventEmitter: IEventEmitter;

    constructor(
        name: string,
        stateType: new(options: TOptions) => TState, 
        viewType: new(state: TState) => TView, 
        container: HTMLElement | null, options: TOptions,
        controllerType?: new(state: TState, view: TView) => TController
    ) {
        if(!container) {
            throw new Error(`${name}Component container is not defined`);
        }

        this._name = name;
        this.container = container;
        this.isFirstRender = true;

        this.eventEmitter = new EventEmitter();
        
        this.beforeCreateComponentModules();

        this._state = new stateType(options);
        this._view = new viewType(this._state);

        if(controllerType)
            this.registerController(() => new controllerType(this._state, this._view));

        this.afterCreateComponentModules();
    }

    // ===

    public get name() {
        return this._name;
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
            getIsFirstRender: () => this.isFirstRender,
            emitter: this.eventEmitter 
        };

        ComponentModule.startCreatingComponent(componentProps);
    }
    private afterCreateComponentModules() {
        ComponentModule.endCreatingComponent();
    }

    // ===

    public registerController(controllerFactory: () => BaseController, name?: string) {
        this.beforeCreateComponentModules();
        
        const controller = controllerFactory();
        name = name ?? controller.constructor.name;

        if(this.controllers[name])
            throw new Error(`Controller with ${name} is already registered`);

        this.controllers[name] = controller;

        this.afterCreateComponentModules();
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
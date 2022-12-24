import { BaseController } from "./controller";
import { IEventEmitter } from "./event-emitter";
import { IClearable } from "./idisposable";
import { BaseStateType } from "./state";
import { BaseView } from "./view";

export type ComponentProps = { 
    componentName: string,
    getContainer: () => HTMLElement,
    eventEmitter: IEventEmitter

    getController: <T extends BaseController>(name: string) => T | undefined,
    getRequiredController: <T extends BaseController>(name: string) => T,

    getState: <T extends BaseStateType>(name: string) => T | undefined,
    getRequiredState: <T extends BaseStateType>(name: string) => T,

    state: BaseStateType,
    view: BaseView
};

export class ComponentModule<
    TState extends BaseStateType = BaseStateType,
    TView extends BaseView = BaseView
> implements IClearable {
    protected componentName: string;
    protected getContainer: () => HTMLElement;
    private _eventEmitter: IEventEmitter;

    protected getController: <T extends BaseController>(name: string) => T | undefined;
    protected getRequiredController: <T extends BaseController>(name: string) => T;

    protected getState: <T extends BaseStateType>(name: string) => T | undefined;
    protected getRequiredState: <T extends BaseStateType>(name: string) => T;

    private _state: TState;
    private _view: TView;

    // ===

    public get container() {
        return this.getContainer();
    }

    public get eventEmitter() {
        return this._eventEmitter;
    }

    public get state() {
        return this._state;
    }

    public get view() {
        return this._view;
    }

    // ===

    constructor() {
        const props = ComponentModule.props[ComponentModule.props.length - 1];

        this.componentName = props.componentName;
        this.getContainer = props.getContainer;
        this._eventEmitter = props.eventEmitter;

        this.getController = props.getController;
        this.getRequiredController = props.getRequiredController;

        this.getState = props.getState;
        this.getRequiredState = props.getRequiredState;

        this._state = (props.state as TState);
        this._view = (props.view as TView);
    }

    public clear(): void { }

    // === STATIC

    private static props: ComponentProps[] = [];

    public static startCreatingComponent(componentProps: ComponentProps) {
        ComponentModule.props.push(componentProps);
    }

    public static endCreatingComponent() {
        const componentProps = ComponentModule.props.pop();
    }
}
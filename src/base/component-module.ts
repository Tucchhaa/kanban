import { BaseController } from "./controller";
import { IEventEmitter } from "./event-emitter";
import { IClearable } from "./idisposable";
import { BaseStateType } from "./state";

export type ComponentProps = { 
    componentName: string,
    getContainer: () => HTMLElement,
    eventEmitter: IEventEmitter

    getController: <T extends BaseController>(name: string) => T | undefined,
    getRequiredController: <T extends BaseController>(name: string) => T,

    getState: <T extends BaseStateType>(name: string) => T | undefined,
    getRequiredState: <T extends BaseStateType>(name: string) => T,
};

export class ComponentModule implements IClearable {
    protected componentName: string;
    protected getContainer: () => HTMLElement;
    private _eventEmitter: IEventEmitter;

    protected getController: <T extends BaseController>(name: string) => T | undefined;
    protected getRequiredController: <T extends BaseController>(name: string) => T;

    protected getState: <T extends BaseStateType>(name: string) => T | undefined;
    protected getRequiredState: <T extends BaseStateType>(name: string) => T;

    public get container() {
        return this.getContainer();
    }

    public get eventEmitter() {
        return this._eventEmitter;
    }

    constructor() {
        const props = ComponentModule.props[ComponentModule.props.length - 1];

        this.componentName = props.componentName;
        this.getContainer = props.getContainer;
        this._eventEmitter = props.eventEmitter;

        this.getController = props.getController;
        this.getRequiredController = props.getRequiredController;

        this.getState= props.getState;
        this.getRequiredState = props.getRequiredState;
    }

    public clear(): void { }

    // ===

    private static props: ComponentProps[] = [];

    public static startCreatingComponent(componentProps: ComponentProps) {
        ComponentModule.props.push(componentProps);
    }

    public static endCreatingComponent() {
        const componentProps = ComponentModule.props.pop();
    }
}
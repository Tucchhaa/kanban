import { IEventEmitter } from "./event-emitter";
import { IDisposable } from "./idisposable";

export type ComponentProps = { componentName: string, emitter: IEventEmitter };

export class ComponentModule implements IDisposable {
    private _eventEmitter: IEventEmitter;
    private _componentName: string;

    protected get eventEmitter() {
        return this._eventEmitter!;
    }

    protected get componentName() {
        return this._componentName!;
    }
    constructor() {
        this._eventEmitter = (ComponentModule.prototype as any)._eventEmitter;
        this._componentName = (ComponentModule.prototype as any)._componentName;
    }

    public dispose(): void { }

    // ===

    static props: ComponentProps[] = [];

    static startCreatingComponent(componentProps: ComponentProps) {
        ComponentModule.props.push(componentProps);

        (ComponentModule.prototype as any)._componentName = componentProps.componentName;
        (ComponentModule.prototype as any)._eventEmitter = componentProps.emitter;
    }

    static endCreatingComponent() {
        const componentProps = ComponentModule.props.pop();
        
        if(componentProps) {
            (ComponentModule.prototype as any)._componentName = componentProps.componentName;
            (ComponentModule.prototype as any)._eventEmitter = componentProps.emitter;
        }
    }
}
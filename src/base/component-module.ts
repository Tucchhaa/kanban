import { IEventEmitter } from "./event-emitter";
import { IClearable } from "./idisposable";

export type ComponentProps = { 
    componentName: string,
    getContainer: () => HTMLElement,
    emitter: IEventEmitter
};

export class ComponentModule implements IClearable {
    protected componentName: string;
    protected getContainer: () => HTMLElement;
    protected eventEmitter: IEventEmitter;

    protected get container() {
        return this.getContainer();
    }

    constructor() {
        this.componentName = (ComponentModule.prototype as any)._componentName;
        this.getContainer = (ComponentModule.prototype as any)._getContainer;
        this.eventEmitter = (ComponentModule.prototype as any)._eventEmitter;
    }

    public clear(): void { }

    // ===

    private static props: ComponentProps[] = [];

    private static setPropsToPrototype(props: ComponentProps) {
        (ComponentModule.prototype as any)._componentName = props.componentName;
        (ComponentModule.prototype as any)._getContainer = props.getContainer;
        (ComponentModule.prototype as any)._eventEmitter = props.emitter;
    }

    public static startCreatingComponent(componentProps: ComponentProps) {
        ComponentModule.props.push(componentProps);

        ComponentModule.setPropsToPrototype(componentProps)
    }

    public static endCreatingComponent() {
        const componentProps = ComponentModule.props.pop();
        
        if(componentProps) {
            this.setPropsToPrototype(componentProps);
        }
    }
}
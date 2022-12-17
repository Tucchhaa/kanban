import { IEventEmitter } from "./event-emitter";
import { IDisposable } from "./idisposable";

export type ComponentProps = { 
    componentName: string,
    getContainer: () => HTMLElement,
    getIsFirstRender: () => boolean,
    emitter: IEventEmitter
};

export class ComponentModule implements IDisposable {
    protected componentName: string;
    protected getContainer: () => HTMLElement;
    protected getIsFirstRender: () => boolean;
    protected eventEmitter: IEventEmitter;

    protected get container() {
        return this.getContainer();
    }
    protected get isFirstRender() {
        return this.getIsFirstRender();
    }

    constructor() {
        this.componentName = (ComponentModule.prototype as any)._componentName;
        this.getContainer = (ComponentModule.prototype as any)._getContainer;
        this.getIsFirstRender = (ComponentModule.prototype as any)._getIsFirstRender;
        this.eventEmitter = (ComponentModule.prototype as any)._eventEmitter;
    }

    public dispose(): void { }

    // ===

    private static props: ComponentProps[] = [];

    private static setPropsToPrototype(props: ComponentProps) {
        (ComponentModule.prototype as any)._componentName = props.componentName;
        (ComponentModule.prototype as any)._getContainer = props.getContainer;
        (ComponentModule.prototype as any)._getIsFirstRender = props.getIsFirstRender;
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
import { processClasses } from "../helpers";
import { Dictionary } from "../types";
import { BaseComponentType } from "./component";
import { ComponentModule } from "./component-module";
import { BaseStateType } from "./state";

type ComponentClass = new(container: HTMLElement, options: object) => BaseComponentType;

type RenderElement = {
    key: string;
    container: HTMLElement,
    componentKeys: string[],
    render: (container: HTMLElement) => void
};

class RenderElementsManager {
    private elements: Dictionary<RenderElement | undefined> = {};
    private currentElementKey: string = "";

    private get currentElement() {
        return this.elements[this.currentElementKey]!;
    }

    public create(element: RenderElement) {
        const { key } = element;

        if(this.elements[key])
            throw new Error(`Render error: Render elements must have unique names. Repating name: ${key}`);

        this.elements[key] = element;
    }

    public render(elementKey: string, components: Dictionary<BaseComponentType>) {
        this.currentElementKey = elementKey;

        this.clearComponents(components);
        this.currentElement.container.innerHTML = "";
        this.currentElement.render(this.currentElement.container);

        this.currentElementKey = "";
    }

    public getContainer(elementKey: string) {
        return this.elements[elementKey]!.container;
    }

    public onComponentCreated(key: string) {
        if(this.elements[this.currentElementKey]) {
            this.currentElement.componentKeys.push(key);
        }
    }

    private clearComponents(components: Dictionary<BaseComponentType>) {
        for(const key of this.currentElement.componentKeys) {
            components[key].clear();
            delete components[key];
        }

        this.currentElement.componentKeys = [];
    }

    public clear() {
        this.elements = {};
        this.currentElementKey = "";
    }
}

export abstract class BaseView<TState extends BaseStateType = BaseStateType> extends ComponentModule<TState> {
    private components: Dictionary<BaseComponentType> = {};
    private renderElementsManager: RenderElementsManager = new RenderElementsManager();

    private viewExtenders: BaseView[] = [];

    protected onClear: { (): void }[] = [];

    constructor(classes?: string[] | string) {
        super();

        this.container.classList.add(...processClasses(classes));
    }

    // PUBLIC

    public render() {
        this.container.innerHTML = "";
        this.onClear = [];

        const fragment = document.createDocumentFragment();
        
        this._render(fragment);

        for(const viewExtender of this.viewExtenders)
            viewExtender._render(fragment);

        this.container.appendChild(fragment);

        this.eventEmitter.emit('rendered');
    }

    public extendView(viewExtender: BaseView) {
        this.viewExtenders.push(viewExtender);
    }

    public clear(): void {
        // internal level
        this.clearInternalComponents();

        // this level
        for(const func of this.onClear)
            func();

        this.renderElementsManager.clear();

        super.clear();
        
        // extender level
        for(const viewExtender of this.viewExtenders)
            viewExtender.clear();
    }

    // === PROTECTED METHODS

    protected abstract _render(fragment: DocumentFragment, data?: any): void;

    protected createDOMElement(tagName: string, classes?: string[] | string) {
        const element = document.createElement(tagName);

        if(classes) {
            typeof(classes) === 'string' ?
                element.classList.add(classes) :
                element.classList.add(...classes);
        }

        return element;
    }

    protected createComponent(container: HTMLElement, componentType: ComponentClass, options: object, key?: string): BaseComponentType {
        const newComponent = new componentType(container, options);
        key = key ?? newComponent.constructor.name;

        if(this.components[key]) {
            debugger;
            throw new Error(`Render error: Elements of the same component must contain unique keys. Repating key: ${key}`);    
        }

        this.components[key] = newComponent;

        this.renderElementsManager.onComponentCreated(key);

        return newComponent;
    }

    // === Render Elements

    protected createRenderElement(elementKey: string, container: HTMLElement, renderFunc: (container: HTMLElement) => void): HTMLElement {
        this.renderElementsManager.create({
            key: elementKey,
            container,
            componentKeys: [],
            render: renderFunc
        });

        this.renderElement(elementKey);

        return container;
    }

    public renderElement(elementKey: string) {
        this.renderElementsManager.render(elementKey, this.components);
    }

    public getElementContainer(elementKey: string) {
        return this.renderElementsManager.getContainer(elementKey);
    }

    // ===

    private clearComponentsByKeys(keys: string[]) {
        for(const key of keys) {
            this.components[key].clear();
            delete this.components[key];
        }
    }

    private clearInternalComponents() {
        for(const key in this.components) {
            const component = this.components[key];

            component.clear();
        }

        this.components = {};
    }
}
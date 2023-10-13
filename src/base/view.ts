import { type } from "os";
import { processClasses } from "../helpers";
import { ClassList, Dictionary } from "../types";
import { BaseComponentType } from "./component";
import { ComponentModule } from "./component-module";
import { RenderElementsManager } from "./render-elements.manager";
import { BaseStateType } from "./state";

type ComponentClass = new(container: HTMLElement, options: object) => BaseComponentType;

export abstract class BaseView<TState extends BaseStateType = BaseStateType> extends ComponentModule<TState> {
    private components: Dictionary<BaseComponentType> = {};
    private renderElementsManager: RenderElementsManager = new RenderElementsManager();

    private viewExtenders: BaseView[] = [];

    protected onClear: { (): void }[] = [];

    constructor(classes?: ClassList) {
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

    protected abstract _render(fragment: DocumentFragment): void;

    protected createDOMElement(tagName: string, classes?: ClassList) {
        const element = document.createElement(tagName);

        if(classes) {
            typeof(classes) === 'string' ?
                element.classList.add(classes) :
                element.classList.add(...classes);
        }

        return element;
    }

    protected createComponent<TOptions extends object>(container: HTMLElement | string, componentType: ComponentClass, options: TOptions, key?: string): BaseComponentType {
        if(typeof container === 'string')
            container = this.createDOMElement(container);
        
        const newComponent = new componentType(container, options);
        key = key ?? newComponent.constructor.name;

        if(this.components[key]) {
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
            onClear: [],
            render: renderFunc,
        });

        this.renderElement(elementKey);

        return container;
    }

    protected onClearRenderElement(elementKey: string, clearFunc: () => void) {
        this.renderElementsManager.addClearFunc(elementKey, clearFunc);
    }

    public renderElement(elementKey: string) {
        this.renderElementsManager.render(elementKey, this.components);
    }

    public getElementContainer(elementKey: string) {
        return this.renderElementsManager.getContainer(elementKey);
    }

    // ===

    private clearInternalComponents() {
        for(const key in this.components) {
            const component = this.components[key];

            component.clear();
        }

        this.components = {};
    }
}
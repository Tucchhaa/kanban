import { processClasses } from "../helpers";
import { Dictionary } from "../types";
import { BaseComponentType } from "./component";
import { ComponentModule } from "./component-module";
import { BaseStateType } from "./state";

type ComponentClass = new(container: HTMLElement, options: object) => BaseComponentType;

export abstract class BaseView<TState extends BaseStateType = BaseStateType> extends ComponentModule<TState> {
    private components: Dictionary<BaseComponentType> = {};
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

    protected createComponent(container: HTMLElement, componentType: ComponentClass, options: object, key?: string) {
        const newComponent = new componentType(container, options);
        key = key ?? newComponent.constructor.name;

        if(this.components[key]) {
            throw new Error('Render error: Elements of the same component must contain unique keys');    
        }

        this.components[key] = newComponent;

        return newComponent;
    }

    private clearInternalComponents() {
        for(const key in this.components) {
            const component = this.components[key];

            component.clear();
        }

        this.components = {};
    }
}
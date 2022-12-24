import { processClasses } from "../helpers";
import { Dictionary } from "../types";
import { BaseComponentType } from "./component";
import { ComponentModule } from "./component-module";
import { BaseStateType } from "./state";

export type BaseViewType = BaseView<BaseStateType>;

type ComponentClass = new(container: HTMLElement, options: object) => BaseComponentType;

export abstract class BaseView<TState extends BaseStateType> extends ComponentModule {
    protected state: TState;
    
    private components: Dictionary<BaseComponentType> = {};

    protected onClear: { (): void }[] = [];

    constructor(state: TState, classes?: string[] | string) {
        super();
        
        this.state = state;

        this.container.classList.add(...processClasses(classes));

        this.eventEmitter.on('render', () => {
            this.clear();
            this.render();
        });
    }

    protected abstract _render(fragment: DocumentFragment): void;

    public render() {
        this.container.innerHTML = "";
        this.onClear = [];

        const fragment = document.createDocumentFragment();
        
        this._render(fragment);

        this.container.appendChild(fragment);

        this.eventEmitter.emit('rendered');
    }

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

    public clear(): void {
        this.clearInternalComponents();

        for(const func of this.onClear)
            func();

        super.clear();
    }

    private clearInternalComponents() {
        for(const key in this.components) {
            const component = this.components[key];

            component.clear();
        }

        this.components = {};
    }
}
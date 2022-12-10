import { processClasses } from "../helpers";
import { Dictionary } from "../types";
import { BaseComponentType } from "./component";
import { ComponentModule } from "./component-module";
import { BaseStateType } from "./state";

export type BaseViewType = BaseView<BaseStateType>;

export abstract class BaseView<TState extends BaseStateType> extends ComponentModule {
    protected model: TState;
    protected container: HTMLElement;
    
    private components: Dictionary<BaseComponentType> = {};

    protected onDispose: { (): void }[] = [];

    constructor(model: TState, container: HTMLElement, classes?: string[] | string) {
        super();
        
        this.model = model;
        this.container = container;

        this.container.classList.add(...processClasses(classes));

        // setTimeout(() => this._render());
        this._render();

        this.eventEmitter.on('render', () => this._render());
    }

    protected abstract render(fragment: DocumentFragment): void;

    public dispose(): void {
        for(const func of this.onDispose)
            func();

        super.dispose();
    }

    protected _render() {
        this.container.innerHTML = "";

        const fragment = document.createDocumentFragment();
        
        this.render(fragment);

        this.container.appendChild(fragment);
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

    protected createComponent(container: HTMLElement, componentType: new(container: HTMLElement, options: object) => BaseComponentType, options: object, key?: string) {
        const newComponent = new componentType(container, options);
        
        if(key) {
            const component = this.components[key];

            component && component.dispose();

            this.components[key] = newComponent;
        }

        return newComponent;
    }
}
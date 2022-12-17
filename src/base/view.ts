import { processClasses } from "../helpers";
import { Dictionary } from "../types";
import { BaseComponentType } from "./component";
import { ComponentModule } from "./component-module";
import { BaseStateType } from "./state";

export type BaseViewType = BaseView<BaseStateType>;

export abstract class BaseView<TState extends BaseStateType> extends ComponentModule {
    protected state: TState;
    
    private components: Dictionary<BaseComponentType | undefined> = {};

    protected onDispose: { (): void }[] = [];

    constructor(state: TState, classes?: string[] | string) {
        super();
        
        this.state = state;

        this.container.classList.add(...processClasses(classes));

        this._render();

        this.eventEmitter.on('render', () => this._render());
    }

    protected abstract render(fragment: DocumentFragment): void;

    public override dispose(): void {
        for(const func of this.onDispose)
            func();

        super.dispose();
    }

    protected _render() {
        this.container.innerHTML = "";

        const fragment = document.createDocumentFragment();
        
        this.render(fragment);

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

    // protected createComponent(container: HTMLElement, componentType: new(container: HTMLElement, options: object) => BaseComponentType, options: object, key?: string) {
    //     const newComponent = new componentType(container, options);
        
    //     if(key) {
    //         const component = this.components[key];

    //         component && component.dispose();
    //         // compoennt.container = container;
    //         // component.state.update(options, true);

    //         this.components[key] = newComponent;
    //     }

    //     return newComponent;
    // }

    protected createComponent(container: HTMLElement, componentType: new(container: HTMLElement, options: object) => BaseComponentType, options: object, key?: string): BaseComponentType {
        if(key) {
            const component = this.components[key];

            if(component) {
                component.dispose();

                this.copyAttributes(component.container, container);
                component.isFirstRender = false;
                component.container = container;
                component.state.update(options);
            }
            else {
                this.components[key] = new componentType(container, options);
            }

            return this.components[key]!;
        }

        return new componentType(container, options)
    }

    private copyAttributes(from: HTMLElement, to: HTMLElement) {
        for(const name of from.getAttributeNames()) {
            const value = from.getAttribute(name);

            value && to.setAttribute(name, value);
        }
    }
}
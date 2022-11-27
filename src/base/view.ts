import { EventEmitter } from "./event-emitter";

export abstract class BaseView<T> extends EventEmitter {
    protected model: T;
    protected container: HTMLElement;
    
    constructor(model: any, container: HTMLElement, classes?: string[] | string) {
        super();
        
        this.model = model;
        this.container = container;

        if(classes) {
            typeof(classes) === 'string' ?
                container.classList.add(classes) :
                container.classList.add(...classes);
        }

        this.render();
    }

    protected abstract _render(fragment: DocumentFragment): void;

    public render() {
        this.container.innerHTML = "";

        const fragment = document.createDocumentFragment();
        
        this._render(fragment);

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
}
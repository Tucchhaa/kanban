import { processClasses } from "../helpers";
import { EventEmitter } from "./event-emitter";

export abstract class BaseView<TState extends EventEmitter> extends EventEmitter {
    protected model: TState;
    protected container: HTMLElement;
    
    constructor(model: TState, container: HTMLElement, classes?: string[] | string) {
        super();
        
        this.model = model;
        this.container = container;

        this.container.classList.add(...processClasses(classes));

        this.render();

        this.model.on('render', () => this.render());
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
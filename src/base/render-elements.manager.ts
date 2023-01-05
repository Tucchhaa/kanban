import { Dictionary } from "../types";
import { BaseComponentType } from "./component";

type RenderElement = {
    key: string;
    container: HTMLElement,
    componentKeys: string[],
    onClear: (() => void)[],
    render: (container: HTMLElement) => void
};

export class RenderElementsManager {
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

        this.clearElement(elementKey, components);
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

    public addClearFunc(elementKey: string, clearFunc: () => void) {
        this.elements[elementKey]!.onClear.push(clearFunc);
    }

    private clearElement(elementKey: string, components: Dictionary<BaseComponentType>) {
        for(const clearFunc of this.elements[elementKey]!.onClear)
            clearFunc();

        this.clearComponents(components);
    }

    private clearComponents(components: Dictionary<BaseComponentType>) {
        for(const key of this.currentElement.componentKeys) {
            components[key].clear();
            delete components[key];
        }

        this.currentElement.componentKeys = [];
    }

    public clear() {
        for(const elementKey in this.elements)
            for(const clearFunc of this.elements[elementKey]!.onClear)
                clearFunc();

        this.elements = {};
        this.currentElementKey = "";
    }
}
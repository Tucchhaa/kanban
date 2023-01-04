import { Dictionary } from "../types";
import { BaseComponentType } from "./component";

type RenderElement = {
    key: string;
    container: HTMLElement,
    componentKeys: string[],
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
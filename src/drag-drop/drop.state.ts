import { BaseState } from "../base/state";

type DropOptions = {
    draggingItem?: any | null;
    items?: any[] | null;
    isEqual?: ((itemA: any, itemB: any) => boolean) | null;
}

export class DropState extends BaseState<DropOptions> {
    public isEqual() {
        return this.state.isEqual!;
    }

    public get items() {
        return this.state.items!;
    }

    constructor(state: DropOptions) {
        const defaultState = {
            draggingItem: null,
            items: null,
            isEqual: (itemA: any, itemB: any) => itemA === itemB
        };

        super(state, defaultState);
    }

    public updateItems(items: any[]) {
        this.updateByKey('items', items, false);
    }
}
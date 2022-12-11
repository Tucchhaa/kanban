import { BaseState } from "../base/state";

type DropOptions = {
    draggingItem?: any | null;
    items?: any[] | null;
    getIndex?: ((items: any, item: any) => number) | null;
}

export class DropState extends BaseState<DropOptions> {
    public getIndex(item: any) {
        return this.state.getIndex!(this.state.items, item);
    }

    public get items() {
        return this.state.items!;
    }

    constructor(state: DropOptions) {
        const defaultState = {
            draggingItem: null,
            items: null,
            getIndex: null
        };

        super(state, defaultState);
    }

    public updateItems(items: any[]) {
        this.updateByKey('items', items, false);
    }
}
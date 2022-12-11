import { BaseState } from "../base/state";

type DropOptions<ItemType extends object> = {
    items?: ItemType[] | null;
    isEqual?: ((itemA: ItemType, itemB: ItemType) => boolean) | null;
}

export class DropState<TItem extends object> extends BaseState<DropOptions<TItem>> {
    public isEqual() {
        return this.state.isEqual!;
    }

    public get items() {
        return this.state.items!;
    }

    constructor(state: DropOptions<TItem>) {
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
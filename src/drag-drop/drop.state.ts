import { BaseState } from "../base/state";

type DropOptions<ItemType extends object> = {
    items?: ItemType[] | null;
    isItemsEqual?: ((itemA: ItemType, itemB: ItemType) => boolean) | null;
}

export class DropState<TItem extends object> extends BaseState<DropOptions<TItem>> {
    public isitemsEqual() {
        return this.state.isItemsEqual!;
    }

    public get items() {
        return this.state.items!;
    }

    constructor(state: DropOptions<TItem>) {
        const defaultState = {
            draggingItem: null,
            items: null,
            isItemsEqual: (itemA: any, itemB: any) => itemA === itemB
        };

        super(state, defaultState);
    }

    public updateItems(items: any[]) {
        this.updateByKey('items', items, false);
    }
}
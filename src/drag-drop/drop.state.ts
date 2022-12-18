import { BaseState } from "../base/state";

type DropOptions<ItemType extends object> = {
    direction?: 'horizontal' | 'vertical';
    items?: ItemType[] | null;
    isEqual?: ((itemA: ItemType, itemB: ItemType) => boolean) | null;
}

export class DropState<TItem extends object> extends BaseState<DropOptions<TItem>> {
    public get direction() {
        return this.state.direction!;
    }

    public get items() {
        return this.state.items!;
    }
    
    public isEqual() {
        return this.state.isEqual!;
    }

    constructor(state: DropOptions<TItem>) {
        const defaultState: DropOptions<TItem> = {
            direction: 'horizontal',
            items: null,
            isEqual: (itemA: any, itemB: any) => itemA === itemB
        };

        super(state, defaultState);
    }

    public updateItems(items: any[]) {
        this.updateByKey('items', items, false);
    }
}
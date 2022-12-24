import { BaseState } from "../base/state";

type DropOptions<ItemType extends object> = {
    direction?: 'horizontal' | 'vertical';
    items?: ItemType[] | null;
    isEqual?: ((itemA: ItemType, itemB: ItemType) => boolean) | null;
}

export class DropState<TItem extends object> extends BaseState<DropOptions<TItem>> {
    public get direction() {
        return this.options.direction!;
    }

    public get items() {
        return this.options.items!;
    }
    
    public isEqual() {
        return this.options.isEqual!;
    }

    constructor(options: DropOptions<TItem>) {
        const defaultOptions: DropOptions<TItem> = {
            direction: 'horizontal',
            items: null,
            isEqual: (itemA: any, itemB: any) => itemA === itemB
        };

        super(options, defaultOptions);
    }

    public updateItems(items: any[]) {
        this.updateByKey('items', items, false);
    }
}
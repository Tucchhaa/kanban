import { BaseState } from "../base/state";

type DropOptions<TItem extends object> = {
    direction?: 'horizontal' | 'vertical';

    isItemsEqual?: ((itemA: TItem, itemB: TItem) => boolean) | null;

    scrollBoundaryRange?: number;
    scrollSpeed?: number;
}

export class DropState<TItem extends object> extends BaseState<DropOptions<TItem>> {
    public get direction() {
        return this.options.direction!;
    }
    
    public get isItemsEqual() {
        return this.options.isItemsEqual!;
    }

    public get scrollBoundaryRange() {
        return this.options.scrollBoundaryRange!;
    }

    public get scrollSpeed() {
        return this.options.scrollSpeed!;
    }

    constructor(options: DropOptions<TItem>) {
        const defaultOptions: DropOptions<TItem> = {
            direction: 'horizontal',

            isItemsEqual: (itemA: TItem, itemB: TItem) => itemA === itemB,

            scrollBoundaryRange: 80,
            scrollSpeed: 40
        };

        super(defaultOptions, options);
    }
}
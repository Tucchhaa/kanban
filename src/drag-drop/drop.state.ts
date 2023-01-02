import { BaseState } from "../base/state";

type DropOptions<TItem extends object> = {
    direction?: 'horizontal' | 'vertical';
    isEqual?: ((itemA: TItem, itemB: TItem) => boolean) | null;
}

export class DropState<TItem extends object> extends BaseState<DropOptions<TItem>> {
    public get direction() {
        return this.options.direction!;
    }
    
    public isEqual() {
        return this.options.isEqual!;
    }

    constructor(options: DropOptions<TItem>) {
        const defaultOptions: DropOptions<TItem> = {
            direction: 'horizontal',
            isEqual: (itemA: TItem, itemB: TItem) => itemA === itemB
        };

        super(defaultOptions, options);
    }
}
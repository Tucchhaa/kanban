import { BaseState } from "../base/state";

class DropOptions {
    draggingItem?: any | null;
    items?: any[] | null;
}

export class DropState extends BaseState<DropOptions> {

    constructor(state: DropOptions) {
        const defaultState = {
            draggingItem: null,
            items: null
        };

        super(state, defaultState);
    }
}
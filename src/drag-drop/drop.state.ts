import { BaseState } from "../base/state";

class DropOptions {
    isDragging?: boolean = false;
    dragging?: object | null;
    droppable?: object | null;
    draggables?: object | null;
}

export class DropState extends BaseState<DropOptions> {
    public get isDragging() {
        return this.state.isDragging!;
    }

    constructor(state: DropOptions) {
        const defaultState = {
            isDragging: false,
            dragging: null,
            droppable: null,
            draggables: null
        };

        super(state, defaultState);
    }
}
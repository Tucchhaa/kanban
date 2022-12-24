import { BaseState } from "../base/state";

type DragOptions = {
    isDragging?: boolean;
    draggableArea?: HTMLElement;
}

export class DragState extends BaseState<DragOptions> {
    public get isDragging() {
        return this.state.isDragging!;
    }

    public get draggableArea() {
        return this.state.draggableArea!;
    }

    constructor(state: DragOptions) {
        const defaultState: DragOptions = {
            isDragging: false,
            draggableArea: undefined
        };

        super(state, defaultState);
    }
}
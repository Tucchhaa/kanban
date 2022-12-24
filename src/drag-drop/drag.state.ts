import { BaseState } from "../base/state";

type DragOptions = {
    isDragging?: boolean;
    draggableArea?: HTMLElement;
    disabled?: boolean;
}

export class DragState extends BaseState<DragOptions> {
    public get isDragging() {
        return this.state.isDragging!;
    }

    public get draggableArea() {
        return this.state.draggableArea!;
    }

    public get disabled() {
        return this.state.disabled!;
    }

    constructor(state: DragOptions) {
        const defaultState: DragOptions = {
            isDragging: false,
            draggableArea: undefined,
            disabled: false
        };

        super(state, defaultState);
    }
}
import { BaseState } from "../base/state";

type DragOptions = {
    draggableArea?: HTMLElement;
}

export class DragState extends BaseState<DragOptions> {
    public get draggableArea() {
        return this.state.draggableArea!;
    }

    constructor(state: DragOptions) {
        const defaultState = {
            draggableArea: undefined,
        };

        super(state, defaultState);
    }
}
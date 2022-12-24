import { BaseState } from "../base/state";

type DragOptions = {
    isDragging?: boolean;
    draggableArea?: HTMLElement;
    disabled?: boolean;
}

export class DragState extends BaseState<DragOptions> {
    public get isDragging() {
        return this.options.isDragging!;
    }

    public get draggableArea() {
        return this.options.draggableArea!;
    }

    public get disabled() {
        return this.options.disabled!;
    }

    constructor(options: DragOptions) {
        const defaultOptions: DragOptions = {
            isDragging: false,
            draggableArea: undefined,
            disabled: false
        };

        super(options, defaultOptions);
    }
}
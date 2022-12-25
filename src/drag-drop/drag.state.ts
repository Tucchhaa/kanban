import { BaseState } from "../base/state";

type DragOptions = {
    isDragging?: boolean;
    disabled?: boolean;
}

export class DragState extends BaseState<DragOptions> {
    public get isDragging() {
        return this.options.isDragging!;
    }

    public get disabled() {
        return this.options.disabled!;
    }

    constructor(options: DragOptions = {}) {
        const defaultOptions: DragOptions = {
            isDragging: false,
            disabled: false
        };

        super(options, defaultOptions);
    }
}
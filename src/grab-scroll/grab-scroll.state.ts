import { BaseState } from "../base/state";

class GrabScrollOptions {
    disabled?: boolean;
}

export class GrabScrollState extends BaseState<GrabScrollOptions> {
    public get disabled() {
        return this.options.disabled!;
    }

    constructor(options: GrabScrollOptions) {
        const defaultOptions: GrabScrollOptions = {
            disabled: false
        };

        super(defaultOptions, options);
    }
}
import { BaseComponent } from "../base/component";
import { PromptController } from "../prompt/prompt.controller";
import { PromptOptions, PromptState } from "../prompt/prompt.state";
import { PromptView } from "../prompt/prompt.view";

export class PromptComponent extends BaseComponent<PromptOptions, PromptState, PromptView> {
    constructor(container: HTMLElement | null, options: PromptOptions) {
        super('Prompt', PromptState, PromptView, container, options);

        this.registerController(() => new PromptController());

        super.render();
    }
}
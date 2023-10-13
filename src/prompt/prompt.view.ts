import { BaseView } from "../base/view";
import { ButtonOptions } from "../button/button.state";
import { ButtonComponent } from "../components/button.component";
import { concatClasses } from "../helpers";
import { ClassList } from "../types";
import { PromptState } from "./prompt.state";

export class PromptView extends BaseView<PromptState> {
    constructor(classes: ClassList) {
        super(concatClasses(classes, 'prompt'));
    }

    protected _render(fragment: DocumentFragment): void {        
        fragment.append(
            this.createRenderElement('text', this.createDOMElement('div', 'prompt-text'), this.renderText.bind(this)),
            this.createRenderElement('buttons', this.createDOMElement('div', 'prompt-buttons'), this.renderButtons.bind(this)),
        );
    }

    private renderText(container: HTMLElement) {
        container.innerText = this.state.text;
    }

    private renderButtons(container: HTMLElement) {
        const confirmBtn = this.createComponent<ButtonOptions>('span', ButtonComponent, {
            text: 'confirm',
            className: 'prompt-confirm',
            onClick: this.state.onConfirm
        }, 'prompt-confirm-btn');

        const cancelBtn = this.createComponent<ButtonOptions>('span', ButtonComponent, {
            text: 'cancel',
            className: 'prompt-cancel',
            onClick: this.state.onCancel
        }, 'prompt-cancel-btn');

        container.append(confirmBtn.container, cancelBtn.container);
    }
}
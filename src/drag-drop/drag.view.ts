import { BaseState, BaseStateType } from "../base/state";
import { BaseView } from "../base/view";
import { processClasses } from "../helpers";

export abstract class DragView<TState extends BaseStateType> extends BaseView<TState> {
    constructor(state: TState, container: HTMLElement, classes?: string[] | string) {
        const _classes = ['draggable', ...processClasses(classes)];
        super(state, container, _classes);
    }

    protected render(fragment: DocumentFragment): void {
        const dragStart = (e: MouseEvent) => {
            this.eventEmitter.emit('drag-start', e, this.container)
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        };

        const drag = (e: MouseEvent) => this.eventEmitter.emit('drag', e);

        const dragEnd = (e: MouseEvent) => {
            this.eventEmitter.emit('drag-end', e);
            unsubscribe();
        };

        // ===

        this.container.addEventListener('mousedown', dragStart);

        const unsubscribe = () => {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
        }

        this.onDispose.push(unsubscribe);
    }

}
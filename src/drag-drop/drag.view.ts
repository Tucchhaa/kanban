import { BaseState, BaseStateType } from "../base/state";
import { BaseView } from "../base/view";
import { processClasses } from "../helpers";
import { DragState } from "./drag.state";

export abstract class DragView<TState extends BaseStateType> extends BaseView<TState> {
    constructor(state: TState, classes?: string[] | string) {
        const _classes = ['draggable', ...processClasses(classes)];
        super(state, _classes);
    }

    protected _render(fragment: DocumentFragment): void {
        let dragStartTimeout: any;

        const click = () => {
            clearTimeout(dragStartTimeout);
        }

        const dragStart = (e: MouseEvent) => {
            dragStartTimeout = setTimeout(() => {
                this.eventEmitter.emit('drag-start', e);
        
                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', dragEnd);
            }, 100);
        };

        const drag = (e: MouseEvent) => this.eventEmitter.emit('drag', e);

        const dragEnd = (e: MouseEvent) => {
            this.eventEmitter.emit('drag-end', e);
            unsubscribeDocumentListeners();
        };

        // ===

        const { draggableArea } = this.getRequiredState<DragState>(DragState.name);
        draggableArea.addEventListener('mousedown', dragStart);
        draggableArea.addEventListener('click', click);

        const unsubscribeDocumentListeners = () => {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
        }

        this.onClear.push(unsubscribeDocumentListeners);
        this.onClear.push(() => draggableArea.removeEventListener('mousedown', dragStart));
    }
}
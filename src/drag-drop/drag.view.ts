import { BaseStateType } from "../base/state";
import { BaseView } from "../base/view";
import { concatClasses } from "../helpers";
import { DragState } from "./drag.state";

export class DragView<TState extends BaseStateType> extends BaseView<TState> {
    constructor(classes?: string[] | string) {
        const _classes = concatClasses('draggable', classes);
        super(_classes);
    }

    protected _render(fragment: DocumentFragment): void {
        const dragState = this.getRequiredState<DragState>(DragState.name);

        // ===

        let isMouseDown: boolean;
        let initX: number, initY: number;

        const setIsMouseDownFalse = () => {
            isMouseDown = false;
        }

        const onMouseDown = (e: MouseEvent) => {
            initX = e.clientX;
            initY = e.clientY;
            isMouseDown = true;
        };

        const onMouseMove = (e: MouseEvent) => {
            const isDragAllowed = !dragState.disabled && !dragState.isDragging;

            if(isDragAllowed) {
                if(isMouseDown && this.isThresholdPassed(initX, initY, e.clientX, e.clientY)) {
                    this.startDrag(e);
                }
            }
        }

        // ===
        const { draggableArea } = dragState;
        draggableArea.addEventListener('mousedown', onMouseDown);
        draggableArea.addEventListener('mousemove', onMouseMove);

        draggableArea.addEventListener('click', setIsMouseDownFalse);
        draggableArea.addEventListener('mouseup', setIsMouseDownFalse);
        draggableArea.addEventListener('mouseout', setIsMouseDownFalse);
        
        this.onClear.push(() => {
            draggableArea.removeEventListener('mousedown', onMouseDown);
            draggableArea.removeEventListener('mousemove', onMouseMove);

            draggableArea.removeEventListener('click', setIsMouseDownFalse);
            draggableArea.removeEventListener('mouseup', setIsMouseDownFalse);
            draggableArea.removeEventListener('mouseout', setIsMouseDownFalse);
        });
    }

    private isThresholdPassed(initX: number, initY: number, lastX: number, lastY: number) {
        return Math.abs(initX - lastX) >= 2 || Math.abs(initY - lastY) >= 2;
    }

    private startDrag(e: MouseEvent) {
        const drag = (e: MouseEvent) => this.eventEmitter.emit('drag', e);

        const dragEnd = (e: MouseEvent) => {
            this.eventEmitter.emit('drag-end', e);
            unsubscribeDocumentListeners();
        };

        this.eventEmitter.emit('drag-start', e);
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // ===

        const unsubscribeDocumentListeners = () => {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
        }
        this.onClear.push(unsubscribeDocumentListeners);
    }
}
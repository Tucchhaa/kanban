import { BaseController } from "../base/controller";
import { UndefinedViewPropertyError } from "../utils/errors";
import { mouse } from "../utils/mouse";
import { GrabScrollState } from "./grab-scroll.state";

export class GrabScrollController extends BaseController {
    private grabScrollState: GrabScrollState;
    private _grabScrollElement?: HTMLElement;

    private initScrollTop: number = 0;
    private initScrollLeft: number = 0;
    private initMouseY: number = 0;
    private initMouseX: number = 0;

    constructor() {
        super();

        this.grabScrollState = this.getRequiredState<GrabScrollState>(GrabScrollState.name);

        this.eventEmitter
            .on('disable-grab-scroll', () => this.grabScrollState.updateByKey('disabled', true))
            .on('enable-grab-scroll',  () => this.grabScrollState.updateByKey('disabled', false))

        this.eventEmitter.on('rendered', () => {
            this.subscribeEventHandlers();
    
            const { grabScrollElement } = this.view as any;

            if(!grabScrollElement)
                throw new UndefinedViewPropertyError(GrabScrollController.name, this.componentName, 'scrollElement');

            this._grabScrollElement = grabScrollElement;;
        });
    }


    private get grabScrollElement() {
        return this._grabScrollElement!;
    }
    // ===

    private subscribeEventHandlers() {
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
            if(isMouseDown && this.isThresholdPassed(initX, initY, e.clientX, e.clientY)) {
                setTimeout(() => {
                    if(!this.grabScrollState.disabled)
                        this.startGrab();
                });
            }
        }

        // ===
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('click', setIsMouseDownFalse);
        document.addEventListener('mouseup', setIsMouseDownFalse);
        document.addEventListener('mouseout', setIsMouseDownFalse);
        
        this.onClear.push(() => {
            document!.removeEventListener('mousedown', onMouseDown);
            document!.removeEventListener('mousemove', onMouseMove);

            document!.removeEventListener('click', setIsMouseDownFalse);
            document!.removeEventListener('mouseup', setIsMouseDownFalse);
            document!.removeEventListener('mouseout', setIsMouseDownFalse);
        });
    }

    private startGrab() {
        this.initScrollTop = this.grabScrollElement.scrollTop;
        this.initScrollLeft = this.grabScrollElement.scrollLeft;

        this.initMouseY = mouse.position.y;
        this.initMouseX = mouse.position.x;

        const mouseMoveHandler = () => {
            this.grabScrollElement.scrollLeft = this.initScrollLeft + (this.initMouseX - mouse.position.x);
            this.grabScrollElement.scrollTop = this.initScrollTop + (this.initMouseY - mouse.position.y);
        };
        const mouseUpHandler = () => {
            unsubscribeDocumentListeners();
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        const unsubscribeDocumentListeners = () => {
            document!.removeEventListener('mousemove', mouseMoveHandler);
            document!.removeEventListener('mouseup', mouseUpHandler);
        };

        this.onClear.push(unsubscribeDocumentListeners);
    }

    private isThresholdPassed(initX: number, initY: number, lastX: number, lastY: number) {
        return Math.abs(initX - lastX) >= 2 || Math.abs(initY - lastY) >= 2;
    }
}
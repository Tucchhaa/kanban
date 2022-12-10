import { IEventEmitter } from "./event-emitter";
import { IDisposable } from "./idisposable";

export class ComponentModule implements IDisposable {
    private _eventEmitter?: IEventEmitter;

    protected get eventEmitter() {
        return this._eventEmitter!;
    }

    constructor() {
        this._eventEmitter = (ComponentModule.prototype as any)._eventEmitter;
    }

    public dispose(): void { }

    // ===

    static emitters: IEventEmitter[] = [];

    static startCreatingComponent(eventEmitter: IEventEmitter) {
        ComponentModule.emitters.push((ComponentModule.prototype as any)._eventEmitter);

        (ComponentModule.prototype as any)._eventEmitter = eventEmitter;
    }

    static endCreatingComponent() {
        const eventEmitter = ComponentModule.emitters.pop();
    
        (ComponentModule.prototype as any)._eventEmitter = eventEmitter;
    }
}
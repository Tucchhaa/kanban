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
}
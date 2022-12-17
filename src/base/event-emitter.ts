import { Dictionary } from "../types";
import { IDisposable } from "./idisposable";

export interface IEventEmitter {
    on(event: string, listener: CallableFunction): IEventEmitter;

    onAny(listener: CallableFunction): IEventEmitter;

    onMany(events: string[], listener: CallableFunction): IEventEmitter;

    emit(event: string, ...param: any): void;
}

// ===

export class EventEmitter implements IEventEmitter, IDisposable {
    private events: Dictionary<CallableFunction[]>;
    private onAnyListeners: CallableFunction[];

    constructor() {
        this.events = {};
        this.onAnyListeners = [];
    }
    
    public on(event: string, listener: CallableFunction): EventEmitter {
        if(!this.events[event])
            this.events[event] = [];

        this.events[event].push(listener);

        return this;
    }

    public onAny(listener: CallableFunction) {
        this.onAnyListeners.push(listener);

        return this;
    }

    public onMany(events: string[], listener: CallableFunction): EventEmitter {
        for(const event of events) {

            if(!this.events[event])
                this.events[event] = [];

            this.events[event].push(listener);
            
        }

        return this;
    }

    public emit(event: string, ...param: any) {
        for(const listener of (this.events[event] ?? [])) {
            listener(...param);
        }

        for(const listener of this.onAnyListeners) {
            listener(event, ...param);
        }
    }

    public dispose(): void { }
}
import { Dictionary } from "../types";
import { IDisposable } from "./idisposable";

export interface IEventEmitter {
    on(event: string, listener: CallableFunction): IEventEmitter;

    onMany(events: string[], listener: CallableFunction): IEventEmitter;

    emit(event: string, ...param: any): void;
}

// ===

export class EventEmitter implements IEventEmitter, IDisposable {
    private events: Dictionary<CallableFunction[]>;

    constructor() {
        this.events = {};
    }
    
    public on(event: string, listener: CallableFunction): EventEmitter {
        if(!this.events[event])
            this.events[event] = [];

        this.events[event].push(listener);

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
        for(const listener of (this.events[event] || [])) {
            listener(...param);
        }
    }

    public dispose(): void { }
}
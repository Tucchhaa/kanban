import { Dictionary } from "../types";
import { IClearable } from "./idisposable";

export interface IEventEmitter {
    on(event: string, listener: CallableFunction): IEventEmitter;

    once(event: string, listener: CallableFunction): IEventEmitter;

    onAny(listener: CallableFunction): IEventEmitter;

    onMany(events: string[], listener: CallableFunction): IEventEmitter;

    unsubscribe(event: string, listener: CallableFunction): IEventEmitter;

    emit(event: string, ...param: any): void;
}

// ===

export class EventEmitter implements IEventEmitter, IClearable {
    private events: Dictionary<CallableFunction[]>;
    private onAnyListeners: CallableFunction[];
    private onceListeners: Dictionary<CallableFunction[]>;

    constructor() {
        this.events = {};
        this.onAnyListeners = [];
        this.onceListeners = {};
    }
    
    public on(event: string, listener: CallableFunction): EventEmitter {
        if(!this.events[event])
            this.events[event] = [];

        this.events[event].push(listener);

        return this;
    }

    public once(event: string, listener: CallableFunction): EventEmitter {
        if(!this.events[event])
            this.events[event] = [];

        this.events[event].push(listener);

        // ===
        if(!this.onceListeners[event])
            this.onceListeners[event] = [];
        
        this.onceListeners[event].push(listener)

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

    public unsubscribe(event: string, listener: CallableFunction): IEventEmitter {
        this.events[event] = this.events[event].filter(_listener => _listener !== listener);

        return this;
    }

    public emit(event: string, ...param: any) {
        for(let i=0; i < this.onAnyListeners.length; i++) {
            const listener = this.onAnyListeners[i];
            listener(event, ...param);
        }
        
        for(let i=0; i < this.events[event]?.length; i++) {
            const listener = this.events[event][i];
            listener(...param);
        }

        // delete once listeners
        for(const onceListener of (this.onceListeners[event] ?? [])) {
            this.events[event] = this.events[event].filter(listener => listener !== onceListener);
        }
    }

    public clear(): void { }
}
import { isObject } from "../helpers";
import { EventEmitter } from "./event-emitter";

interface State {
    [id: string]: any;
}

export class BaseState<TOptions extends State> extends EventEmitter {
    protected state: TOptions;
    
    public getState() {
        return this.state;
    }

    constructor(state: TOptions, defaultState: TOptions) {
        super();

        this.state = this.updateRecusively(defaultState, state);
    }

    public update(newState: TOptions, needRender = true) {
        this.state = this.updateRecusively(Object.assign({}, this.state), newState);

        if(needRender) {
            this.emit('render');
        }
    }

    private updateRecusively(state: TOptions, newState: TOptions) {
        for(const key in newState) {
            if(!this.checkKey(state, key) || newState[key] === undefined)
                continue;
            
            if(isObject(state[key]) && isObject(newState[key]))
                (state[key] as State) = this.updateRecusively(state[key], newState[key]);
            else 
                state[key] = newState[key];
        } 

        return state;
    }

    public updateByKey(key: string, value: any, needRender = true) {
        if(!this.checkKey(this.state, key))
            return;

        (this.state[key] as State) = value;

        if(needRender) {
            this.emit('render');
        }
    }

    public get(key: string): any {
        if(this.checkKey(this.state, key)) {
            return this.state[key];
        }

        return undefined;
    }

    private checkKey(object: TOptions, key: string) {
        if(Array.isArray(object) || object.hasOwnProperty(key)) {
            return true;
        }

        console.error(`No such property: '${key}' in ${this.constructor.name}`);
        return false;
    }
}
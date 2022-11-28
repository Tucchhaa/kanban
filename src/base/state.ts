import { EventEmitter } from "./event-emitter";

interface State {
    [id: string]: any;
}

export class BaseState<T extends State> extends EventEmitter {
    protected state: T;
    
    constructor(state: T, defaultState: T) {
        super();

        this.state = this.updateRecusively(defaultState, state);

    }
    
    public update(newState: T, needRender = true) {
        this.state = this.updateRecusively(Object.assign({}, this.state), newState);

        if(needRender) {
            this.emit('render');
        }
    }

    private updateRecusively(state: T, newState: T) {
        for(const key in newState) {
            if(!this.checkKey(state, key) || newState[key] === undefined)
                continue;
            
            if(typeof(state[key]) === 'object' && typeof(newState[key]) === 'object')
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

    private checkKey(object: T, key: string) {
        if(Array.isArray(object) || object.hasOwnProperty(key)) {
            return true;
        }

        console.error(`No such property: '${key}' in ${this.constructor.name}`);
        return false;
    }
}
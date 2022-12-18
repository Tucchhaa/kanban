import { isObject } from "../helpers";
import { ComponentModule } from "./component-module";

export interface OptionsType {
    [id: string]: any;
}

interface IState<TOptions extends OptionsType> {
    getOptions(): TOptions;

    update(newState: TOptions, needRender: boolean): void;

    updateBy(func: (state: TOptions) => void, needRender: boolean): void;

    updateByKey(key: string, value: any, needRender: boolean): void;
}

export type BaseStateType = BaseState<OptionsType>;

export class BaseState<TOptions extends OptionsType> extends ComponentModule {
    protected state: TOptions;

    constructor(state: TOptions, defaultState: TOptions) {
        super();

        this.state = this.updateRecusively(defaultState, state);
    }

    public update(newState: TOptions, needRender = true) {
        this.state = this.updateRecusively(Object.assign({}, this.state), newState);

        if(needRender) {
            this.eventEmitter.emit('render');
        }
    }

    private updateRecusively(state: TOptions, newState: TOptions) {
        for(const key in newState) {
            if(!this.checkKey(state, key) || newState[key] === undefined)
                continue;
            
            if(isObject(state[key]) && isObject(newState[key]))
                (state[key] as OptionsType) = this.updateRecusively(state[key], newState[key]);
            else 
                state[key] = newState[key];
        } 

        return state;
    }

    public updateByKey(key: string, value: any, needRender = true) {
        if(!this.checkKey(this.state, key))
            return;

        (this.state[key] as OptionsType) = value;

        if(needRender) {
            this.eventEmitter.emit('render');
        }
    }

    public updateBy(func: (state: TOptions) => void, needRender = true) {
        func(this.state);
        
        if(needRender) {
            this.eventEmitter.emit('render');
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
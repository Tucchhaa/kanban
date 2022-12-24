import { isObject } from "../helpers";
import { ComponentModule } from "./component-module";

export interface OptionsType {
    [id: string]: any;
}

export interface IState<TOptions extends OptionsType> {
    getOptions(): TOptions;

    update(newOptions: TOptions, needRender: boolean): void;

    updateBy(func: (options: TOptions) => void, needRender: boolean): void;

    updateByKey(key: string, value: any, needRender: boolean): void;
}

export type BaseStateType = BaseState<OptionsType>;

export class BaseState<TOptions extends OptionsType> extends ComponentModule {
    protected options: TOptions;

    constructor(options: TOptions, defaultOptions: TOptions) {
        super();

        this.options = this.updateRecusively(defaultOptions, options);
    }

    public update(newOptions: TOptions, needRender = true) {
        this.options = this.updateRecusively(Object.assign({}, this.options), newOptions);

        if(needRender) {
            this.eventEmitter.emit('render');
        }
    }

    private updateRecusively(options: TOptions, newOptions: TOptions) {
        for(const key in newOptions) {
            if(!this.checkKey(options, key) || newOptions[key] === undefined)
                continue;
            
            if(isObject(options[key]) && isObject(newOptions[key]))
                (options[key] as OptionsType) = this.updateRecusively(options[key], newOptions[key]);
            else 
                options[key] = newOptions[key];
        } 

        return options;
    }

    public updateByKey(key: string, value: any, needRender = true) {
        if(!this.checkKey(this.options, key))
            return;

        (this.options[key] as OptionsType) = value;

        if(needRender) {
            this.eventEmitter.emit('render');
        }
    }

    public updateBy(func: (options: TOptions) => void, needRender = true) {
        func(this.options);
        
        if(needRender) {
            this.eventEmitter.emit('render');
        }
    }

    public get(key: string): any {
        if(this.checkKey(this.options, key)) {
            return this.options[key];
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
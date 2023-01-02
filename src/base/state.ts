import { isArray, isObject } from "../helpers";
import { ComponentModule } from "./component-module";

export interface OptionsType {
    [id: string]: any;
}

export type BaseStateType = IState<OptionsType>;

export type StateChange = {
    name: string;
    previousValue: any;
    value: any;
}

export interface IState<TOptions extends OptionsType> {
    getOptions(): TOptions;

    update(updatedOptions: TOptions): void;

    updateBy(func: (options: TOptions) => void): void;

    updateByKey(key: string, value: any): void;
}


export class NewState<TOptions extends OptionsType> extends ComponentModule implements IState<TOptions> {
    protected options: TOptions;

    private changes: StateChange[] = [];

    constructor(defaultOptions: TOptions, options: TOptions) {
        super();

        this.options = defaultOptions;
        this.updateRecursively(defaultOptions, options);
        this.changes = [];
    }

    public getOptions(): TOptions {
        return this.options;
    }

    public update(updatedOptions: TOptions) {
        this.changes = [];

        this.updateRecursively(this.options, updatedOptions);

        this.callStateChanged(this.changes);
    }

    public updateByKey(key: string, value: any): void {
        const path = key.split('.');

        if(!path.length)
            throw new Error(`Invalid argument: key - ${key}`);

        const updatedOptions = this.createUpdatedOptionsByPath(path, value);

        this.update(updatedOptions as TOptions);
    }

    public updateBy(func: (options: TOptions) => void): void {
        throw new Error('not implemented');
    }

    // ===

    private callStateChanged(changes: StateChange[]) {

    }

    private updateRecursively(options: TOptions, updatedOptions: TOptions, path: string = "") {
        if(isArray(options)) {
            this.changes.push({
                name: path,
                previousValue: options.map((item: any) => Object.assign({}, item)),
                value: updatedOptions.map((item: any) => Object.assign({}, item))
            });

            options = updatedOptions;
        }
        else if(isObject(options)) {
            for(const key in updatedOptions) {
                if(!options.hasOwnProperty(key))
                    throw new Error(`No such property: '${key}' in ${this.constructor.name}`);
    
                const fullName = `${path}.${key}`;
                const newValue = updatedOptions[key];

                if(isObject(options[key]))
                    this.updateRecursively(options[key], updatedOptions[key], fullName);
                else {
                    this.changes.push({
                        name: fullName,
                        previousValue: options[key],
                        value: newValue
                    });

                    options[key] = newValue;
                }
            }
        }
    }

    private createUpdatedOptionsByPath(path: string[], value: string): object {
        const key = path.shift()!;

        return path.length === 0 ?
            { [key]: value } :
            { [key]: this.createUpdatedOptionsByPath(path, value) };
    }
}

export class BaseState<TOptions extends OptionsType> extends ComponentModule implements IState<TOptions> {
    protected options: TOptions;

    constructor(options: TOptions, defaultOptions: TOptions) {
        super();

        this.options = this.updateRecusively(defaultOptions, options);
    }

    public getOptions(): TOptions {
        return this.options;
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
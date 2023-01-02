import { clone, isArray, isDeepEqual, isObject } from "../helpers";
import { ComponentModule } from "./component-module";

export interface OptionsType {
    [id: string]: any;
}

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

export type BaseStateType = IState<OptionsType>;

export class BaseState<TOptions extends OptionsType> extends ComponentModule implements IState<TOptions> {
    protected options: TOptions;

    private changes: StateChange[];

    private subscribedControllers: any[];

    constructor(defaultOptions: TOptions, options: TOptions, subscribedControllers: any[] = []) {
        super();

        this.options = clone(Object.assign({}, defaultOptions, options));

        this.changes = [];

        this.subscribedControllers = subscribedControllers;
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
        const updatedOptions = clone(this.options);

        func(updatedOptions);
        
        this.update(updatedOptions);
    }

    // ===

    private callStateChanged(changes: StateChange[]) {
        for(const change of changes) {
            for(const controller of this.subscribedControllers) {
                this.getRequiredController(controller.name).stateChanged(change);
            }
        }
    }

    private updateRecursively(options: TOptions, updatedOptions: TOptions, path: string = "") {
        if(isArray(options)) {
            if(!isDeepEqual(options, updatedOptions)) {
                const newValue = clone(updatedOptions);

                this.changes.push({
                    name: path,
                    previousValue: clone(options),
                    value: newValue
                });
    
                options.splice(0, options.length, ...newValue);
            }
        }
        else if(isObject(options)) {
            for(const key in updatedOptions) {
                if(!options.hasOwnProperty(key))
                    throw new Error(`No such property: '${key}' in ${this.constructor.name}`);
    
                const currentValue = options[key];
                const newValue = updatedOptions[key];
                const fullName = path ? `${path}.${key}` : key;

                if(isObject(currentValue))
                    this.updateRecursively(currentValue, newValue, fullName);

                else if(currentValue !== newValue) {
                    this.changes.push({
                        name: fullName,
                        previousValue: currentValue,
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
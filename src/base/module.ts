import { Dictionary } from "../types";

export class Module {
    private controllers: Dictionary<object | undefined> = {};

    registerController(name: string, controller: object) {
        if(this.controllers[name])
            throw new Error(`Controller with ${name} is already registered`);

        this.controllers[name] = controller;
    }

    getController(name: string) {
        return this.controllers[name];
    }

    getRequiredController(name: string) {
        return this.controllers[name]!;
    }
}

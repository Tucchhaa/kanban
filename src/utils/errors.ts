export class UndefinedViewPropertyError extends Error {
    constructor(moduleName: string, componentName: string, propertyName: string) {
        super(`${moduleName}: view of ${componentName} component does not have \'${propertyName}\' property`);
    }
} 
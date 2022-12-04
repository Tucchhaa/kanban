export const isDefined = (x: any) => x !== null && x !== undefined;

export const isUndefined = (x: any) => x === undefined;

export const noop = () => {};

export const processClasses = (classes?: string[] | string) => {
    if(classes) {
        return typeof(classes) === 'string' ? [classes] : classes;
    }

    return [];
}
import { ClassList } from "./types";

export const noop = () => {};

export const processClasses = (classes: ClassList) => {
    if(classes) {
        return typeof(classes) === 'string' ? [classes] : classes;
    }

    return [];
}

export const concatClasses = (classes1: ClassList, classes2: ClassList) => {
    return [...processClasses(classes1), ...processClasses(classes2)];
}

export const isObject = (object: any) => object !== null && typeof(object) === 'object';

export const isArray = (object: any) => Array.isArray(object);

export const isDeepEqual = (a: any, b: any) => {
    if(typeof(a) !== typeof(b) || isArray(a) !== isArray(b))
        return false;

    else if(isObject(a)) {
        const keys1 = Object.keys(a);
        const keys2 = Object.keys(b);

        if (keys1.length !== keys2.length) return false;

        for (let key of keys1) {
            const value1 = a[key];
            const value2 = b[key];

            if (!isDeepEqual(value1, value2))
                return false;

        }
        return true;
    }
    
    return a === b;
};

export const clone = (value: any) => {
    if(isArray(value)) {
        return value.map((item: any) => clone(item));
    }
    else if(isObject(value)) {
        const result = {};

        for(const key in value)
            (result as any)[key] = clone(value[key]);

        return result;
    }
    else {
        return value;
    }
};

export const generateID = (prefix: string = "") => {
    return prefix + `__id${Math.floor(Math.random() * Date.now())}`;
}

export const focusEndOfContenteditable = (contentEditableElement: HTMLElement) => {
    let range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);
    
    let selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
}

export const trim = (value: string) => value.trim().replace(/\s\s+/g, ' ');
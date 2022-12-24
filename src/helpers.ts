export const isDefined = (x: any) => x !== null && x !== undefined;

export const isUndefined = (x: any) => x === undefined;

export const noop = () => {};

export const processClasses = (classes?: string[] | string) => {
    if(classes) {
        return typeof(classes) === 'string' ? [classes] : classes;
    }

    return [];
}

export const concatClasses = (classes1?: string[] | string, classes2?: string[] | string) => {
    return [...processClasses(classes1), ...processClasses(classes2)];
}

export const isObject = (object: any) => object !== null && typeof(object) === 'object';

export const isDeepEqual = (object1: any, object2: any) => {
    const objKeys1 = Object.keys(object1);
    const objKeys2 = Object.keys(object2);

    if (objKeys1.length !== objKeys2.length) return false;

    for (let key of objKeys1) {
        const value1 = object1[key];
        const value2 = object2[key];

        const isObjects = isObject(value1) && isObject(value2);

        if (
            (isObjects && !isDeepEqual(value1, value2)) ||
            (!isObjects && value1 !== value2)
        )
            return false;

    }
    return true;
};

export const generateID = (prefix: string = "") => {
    return prefix + `__id${Math.floor(Math.random() * Date.now())}`;
}

export const setEndOfContenteditable = (contentEditableElement: HTMLElement) => {
    let range = document.createRange();//Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    
    let selection = window.getSelection()!;//get the selection object (allows you to change selection)
    selection.removeAllRanges();//remove any selections already made
    selection.addRange(range);//make the range you have just created the visible selection
}
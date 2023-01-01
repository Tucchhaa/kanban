function createIcon(name: string) {
    const element = document.createElement('i');
    
    element.classList.add('fa');
    element.classList.add(`fa-${name}`);
    element.setAttribute('aria-hidden', 'true');

    return element;
}

export class Icon {
    static get pencil() {
        return createIcon('pencil')
    }

    static get check() {
        return createIcon('check');
    }

    static get cross() {
        return createIcon('times');
    }

    static get delete() {
        return createIcon('trash');
    }
}
export class SmoothScrollOptions {
    public y?: number = 0;
    public x?: number = 0;

    public speedX?: number = 0;
    public speedY?: number = 0;

    public time?: number = 0;
};

class SmoothScroll {
    public clear?: () => void
}

const scrollingElements: Map<HTMLElement, SmoothScroll> = new Map<HTMLElement, SmoothScroll>();

export const smoothScroll = (element: HTMLElement, options: SmoothScrollOptions, callback?: () => void) => {
    const tick = 10;

    // ===
    const { x, y, speedX, speedY, time } = options as { y: number, x: number, speedY: number, speedX: number, time: number };

    const scrollInterval = setInterval(() => {
        const top  = speedY ? speedY : y / time * tick;
        const left = speedX ? speedY : x / time * tick;

        const beforeScrollTop = element.scrollTop;
        const beforeScrollLeft = element.scrollLeft;

        element.scrollBy({ top, left });

        const scrolled = beforeScrollTop !== element.scrollTop || beforeScrollLeft !== element.scrollLeft;

        !scrolled && scrollingElements.get(element)?.clear?.call(this);
    }, tick);

    const _clearTimeout = setTimeout(() => {
        clearInterval(scrollInterval);
    }, time);

    // ===

    let { clear } = scrollingElements.get(element) || {};

    clear && clear();

    clear = () => {
        clearInterval(scrollInterval);
        clearTimeout(_clearTimeout);

        callback && callback();
    }

    scrollingElements.set(element, { clear });

    return clear;
}
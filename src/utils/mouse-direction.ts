export class Mouse { 
    private _horizontal?: 'left' | 'right';
    public get horizontal() {
        return this._horizontal!;
    }
    
    private _vertical?: 'up' | 'down'; 
    public get vertical() {
        return this._vertical!;
    }

    private oldX: number = 0;
    private oldY: number = 0;

    public setPosition(e: MouseEvent) {
        this.calculateDirection(e);

        this.oldX = e.clientX;
        this.oldY = e.clientY; 
    }

    public getPosition() {
        return {x: this.oldX, y: this.oldY };
    }

    public calculateDirection(e: MouseEvent) {
        if(this.oldX !== e.clientX)
            this._horizontal = this.oldX > e.clientX ? 'left' : 'right';

        if(this.oldY !== e.clientY)
            this._vertical = this.oldY > e.clientY ? 'up' : 'down';
    }

    public isInsideElement(element: HTMLElement) {
        const mousePosition = this.getPosition();
        const elementPosition = element instanceof DOMRect ? element : element.getBoundingClientRect();
    
        return (
            mousePosition.x >= elementPosition.x  && mousePosition.x <= elementPosition.x + elementPosition.width &&
            mousePosition.y >= elementPosition.y  && mousePosition.y <= elementPosition.y + elementPosition.height 
        );
    }
}; 

export const mouse = new Mouse();
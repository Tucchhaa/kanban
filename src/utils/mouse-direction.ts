export class MouseDirection { 
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

    public setMousePosition(e: MouseEvent) {
        this.oldX = e.clientX;
        this.oldY = e.clientY; 
    }

    public calculateMouseDirection(e: MouseEvent) {
        if(this.oldX !== e.clientX)
            this._horizontal = this.oldX > e.clientX ? 'left' : 'right';

        if(this.oldY !== e.clientY)
            this._vertical = this.oldY > e.clientY ? 'up' : 'down';

        this.setMousePosition(e);
    }
}; 
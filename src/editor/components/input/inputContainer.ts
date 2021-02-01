
export interface IInputContainer {
    readonly domElement: HTMLElement;
}

export class InputContainer implements IInputContainer {
    public readonly domElement: HTMLElement;
    
    constructor(el: HTMLElement) {
        this.domElement = document.createElement('div');
        el.append(this.domElement);
        this.domElement.style.position = 'relative';
        this.domElement.style.width = '100%';
        this.domElement.style.height = '100%';
    }
}

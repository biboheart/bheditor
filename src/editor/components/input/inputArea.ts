import { IInputContainer } from "./inputContainer";

export class InputArea {
    private readonly inputContainer: IInputContainer;
    public readonly domEl: HTMLElement;
    protected lineList: Line[];

    constructor(inputContainer: IInputContainer) {
        this.inputContainer = inputContainer;
        this.domEl = document.createElement('div');
        inputContainer.domElement.append(this.domEl);
        this.configurationDomStyle();
        this.lineList = [new Line(this, '初始文字')];
    }

    private configurationDomStyle() {
        this.domEl.style.minHeight = '16px';
        this.domEl.style.width = '100%';
        this.domEl.style.position = 'relative';
    }

    public insert(text: string) {
        const line: Line = this.lineList[0];
        line.insert(text);
    }
}

export class Line {
    private readonly domEl: HTMLElement;
    private readonly inputArea: InputArea;
    protected text: string;
    
    constructor(inputArea: InputArea, text: string) {
        this.inputArea = inputArea;
        this.domEl = document.createElement('div');
        this.domEl.style.width = '100%';
        this.text = text;
        this.inputArea.domEl.append(this.domEl);
        this.insert(text);
    }

    public insert(text: string) {
        let original = this.domEl.innerHTML;
        text = original + text;
        this.domEl.innerHTML = text;
    }
}

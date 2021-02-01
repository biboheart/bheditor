import { IInputContainer } from "./inputContainer";

export class InputReceiver {
    private readonly textArea: HTMLTextAreaElement;
    private readonly inputReceiverWrap: InputReceiverWrap;
    
    constructor(inputContainer: IInputContainer) {
        this.inputReceiverWrap = new InputReceiverWrap(inputContainer);
        this.textArea = document.createElement('textarea');
        this.inputReceiverWrap.domElement.append(this.textArea);
        this.configurationTextAreaStyle();
    }

    private configurationTextAreaStyle() {}
}

export class InputReceiverWrap {
    private readonly inputContainer: IInputContainer;
    public readonly domElement: HTMLElement;

    constructor(inputContainer: IInputContainer) {
        this.inputContainer = inputContainer;
        this.domElement = document.createElement('div');
        this.make();
    }

    private make() {
        this.domElement.style.width = '100%';
        this.domElement.style.position = 'absolute';
        this.domElement.style.top = '200px';
        this.inputContainer.domElement.append(this.domElement);
    }
}

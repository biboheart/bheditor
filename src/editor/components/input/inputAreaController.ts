import { InputArea } from "./inputArea";
import { IInputContainer, InputContainer } from "./inputContainer";
import { InputReceiver } from "./inputReceiver";

export class InputAreaController {
    private readonly inputContainer: IInputContainer;
    private readonly inputReceiver: InputReceiver;
    private readonly inputArea: InputArea;
    
    constructor(container: HTMLElement) {
        this.inputContainer = new InputContainer(container);
        this.inputArea = new InputArea(this.inputContainer);
        this.inputReceiver = new InputReceiver(this.inputContainer);
    }
}

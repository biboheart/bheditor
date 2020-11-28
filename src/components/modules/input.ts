import $ from '../../utils/dom';
import Module from "../module";

// 输入组件
export default class Input extends Module {
    private composing: {
        data: string,
        done: boolean
    }|null = null;
    private readDOMTimeout: NodeJS.Timeout|null = null;

    public nodes: { [key: string]: HTMLElement } = {
        input: $.make('div', 'eeditor-hidden-input', 'left: 0; top: 0;', {
            spellcheck: false,
            tabIndex: '-1',
            contentEditable: true
        }),
    }

    public position(rect: DOMRect) {
        this.nodes.input.style.left = rect.left + 'px';
        this.nodes.input.style.top = rect.top + 'px';
    }

    public async prepare(): Promise<void> {
        await this.make();
        this.bindEvents();
    }

    private async make(): Promise<void> {
        $.append(this.editorModules.Layout.nodes.inputWrap, this.nodes.input);
    }

    public focus(): void {
        if (document.activeElement !== this.nodes.input) {
            this.nodes.input?.focus();
        }
    }

    public blur() {
        this.nodes.input.blur();
    }

    private bindEvents(): void {
        this.editorModules.Listeners.on(
            this.nodes.input,
            'paste',
            (event) => this.pasteHandler(event as ClipboardEvent),
            false
        )
        this.editorModules.Listeners.on(
            this.nodes.input,
            'input',
            (event) => this.inputHandler(event as InputEvent),
            false
        )
        this.editorModules.Listeners.on(
            this.nodes.input,
            'compositionstart',
            (event) => this.compositionStart(event as CompositionEvent),
            false
        )
        this.editorModules.Listeners.on(
            this.nodes.input,
            'compositionupdate',
            (event) => this.compositionUpdate(event as CompositionEvent),
            false
        )
        this.editorModules.Listeners.on(
            this.nodes.input,
            'compositionend',
            (event) => this.compositionEnd(event as CompositionEvent),
            false
        )
        /* this.editorModules.Listeners.on(
            this.nodes.input,
            'keydown',
            (event) => this.keydownHandler(event),
            false
        ) */
    }

    /* private keydownHandler(event: any) {
        const code = event.code;
        console.log(code);
    } */

    private compositionStart(event: CompositionEvent) {
        this.composing = {data: event.data, done: false}
    }

    private compositionUpdate(event: CompositionEvent) {
        if (!this.composing) this.composing = {data: event.data, done: false}
    }

    private compositionEnd(event: CompositionEvent) {
        if (this.composing !== null) {
            if (event.data !== this.composing.data) this.readFromDOMSoon(event)
            this.composing.done = true
        }
    }

    private inputHandler(event: InputEvent) {
        if (event.inputType === 'insertFromPaste') {
            return;
        }
        if (!this.composing) this.readFromDOMSoon(event)
    }

    private pasteHandler(event: ClipboardEvent) {
        const paste = event.clipboardData!.getData('text');
        if (paste) {
            this.editorModules.PageManager.current.insert(paste);
            this.nodes.input.innerText = '';
        }
        event.preventDefault();
    }

    private readFromDOMSoon(event: InputEvent|CompositionEvent) {
        if (this.readDOMTimeout != null) return
        this.readDOMTimeout = setTimeout(() => {
            this.readDOMTimeout = null
            if (this.composing) {
                if (this.composing.done) this.composing = null
                else return
            }
            if (event.data) {
                this.editorModules.PageManager.current.insert(event.data as string);
            }
            this.nodes.input.innerText = '';
        }, 80)
    }
}
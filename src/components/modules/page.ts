import { EditorModules } from '../../types/editor-modules';
import { ModuleConfig } from '../../types/module-config';
import $ from '../../utils/dom';
import Module from '../module';
import PageManager from '../page-manager';
import { Paragraph } from './paragraph';
import SelectionUtils from '../../utils/selection';

// 一页
export default class Page extends Module {
    private pm: PageManager;
    private paragraphs: Paragraph[] = [];
    private currentParagraph: Paragraph|null = null;
    public nodes: { [key: string]: HTMLElement } = {
        wrapper: $.make('div', ['eeditor-page-wrapper'], 'width: 100%; height: 1122.53px; margin: 0 auto;'),
        iframe: $.make('iframe', 'eeditor-page-iframe', 'border:0 none; width:100%; height:100%; margin: 0; padding: 0;'),
        content: $.make('div', 'eeditor-page-content', 'width: 100%; height: 100%;'),
    }

    constructor({ config }: ModuleConfig, pageManager: PageManager) {
        super({ config });
        this.pm = pageManager;
        this.configureModules();
        this.nodes.iframe.onload = () => {
            this.pageReady();
            this.bindEvents();
        };
    }

    public setCurrent(index: number) {
        if (index > this.paragraphs.length) {
            index = this.paragraphs.length - 1;
        }
        if (index < 0) {
            this.currentParagraph = null;
        } else {
            this.currentParagraph = this.paragraphs[index]
        }
    }

    public getCurrent(): Paragraph {
        if (this.currentParagraph === null) {
            this.currentParagraph = this.paragraphs[this.paragraphs.length - 1];
        }
        return this.currentParagraph;
    }

    private configureModules(): void {
        // this.state = _.cloneDeep(this.pm.state);
        const diff: EditorModules = {} as EditorModules;
        // tslint:disable-next-line: forin
        for (const moduleName in this.pm.state) {
            (diff as any)[moduleName] = (this.pm.state as any)[moduleName];
        }
        this.state = diff;
    }

    public async prepare(): Promise<void> {
        await this.make();
        this.init();
    }

    public paragraphIndex(paragraph: Paragraph): number {
        for (let i = 0; i < this.paragraphs.length; i ++) {
            if (this.paragraphs[i] === paragraph) {
                return i;
            }
        }
        return -1;
    }

    public insert(str: string) {
        if (this.currentParagraph === null) return;
        let text = this.currentParagraph.text;
        const pos = this.editorModules.Caret.coord;
        const index = pos.sticky === 'after' ? pos.ch + 1 : pos.ch;
        text = text.substring(0, index) + str + text.substring(index);
        pos.ch += str.length;
        this.currentParagraph.text = text;
        this.editorModules.Caret.coord = pos;
        this.startInput();
    }

    public startInput() {
        this.location();
        this.editorModules.Input.blur();
        this.editorModules.Input.focus();
    }

    // 定位
    private location() {
        const pos = this.editorModules.Caret.coord;
        if (pos.paragraphIndex < 0) {
            if (this.currentParagraph === null) {
                pos.paragraphIndex = this.paragraphs.length - 1;
            } else {
                pos.paragraphIndex = this.paragraphIndex(this.currentParagraph);
            }
        }
        this.setCurrent(pos.paragraphIndex);
        const current = this.getCurrent();
        if (current.charLength() > 0 && pos.ch >= current.charLength()) {
            pos.ch = current.charLength() - 1;
            pos.sticky = 'after';
        }
        this.editorModules.Caret.coord = pos;
    }

    private init(): void {
        if (this.paragraphs.length === 0) {
            this.paragraphs.push(new Paragraph({
                config: this.config
            }, this.pm, {
                index: 0,
                // TODO 暂时只做单页，先恒0
                pageIndex: 0,
            }));
        }
    }

    private async make(): Promise<void> {
        $.append(this.nodes.wrapper, this.nodes.iframe);
        $.append(this.pm.nodes.wrapper, this.nodes.wrapper);
    }

    private pageReady(): void {
        const body = (this.nodes.iframe as HTMLIFrameElement).contentWindow?.document.body;
        if (body) {
            $.setStyle(body, 'width:100%; height:100%; margin: 0; padding: 0;');
            $.append(body, this.nodes.content);
        }
    }

    private bindEvents(): void {
        this.editorModules.Listeners.on(
            this.nodes.content,
            'click',
            (event) => this.clicked(event as MouseEvent),
            false
        )
    }

    private clicked(event: MouseEvent) {
        const range = SelectionUtils.getRange((this.nodes.iframe as HTMLIFrameElement).contentWindow!);
        const offset: number = range?.startOffset as number;
        this.editorModules.Caret.coord = {
            paragraphIndex: 0,
            ch: offset - 1,
            sticky: 'after'
        };
        this.startInput();
        event.stopImmediatePropagation();
        event.stopPropagation();
    }
}
import { EditorModules } from '../../types/editor-modules';
import { ModuleConfig } from '../../types/module-config';
import { ParagraphConfig } from '../../types/paragraph-config';
import $ from '../../utils/dom';
import SelectionUtils from '../../utils/selection';
import Module from '../module';
import PageManager from '../page-manager';
import { Paragraph } from './paragraph';

// 一页
export default class Page extends Module {
    private pm: PageManager;
    private paragraphList: Paragraph[];
    private ready: boolean;

    public nodes: { [key: string]: HTMLElement } = {
        wrapper: $.make('div', ['editor-page-wrapper'], 'width: 100%; height: 1122.53px; margin: 0 auto;'),
        iframe: $.make('iframe', 'editor-page-iframe', 'border:0 none; width:100%; height:100%; margin: 0; padding: 0;'),
        content: $.make('div', 'editor-page-content', 'width: 100%; height: 100%;'),
    }

    constructor({ config }: ModuleConfig, pageManager: PageManager) {
        super({ config });
        this.ready = false;
        this.pm = pageManager;
        this.paragraphList = [];
        this.configureModules();
        this.nodes.iframe.onload = () => {
            this.pageReady();
            this.bindEvents();
            this.addParagraph({
                top: 100,
                left: 100
            });
        };
    }

    public addParagraph(paragraphConfig: ParagraphConfig): void {
        if (!this.ready) {
            return
        }
        const paragraph = new Paragraph({
            config: this.config
        }, this, paragraphConfig);
        this.paragraphList.push(paragraph);
    }

    private configureModules(): void {
        const diff: EditorModules = {} as EditorModules;
        // tslint:disable-next-line: forin
        for (const moduleName in this.pm.state) {
            (diff as any)[moduleName] = (this.pm.state as any)[moduleName];
        }
        this.state = diff;
    }

    public async prepare(): Promise<void> {
        await this.make();
    }

    private async make(): Promise<void> {
        $.append(this.nodes.wrapper, this.nodes.iframe);
        $.append(this.pm.nodes.wrapper, this.nodes.wrapper);
    }

    private pageReady(): void {
        this.ready = true;
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
        console.log(offset);
        /* this.editorModules.Caret.coord = {
            paragraphIndex: 0,
            ch: offset - 1,
            sticky: 'after'
        };
        this.startInput(); */
        event.stopImmediatePropagation();
        event.stopPropagation();
    }

    public get state(): EditorModules {
        return this.editorModules;
    }

    public set state(editor: EditorModules) {
        this.editorModules = editor;
    }
}

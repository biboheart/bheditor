import Module from "../module";
import { EditorModules } from '../../types/editor-modules';
import { ModuleConfig } from '../../types/module-config';
import PageManager from '../page-manager';
import $ from '../../utils/dom';
import { ParagraphConfig } from "../../types/paragraph-config";
import Page from "./page";
import { Pos } from "../../types/pos";
// import SelectionUtils from '../../utils/selection';

export class Paragraph extends Module {
    protected pm: PageManager;
    protected page: Page;
    protected indexOfPage: number = 0;
    protected content: string = '';
    protected pos: Pos;

    protected paragraphConfig: ParagraphConfig;

    public nodes: { [key: string]: HTMLElement } = {
        wrapper: $.make('div', ['eeditor-paragraph'], 'min-height: 16px;')
    }

    constructor({ config }: ModuleConfig, pageManager: PageManager, paragraphConfig: ParagraphConfig) {
        super({ config });
        this.pm = pageManager;
        this.paragraphConfig = paragraphConfig;
        this.page = this.pm.getPage(this.paragraphConfig.pageIndex);
        this.indexOfPage = this.paragraphConfig.index;
        this.pos = {
            paragraphIndex: this.indexOfPage,
            ch: 0,
            sticky: 'after'
        }
        this.configureModules();
        this.make();
    }

    public set index(i: number) {
        this.pos.paragraphIndex = i;
        this.indexOfPage = i;
    }

    public charLength(): number {
        return this.content.length;
    }

    public set text(chars: string) {
        this.content = chars;
        this.nodes.wrapper.innerHTML = chars;
    }

    public get text(): string {
        this.content = this.nodes.wrapper.innerHTML;
        return this.content;
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

    private make(): void {
        $.append(this.page.nodes.content, this.nodes.wrapper);
        // this.bindEvents();
    }

    /* private bindEvents(): void {
        this.editorModules.Listeners.on(
            this.nodes.wrapper,
            'click',
            (event) => this.clicked(event as MouseEvent),
            false
        )
    } */

    private clicked(event: MouseEvent) {
        /* console.log('click paragraph');
        console.log(event); */
        const sel = (this.page.nodes.iframe as HTMLIFrameElement).contentWindow?.document.getSelection();
        console.log(sel);
        /* const rect = SelectionUtils.rect;
        console.log(rect); */
        /* this.editorModules.Caret.coord = {
            paragraphIndex: this.pos.paragraphIndex,
            ch: this.pos.ch,
            sticky: this.pos.sticky
        }
        this.page.startInput(); */
        event.stopImmediatePropagation();
        event.stopPropagation();
    }
}
import Module from "../module";
import { EditorModules } from '../../types/editor-modules';
import { Item } from './item';
import Page from "./page";
import $ from '../../utils/dom';
import { ModuleConfig } from '../../types/module-config';
import { Pos } from '../../types/pos';
import {Chunk} from './chunk';
import SelectionUtils from '../../utils/selection';

// 段落
export class Paragraph extends Module {
    protected item: Item;
    protected page: Page;
    protected chunk: Chunk;

    public nodes: { [key: string]: HTMLElement } = {
        el: $.make('div', ['editor-paragraph'], 'width: 100%;')
    }

    constructor({ config }: ModuleConfig, item: Item, page: Page) {
        super({ config });
        this.item = item;
        this.page = page;
        this.chunk = new Chunk({
            content: '',
            placeholder: '请输入内容'
        });
        this.configureModules();
        this.make();
    }

    public insert(str: string, index: number|null, focus: boolean) {
        console.log('insert str:' + str);
        if (!this.chunk) {
            return;
        }
        let text = this.chunk.content;
        const pos: Pos = this.chunk.pos;
        if (!index) {
            index = pos.sticky === 'after' ? pos.ch + 1 : pos.ch;
        }
        text = text.substring(0, index) + str + text.substring(index);
        pos.ch += str.length;
        this.chunk.content = text;
        this.startInput();
    }

    public startInput() {
        this.editorModules.Input.blur();
        this.editorModules.Input.focus();
    }

    private configureModules(): void {
        // this.state = _.cloneDeep(this.pm.state);
        const diff: EditorModules = {} as EditorModules;
        // tslint:disable-next-line: forin
        for (const moduleName in this.item.state) {
            (diff as any)[moduleName] = (this.item.state as any)[moduleName];
        }
        this.state = diff;
    }

    private make(): void {
        $.append(this.nodes.el, this.chunk.nodes.el);
        $.append(this.item.nodes.el, this.nodes.el);
        this.bindEvents();
    }

    private bindEvents(): void {
        this.editorModules.Listeners.on(
            this.nodes.el,
            'click',
            (event) => this.clickHandler(event as MouseEvent),
            false
        )
    }

    private clickHandler(event: MouseEvent) {
        const range = SelectionUtils.getRange((this.page.nodes.iframe as HTMLIFrameElement).contentWindow!);
        let offset: number = range?.startOffset as number;
        if (this.chunk.nodes.placeholderEl === event.target) {
            offset = 0;
        }
        console.log('paragraph click:' + offset);
        this.chunk.setFocus(offset, 'after');
        this.state.Caret.coord = this.chunk.pos;
        this.page.item = this.item;
        /* event.stopImmediatePropagation();
        event.stopPropagation(); */
        this.startInput();
    }
}
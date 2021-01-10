import { EditorModules } from '../../types/editor-modules';
import { ModuleConfig } from '../../types/module-config';
import { ItemConfig } from '../../types/item-config';
import $ from '../../utils/dom';
import SelectionUtils from '../../utils/selection';
import Module from '../module';
import PageManager from '../page-manager';
import { Item } from './item';

// 一页
export default class Page extends Module {
    private pm: PageManager;
    private itemList: Item[];
    private ready: boolean;
    private focusItem: Item|null;

    public nodes: { [key: string]: HTMLElement } = {
        wrapper: $.make('div', ['editor-page-wrapper'], 'width: 100%; height: 1122.53px; margin: 0 auto;'),
        iframe: $.make('iframe', 'editor-page-iframe', 'border:0 none; width:100%; height:100%; margin: 0; padding: 0;'),
        content: $.make('div', 'editor-page-content', 'width: 100%; height: 100%; position: relative;'),
    }

    constructor({ config }: ModuleConfig, pageManager: PageManager) {
        super({ config });
        this.ready = false;
        this.pm = pageManager;
        this.itemList = [];
        this.focusItem = null;
        this.configureModules();
        this.nodes.iframe.onload = () => {
            this.pageReady();
            this.bindEvents();
            this.addItem({
                top: 100,
                left: 100
            });
        };
    }

    public addItem(itemConfig: ItemConfig): void {
        if (!this.ready) {
            return
        }
        const item = new Item({
            config: this.config
        }, this, itemConfig);
        this.itemList.push(item);
    }

    public set item(item: Item|null) {
        this.focusItem = item;
    }

    public get item(): Item|null {
        return this.focusItem;
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
        console.log('page click:' + offset);
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

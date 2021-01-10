import Module from "../module";
import { EditorModules } from '../../types/editor-modules';
import Page from "./page";
import $ from '../../utils/dom';
import { ModuleConfig } from '../../types/module-config';
import { ItemConfig } from '../../types/item-config';
import {Paragraph} from './paragraph'

// 元素块
export class Item extends Module {
    protected page: Page;
    protected itemConfig: ItemConfig;
    protected paragraph: Paragraph|null = null;

    public nodes: { [key: string]: HTMLElement } = {
        el: $.make('div', ['editor-item'], 'position: absolute; box-sizing: border-box; min-height: 16px;')
    }

    constructor({ config }: ModuleConfig, page: Page, itemConfig: ItemConfig) {
        super({ config });
        this.page = page;
        this.itemConfig = itemConfig;
        this.configureModules();
        this.make();
        this.configureContent();
    }

    public moveTo(top: number, left: number) {
        this.nodes.el.style.top = top ? (top + 'px') : '0';
        this.nodes.el.style.left = left ? (left + 'px') : '0';
    }

    public getParagraph(): Paragraph|null {
        return this.paragraph;
    }

    private configureContent(): void {
        const paragraph = new Paragraph({
            config: this.config
        }, this, this.page);
        this.paragraph = paragraph;
    }

    private configureModules(): void {
        // this.state = _.cloneDeep(this.pm.state);
        const diff: EditorModules = {} as EditorModules;
        // tslint:disable-next-line: forin
        for (const moduleName in this.page.state) {
            (diff as any)[moduleName] = (this.page.state as any)[moduleName];
        }
        this.state = diff;
    }

    private make(): void {
        this.nodes.el.style.top = this.itemConfig.top ? (this.itemConfig.top + 'px') : '0';
        this.nodes.el.style.left = this.itemConfig.left ? (this.itemConfig.left + 'px') : '0';
        $.append(this.page.nodes.content, this.nodes.el);
        // this.bindEvents();
    }
}
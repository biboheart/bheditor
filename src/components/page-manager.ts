import $ from '../utils/dom';
import Module from "./module";
import Page from './modules/page';

// 页面管理
export default class PageManager extends Module {
    private pages: Page[] = [];
    private currentPage: Page|null = null;

    public nodes: { [key: string]: HTMLElement } = {
        wrapper: $.make('div', ['eeditor-page-manager']),
    }

    public start(): void {
        const page = new Page({
            config: this.config
        }, this);
        this.pages.push(page);
        page.prepare();
        this.currentPage = page;
    }

    public getPage(index: number): Page {
        if (index >= this.pages.length) {
            index = this.pages.length - 1;
        }
        return this.pages[index]
    }

    public get current(): Page {
        if (this.currentPage === null) {
            this.currentPage = this.pages[this.pages.length - 1];
        }
        return this.currentPage;
    }

    public async prepare(): Promise<void> {
        await this.make();
    }

    private async make(): Promise<void> {
        $.append(this.editorModules.Layout.nodes.content, this.nodes.wrapper);
    }
}
import $ from '../utils/dom';
import Module from "./module";
import Page from './modules/page';

// 页面管理
export default class PageManager extends Module {
    private currentPage: Page|null = null;

    public nodes: { [key: string]: HTMLElement } = {
        wrapper: $.make('div', ['editor-page-manager']),
    }

    public start(): void {
        const page = new Page({
            config: this.config
        }, this);
        page.prepare();
        this.currentPage = page;
    }

    public get current(): Page {
        if (this.currentPage === null) {
            this.currentPage = new Page({
                config: this.config
            }, this);
            this.currentPage.prepare();
        }
        return this.currentPage;
    }

    public async prepare(): Promise<void> {
        await this.make();
    }

    private async make(): Promise<void> {
        $.append(this.editorModules.Layout.nodes.contentWrap, this.nodes.wrapper);
    }
}

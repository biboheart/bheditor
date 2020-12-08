import Module from "../module";
import { EditorModules } from '../../types/editor-modules';
import Page from "./page";
import $ from '../../utils/dom';
import { ModuleConfig } from '../../types/module-config';
import { Pos } from "../../types/pos";
import { ParagraphConfig } from "../../types/paragraph-config";

// 段落
export class Paragraph extends Module {
    protected page: Page;
    protected pos: Pos;
    protected paragraphConfig: ParagraphConfig;

    public nodes: { [key: string]: HTMLElement } = {
        wrapper: $.make('div', ['editor-paragraph'], 'position: absolute; box-sizing: border-box; min-height: 16px;')
    }

    constructor({ config }: ModuleConfig, page: Page, paragraphConfig: ParagraphConfig) {
        super({ config });
        this.page = page;
        this.pos = {
            ch: 0,
            sticky: 'after'
        }
        this.paragraphConfig = paragraphConfig;
        this.configureModules();
        this.make();
    }

    public moveTo(top: number, left: number) {
        this.nodes.wrapper.style.top = top ? (top + 'px') : '0';
        this.nodes.wrapper.style.left = left ? (left + 'px') : '0';
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
        this.nodes.wrapper.style.top = this.paragraphConfig.top ? (this.paragraphConfig.top + 'px') : '0';
        this.nodes.wrapper.style.left = this.paragraphConfig.left ? (this.paragraphConfig.left + 'px') : '0';
        $.append(this.page.nodes.content, this.nodes.wrapper);
        // this.bindEvents();
    }
}
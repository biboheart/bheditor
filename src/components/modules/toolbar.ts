import $ from '../../utils/dom';
import Module from "../module";

// 工具栏组件
export default class Toolbar extends Module {
    public nodes: { [key: string]: HTMLElement } = {
        toolbar: $.make('div', 'eeditor-toolbar'),
    }

    public async prepare(): Promise<void> {
        await this.make();
    }

    private async make(): Promise<void> {
        $.append(this.editorModules.Layout.nodes.toolbarWrap, this.nodes.toolbar);
    }
}
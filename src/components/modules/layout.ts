import $ from '../../utils/dom';
import Module from '../module';

export default class Layout extends Module {
    public nodes: { [key: string]: HTMLElement } = {
        container: $.make('div', 'editor-layout-container'), // 布局容器
        mainContainer: $.make('div', 'editor-main-container'), // 主容器
        mainWrapper: $.make('div', 'editor-main-wrapper', 'width: 809.733px; height: 1159.53px;'), // 对容器包一层，用于布局
        surface: $.make('div', 'editor-surface'), // 编辑区域
        contentWrap: $.make('div', 'editor-content-wrap', 'width: 793.733px; height: 1122.53px; padding: 0px; margin-top: 0px; margin-left: 0px; margin-right: 0px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; position: relative; box-shadow: rgba(0, 0, 0, 0.06) 0px 0px 10px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;'), // 正文包
        inputWrap: $.make('div', 'editor-input-wrap'), // 输入框包
        caretWrap: $.make('div', 'eeditor-caret-wrap'), // 光标包
    }

    public async prepare(): Promise<void> {
        await this.make();
    }

    private async make(): Promise<void> {
        const view = $.make('div', 'editor-content-view', 'opacity: 1; background: rgb(249, 250, 251) none repeat scroll 0% 0%; margin-bottom: 25px;');
        $.append(view, this.nodes.contentWrap);
        $.append(this.nodes.surface, view);
        $.append(this.nodes.surface, this.nodes.inputWrap);
        $.append(this.nodes.surface, this.nodes.caretWrap);
        const surfaceWrap = $.make('div', 'eeditor-surface-wrap', 'padding: 12px 8px 0px;');
        $.append(surfaceWrap, this.nodes.surface);
        $.append(this.nodes.mainWrapper, surfaceWrap);
        $.append(this.nodes.mainContainer, this.nodes.mainWrapper);
        $.append(this.nodes.container, this.nodes.mainContainer);
        this.nodes.holder = $.getContainer(this.config.container as string) as HTMLElement;
        $.append(this.nodes.holder, this.nodes.container);
    }
}
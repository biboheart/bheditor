import $ from '../../utils/dom';
import Module from '../module';

export default class Layout extends Module {
    public nodes: { [key: string]: HTMLElement } = {
        container: $.make('div', 'eeditor-layout-container'),
        toolbarWrap: $.make('div', 'eeditor-layout-toolbar', 'background: green;'),
        contentContainer: $.make('div', 'eeditor-content-container'),
        wrapper: $.make('div', 'eeditor-wrapper', 'width: 809.733px; height: 1159.53px;'),
        surface: $.make('div', 'eeditor-surface'),
        content: $.make('div', 'eeditor-content', 'width: 793.733px; height: 1122.53px; padding: 0px; margin-top: 0px; margin-left: 0px; margin-right: 0px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; position: relative; box-shadow: rgba(0, 0, 0, 0.06) 0px 0px 10px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;'),
        inputWrap: $.make('div', 'eeditor-hidden'),
        caretWrap: $.make('div', 'eeditor-caret'),
    }

    public async prepare(): Promise<void> {
        await this.make();
    }

    private async make(): Promise<void> {
        let view = $.make('div', 'eeditor-content-view', 'opacity: 1; background: rgb(249, 250, 251) none repeat scroll 0% 0%; margin-bottom: 25px;');
        $.append(view, this.nodes.content);
        $.append(this.nodes.surface, view);
        $.append(this.nodes.surface, this.nodes.inputWrap);
        $.append(this.nodes.surface, this.nodes.caretWrap);
        let surfaceWrap = $.make('div', 'eeditor-surface-wrap', 'padding: 12px 8px 0px;');
        $.append(surfaceWrap, this.nodes.surface);
        $.append(this.nodes.wrapper, surfaceWrap);
        $.append(this.nodes.contentContainer, this.nodes.wrapper);
        $.append(this.nodes.container, this.nodes.contentContainer);
        $.prepend(this.nodes.container, this.nodes.toolbarWrap);
        this.nodes.holder = $.getContainer(this.config.container as string) as HTMLElement;
        $.append(this.nodes.holder, this.nodes.container);
    }
}

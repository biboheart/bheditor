import { Pos } from '../../types/pos';
import $ from '../../utils/dom';
import Module from "../module";
// import SelectionUtils from '../../utils/selection';

// 光标组件
export default class Caret extends Module {
    private pos: Pos = {
        ch: 0,
        sticky: 'before'
    }
    public nodes: { [key: string]: HTMLElement } = {
        caret: $.make('div', ['editor-caret', 'editor-caret-blink'], 'position: absolute; height: 16px; left: 0px; top: 0px; opacity: 1; border-color: rgb(30, 111, 255); transform-origin: center center 0px;'),
    }

    public get coord(): Pos {
        return this.pos;
    }

    public set coord(pos: Pos) {
        this.pos = {
            ch: pos.ch,
            sticky: pos.sticky
        };
        let offset = pos.sticky === 'after' ? pos.ch + 1 : pos.ch;
        if (offset < 0) {
            offset = 0;
        }
        console.log(offset);
        /* let element: HTMLElement|Node = this.editorModules.PageManager.current.getCurrent().nodes.wrapper;
        if (element.firstChild !== null) {
            element = element.firstChild;
        }
        const rect = SelectionUtils.setCursor(element, offset);
        this.editorModules.Input.position(rect);
        this.nodes.caret.style.left = rect.left + 'px';
        this.nodes.caret.style.top = rect.top + 'px'; */
    }

    public async prepare(): Promise<void> {
        await this.make();
    }

    private async make(): Promise<void> {
        $.append(this.editorModules.Layout.nodes.caretWrap, this.nodes.caret);
    }
}
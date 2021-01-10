import $ from '../../utils/dom';
import Module from "../module";
import {Chunk} from './chunk';
import { Pos } from '../../types/pos';
import SelectionUtils from '../../utils/selection';

// 光标组件
export default class Caret extends Module {
    protected twinkled: boolean = false;
    protected pos: Pos = {
        chunk: null,
        ch: 0,
        sticky: 'after'
    };

    public nodes: { [key: string]: HTMLElement } = {
        caret: $.make('div', ['editor-caret', 'editor-caret-blink'], 'position: absolute; height: 16px; left: 0px; top: 0px; opacity: 1; border-color: rgb(30, 111, 255); transform-origin: center center 0px;'),
    }

    public get coord(): Pos {
        return this.pos;
    }

    public set coord(pos: Pos) {
        this.pos = {
            chunk: pos.chunk,
            ch: pos.ch,
            sticky: pos.sticky
        };
        if (!pos.chunk) {
            this.twinkled = false;
            this.nodes.caret.style.left = '0';
            this.nodes.caret.style.top = '0';
            this.twinkle(true);
            return;
        }
        this.twinkled = true;
        let offset = pos.sticky === 'after' ? pos.ch + 1 : pos.ch;
        if (offset < 0) {
            offset = 0;
        }
        let element: HTMLElement|Node = pos.chunk.nodes.el;
        if (element.firstChild !== null) {
            element = element.firstChild;
        }
        const rect = SelectionUtils.setCursor(element, offset);
        this.editorModules.Input.position(rect);
        this.nodes.caret.style.left = rect.left + 'px';
        this.nodes.caret.style.top = rect.top + 'px';
        this.twinkle(true);
    }

    /* public getChunk(): Chunk|null {
        return this.chunk;
    }

    public setCoord(chunk: Chunk|null, pos: Pos) {
        this.chunk = chunk;
        if (!this.chunk) {
            this.twinkled = false;
            this.nodes.caret.style.left = '0';
            this.nodes.caret.style.top = '0';
            this.twinkle(true);
            return;
        }
        this.twinkled = true;
        let offset = pos.sticky === 'after' ? pos.ch + 1 : pos.ch;
        if (offset < 0) {
            offset = 0;
        }
        let element: HTMLElement|Node = this.chunk.nodes.el;
        if (element.firstChild !== null) {
            element = element.firstChild;
        }
        const rect = SelectionUtils.setCursor(element, offset);
        console.log(rect);
        this.nodes.caret.style.left = rect.left + 'px';
        this.nodes.caret.style.top = rect.top + 'px';
        this.twinkle(true);
    } */

    private twinkle(show: boolean) {
        if (show) {
            this.nodes.caret.style.opacity = '1';
        } else {
            this.nodes.caret.style.opacity = '0';
        }
        if (!this.twinkled) {
            this.nodes.caret.style.opacity = '0';
            return;
        }
        setTimeout(() => {
            this.twinkle(!show);
        }, 500);
    }

    public async prepare(): Promise<void> {
        await this.make();
    }

    private async make(): Promise<void> {
        $.append(this.editorModules.Layout.nodes.caretWrap, this.nodes.caret);
    }
}
import $ from '../../utils/dom';
import { Pos } from '../../types/pos';
import { ChunkConfig } from '../../types/chunk-config';

// 内容块
export class Chunk {
    protected config: ChunkConfig;
    protected focus:boolean = false;

    private currentPos: Pos;

    public nodes: { [key: string]: HTMLElement } = {
        el: $.make('div', ['editor-chunk']),
        placeholderEl: $.make('p', ['chunk-placeholder'], 'color: #ddd; margin: 0;')
    }

    constructor(config: ChunkConfig) {
        this.config = config;
        this.init();
        this.currentPos = {
            chunk: this,
            ch: 0,
            sticky: 'after'
        }
        this.setPlaceholder();
    }

    private init(): void {
        this.nodes.el.innerHTML = this.content || '';
    }

    public setFocus (offset: number, sticky: string): void {
        console.log('set focus:' + offset);
        this.focus = true;
        if (!this.config.content || this.config.content.length === 0) {
            offset = 0;
            sticky = 'before';
        }
        this.pos = {
            chunk: this,
            ch: offset,
            sticky: sticky
        }
        this.setPlaceholder();
    }

    public get pos(): Pos {
        return this.currentPos;
    }

    public set pos(pos: Pos) {
        this.currentPos = pos;
    }

    public get content(): string {
        return this.config.content;
    }

    public set content(text: string) {
        this.config.content = text;
        $.append(this.nodes.el, new Text(this.config.content));
    }

    public setPlaceholder():void {
        let show = false
        if (this.content && this.content.length > 0) {
            show = false;
        } else if (this.focus) {
            show = false;
        } else if (!this.config.placeholder) {
            show = false;
        } else {
            show = true;
        }
        if (!show) {
            this.nodes.el.removeChild(this.nodes.placeholderEl);
        } else {
            this.nodes.placeholderEl.innerHTML = this.config.placeholder || '请输入';
            $.append(this.nodes.el, this.nodes.placeholderEl);
        }
    }
}

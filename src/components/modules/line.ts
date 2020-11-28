import $ from '../../utils/dom';

export class Line {
    private wrap: HTMLElement;
    private contentWrap: HTMLElement;

    constructor(parent: HTMLElement) {
        this.wrap = $.make('div', 'editor-line', 'height: 24.7867px; padding-top: 0px; padding-bottom: 0px; white-space: nowrap;');
        this.contentWrap = $.make('div', 'editor-line-content', 'position: relative; margin-left: 0px; padding-left: 0px; z-index: 15; line-height: 24.7867px; height: 24.7867px;');
        $.append(this.wrap, this.contentWrap);
        if (parent != null) {
            parent.appendChild(this.wrap);
        }
    }
}

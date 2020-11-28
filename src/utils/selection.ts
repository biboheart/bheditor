import $ from './dom';

interface TextRange {
    boundingTop: number;
    boundingLeft: number;
    boundingBottom: number;
    boundingRight: number;
    boundingHeight: number;
    boundingWidth: number;
}

interface MSSelection {
    createRange: () => TextRange;
    type: string;
}

interface Document {
    selection?: MSSelection;
}

export default class SelectionUtils {
    public static get anchorElement(): Element | null {
        const selection = window.getSelection();
        if (!selection) {
            return null;
        }
        const anchorNode = selection.anchorNode;
        if (!anchorNode) {
            return null;
        }
        if (!$.isElement(anchorNode)) {
            return anchorNode.parentElement;
        } else {
            return anchorNode;
        }
    }

    public static get anchorOffset(): number | null {
        const selection = window.getSelection();
        return selection ? selection.anchorOffset : null;
    }

    public static getRange(window: Window): Range | null {
        const selection = window.getSelection();
        return selection && selection.rangeCount ? selection.getRangeAt(0) : null;
    }

    public static getRect(window: Window): DOMRect | ClientRect {
        const sel = window.getSelection()!;
        let rect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        } as DOMRect;

        if (!window.getSelection) {
            return rect;
        }

        if (sel.rangeCount === null || isNaN(sel.rangeCount)) {
            return rect;
        }

        if (sel.rangeCount === 0) {
            return rect;
        }

        const range = sel.getRangeAt(0).cloneRange() as Range;

        if (range.getBoundingClientRect) {
            rect = range.getBoundingClientRect() as DOMRect;
        }
        return rect;
    }

    public static get text(): string {
        return window.getSelection ? window.getSelection()!.toString() : '';
    }

    public static setCursor(element: HTMLElement|Node, offset = 0): DOMRect {
        const range = document.createRange();
        const selection = window.getSelection()!;

        /** if found deepest node is native input */
        if ($.isNativeInput(element)) {
            if (!$.canSetCaret(element)) {
                return selection.getRangeAt(0).getBoundingClientRect();
            }

            element.focus();
            element.selectionStart = element.selectionEnd = offset;

            return element.getBoundingClientRect();
        }
        /* let node: HTMLElement = element;
        if (element.firstChild !== null) {
            node = element.firstChild;
        } */
        range.setStart(element, offset);
        range.setEnd(element, offset);

        selection.removeAllRanges();
        selection.addRange(range);

        return range.getBoundingClientRect();
    }
}
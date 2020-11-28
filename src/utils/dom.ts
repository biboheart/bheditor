export default class Dom {

    public static canSetCaret(target: HTMLElement): boolean {
        let result = true;

        if (Dom.isNativeInput(target)) {
            switch (target.type) {
            case 'file':
            case 'checkbox':
            case 'radio':
            case 'hidden':
            case 'submit':
            case 'button':
            case 'image':
            case 'reset':
                result = false;
                break;
            }
        } else {
            result = Dom.isContentEditable(target);
        }

        return result;
    }

    public static isContentEditable(element: HTMLElement): boolean {
        return element.contentEditable === 'true';
    }

    /**
     * Helper for making Elements with classname and attributes
     *
     * @param  {string} tagName - new Element tag name
     * @param  {string[]|string} [classNames] - list or name of CSS classname(s)
     * @param  {object} [attributes] - any attributes
     *
     * @returns {HTMLElement}
     */
    public static make(tagName: string, classNames: string|string[]|null = null, style: string = '', attributes: object = {}): HTMLElement {
        const el = document.createElement(tagName);

        if (Array.isArray(classNames)) {
            el.classList.add(...classNames);
        } else if (classNames) {
            el.classList.add(classNames);
        }

        if (style !== '') {
            el.style.cssText = style;
        }

        for (const attrName in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, attrName)) {
                (<any>el)[attrName] = (<any>attributes)[attrName];
            }
        }

        return el;
    }

    /**
     * 设置元素属性
     * @param {HTMLElement} el DOM元素
     * @param {object} any attributes
     */
    public static setAttributes(el: HTMLElement, attributes: object) {
        for (const attrName in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, attrName)) {
                (<any>el)[attrName] = (<any>attributes)[attrName];
            }
        }
    }

    /**
     * 设置元素样式
     * @param {HTMLElement} el DOM元素
     * @param {string} cssText 样式
     */
    public static setStyle(el: HTMLElement, cssText: string) {
        el.style.cssText = cssText;
    }

    /**
     * 将一个或多个元素附加到父元素
     * @param {Element|DocumentFragment} parent - 添加到哪个元素中
     * @param {Element|Element[]|DocumentFragment|Text|Text[]} elements - 一个或多个元素
     */
    public static append(
        parent: Element|DocumentFragment,
        elements: Element|Element[]|DocumentFragment|Text|Text[]
    ): void {
        if (Array.isArray(elements)) {
            elements.forEach((el: Element|Text) => parent.appendChild(el));
        } else {
            parent.appendChild(elements);
        }
    }

    /**
     * 在父元素的开头追加元素或一对元素
     * @param {Element} parent - 附加位置
     * @param {Element|Element[]} elements - 元素或元素列表
     */
    public static prepend(parent: Element, elements: Element|Element[]): void {
        if (Array.isArray(elements)) {
            elements = elements.reverse();
            elements.forEach((el) => parent.prepend(el));
        } else {
            parent.prepend(elements);
        }
    }

    /**
     * 通过ID获取元素
     * @param {string} id - 元素id属性值
     */
    public static get(id: string): HTMLElement | null {
        return document.getElementById(id);
    }

    /**
     * 获取编辑器容器
     *
     * @param {string | HTMLElement} element - 容器ID或元素
     *
     * @returns {HTMLElement}
     */
    public static getContainer(element: string | HTMLElement): HTMLElement {
        if (typeof element === 'string') {
            let el = document.getElementById(element);
            if (!el) {
                el = document.body;
            }
            return el;
        }
        return element;
    }

    /**
     * 选择器.
     *
     * 返回所有匹配的元素
     *
     * @param {Element|Document} el - 在里面搜索的元素. 默认 - DOM Document
     * @param {string} selector - 搜索字符串
     *
     * @returns {NodeList}
     */
    public static findAll(el: Element|Document = document, selector: string): NodeList {
        return el.querySelectorAll(selector);
    }

    /**
     * 检查目标是否为input元素
     *
     * @param {*} target - HTML element or string
     *
     * @returns {boolean}
     */
    public static isNativeInput(target: any): target is HTMLInputElement | HTMLTextAreaElement {
        const nativeInputs = [
            'INPUT',
            'TEXTAREA',
        ];

        return target && target.tagName ? nativeInputs.includes(target.tagName) : false;
    }

    /**
     * 校验对象是不是DOM 节点
     *
     * @param {*} node - 去校验的对象
     *
     * @returns {boolean}
     */
    public static isElement(node: any): node is Element {
        return node && typeof node === 'object' && node.nodeType && node.nodeType === Node.ELEMENT_NODE;
    }

    /**
     * 获取元素中文本长度
     * @param {Node} node - 包含内容的节点 
     */
    public static getContentLength(node: Node): number {
        if (Dom.isNativeInput(node)) {
            return (node as HTMLInputElement).value.length;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            return (node as Text).length;
        }
        if (node.textContent === null) {
            return 0;
        }
        return node.textContent.length;
    }
}
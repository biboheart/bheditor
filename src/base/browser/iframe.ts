/**
 * 表示可能的iframe链中的窗口
 */
export interface IWindowChainElement {
	/**
	 * 它的窗口对象
	 */
	window: Window;
	/**
	 * 中的iframe元素窗口.父级对应窗口
	 */
	iframeElement: Element | null;
}

let hasDifferentOriginAncestorFlag: boolean = false;
let sameOriginWindowChainCache: IWindowChainElement[] | null = null;

function getParentWindowIfSameOrigin(w: Window): Window | null {
	if (!w.parent || w.parent === w) {
		return null;
	}

	// 除非我们尝试访问父窗口中的某些内容，否则无法真正判断我们是否有权访问父窗口
	try {
		let location = w.location;
		let parentLocation = w.parent.location;
		if (location.origin !== 'null' && parentLocation.origin !== 'null') {
			if (location.protocol !== parentLocation.protocol || location.hostname !== parentLocation.hostname || location.port !== parentLocation.port) {
				hasDifferentOriginAncestorFlag = true;
				return null;
			}
		}
	} catch (e) {
		hasDifferentOriginAncestorFlag = true;
		return null;
	}

	return w.parent;
}

export class IframeUtils {

	/**
	 * 返回具有相同原点（可以通过编程方式访问）的嵌入式窗口链。
	 * 具有长度为1的链可能意味着当前执行环境运行在iframe外部或嵌入在具有不同原点的窗口中的iframe内部。
	 * 要区分当前执行环境是否在某个点上运行在具有不同原点的窗口中，请参见hasDifferentiorGinAncestor（）
	 */
	public static getSameOriginWindowChain(): IWindowChainElement[] {
		if (!sameOriginWindowChainCache) {
			sameOriginWindowChainCache = [];
			let w: Window | null = window;
			let parent: Window | null;
			do {
				parent = getParentWindowIfSameOrigin(w);
				if (parent) {
					sameOriginWindowChainCache.push({
						window: w,
						iframeElement: w.frameElement || null
					});
				} else {
					sameOriginWindowChainCache.push({
						window: w,
						iframeElement: null
					});
				}
				w = parent;
			} while (w);
		}
		return sameOriginWindowChainCache.slice(0);
	}

	/**
	 * 如果当前执行环境链接在一个iframe列表中，而iframe列表在一个具有不同原点的窗口中结束，则返回true。
	 * 如果当前执行环境没有在iframe中运行，或者iframe的整个链具有相同的原点，则返回false。
	 */
	public static hasDifferentOriginAncestor(): boolean {
		if (!sameOriginWindowChainCache) {
			this.getSameOriginWindowChain();
		}
		return hasDifferentOriginAncestorFlag;
	}

	/**
	 * 返回“childWindow”相对于“ancestorWindow”的位置`
	 */
	public static getPositionOfChildWindowRelativeToAncestorWindow(childWindow: Window, ancestorWindow: Window | null) {

		if (!ancestorWindow || childWindow === ancestorWindow) {
			return {
				top: 0,
				left: 0
			};
		}

		let top = 0, left = 0;

		let windowChain = this.getSameOriginWindowChain();

		for (const windowChainEl of windowChain) {

			top += windowChainEl.window.scrollY;
			left += windowChainEl.window.scrollX;

			if (windowChainEl.window === ancestorWindow) {
				break;
			}

			if (!windowChainEl.iframeElement) {
				break;
			}

			let boundingRect = windowChainEl.iframeElement.getBoundingClientRect();
			top += boundingRect.top;
			left += boundingRect.left;
		}

		return {
			top: top,
			left: left
		};
	}
}

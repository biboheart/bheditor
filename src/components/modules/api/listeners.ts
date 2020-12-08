import Module from '../../module';
import { Listeners } from '../../../../types/api';

export default class ListenersAPI extends Module {
    public get methods(): Listeners {
        return {
            on: (element: HTMLElement, eventType, handler, useCapture): void => this.on(element, eventType, handler, useCapture),
            off: (element, eventType, handler, useCapture): void => this.off(element, eventType, handler, useCapture),
        }
    }

    public on(element: HTMLElement, eventType: string, handler: () => void, useCapture?: boolean): void {
        this.editorModules.Listeners.on(element, eventType, handler, useCapture);
    }

    public off(element: Element, eventType: string, handler: () => void, useCapture?: boolean): void {
        this.editorModules.Listeners.off(element, eventType, handler, useCapture);
    }
}


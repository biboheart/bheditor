export {
    EditorConfig
} from './configs';
import {
    Events,
    Listeners,
} from './api';


export interface API {
    events: Events;
    listeners: Listeners;
}

/**
 * Main Editor class
 */
declare class EEditor {
    public static version: string;

    /**
     * Destroy Editor instance and related DOM elements
     */
    public destroy(): void;
}

export as namespace EEditor;
export default EEditor;
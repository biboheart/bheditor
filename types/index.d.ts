export {
    EditorConfig
} from './configs';

/**
 * Main Editor class
 */
declare class BhEditor {
    public static version: string;

    /**
     * Destroy Editor instance and related DOM elements
     */
    public destroy(): void;
}

export as namespace BhEditor;
export default BhEditor;

import {EditorConfig} from '../../types/index';

/**
 * Describes object passed to Editor modules constructor
 */
export interface ParagraphConfig {
    top: number;
    left: number;
    type?: string;
}

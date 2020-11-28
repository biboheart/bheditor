import {EditorConfig} from '../../types/index';

/**
 * Describes object passed to Editor modules constructor
 */
export interface ParagraphConfig {
    index: number;
    pageIndex: number;
    type?: string;
}

import { EditorConfig } from '../types';

import './style/main.scss';

import Core from './components/core'

export class Editor {
    constructor(configuration?: EditorConfig|string) {
        // tslint:disable-next-line: no-unused-expression
        new Core(configuration);
    }
}

function bhEditor(configuration?: EditorConfig|string) {
    return new Editor(configuration);
}

export default bhEditor;

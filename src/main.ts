/* import { EditorConfig } from '../types';

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

export default bhEditor; */

import { InputAreaController } from "./editor/components/input/inputAreaController";

export class Editor {
    constructor(el: HTMLElement) {
        let container = document.createElement('div');
        el.append(container);
        container.style.width = '300px',
        container.style.height = '200px',
        container.style.margin = '10px auto';
        container.style.border = '1px solid #dfdfdf';
        new InputAreaController(container);
    }
}

function bhEditor(el: HTMLElement) {
    return new Editor(el);
}

export default bhEditor;

import bhEditor from './main';

/* bhEditor({
    container: 'editor'
}); */

let el: HTMLElement|null = document.getElementById('editor');

if (el === null) {
    el = document.createElement('div');
    document.body.append(el);
}

bhEditor(el);

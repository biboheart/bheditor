import Layout from '../components/modules/layout';
import Input from '../components/modules/input';
import Toolbar from '../components/modules/toolbar';
import Caret from '../components/modules/caret';
import PageManager from '../components/page-manager';
import Listeners from '../components/modules/listeners';
import ListenersAPI from '../components/modules/api/listeners';

export interface EditorModules {
    Layout: Layout,
    Input: Input,
    Toolbar: Toolbar,
    Caret: Caret,
    PageManager: PageManager,
    Listeners: Listeners,
    ListenersAPI: ListenersAPI,
}


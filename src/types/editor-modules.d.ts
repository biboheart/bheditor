import Layout from '../components/modules/layout';
import Caret from '../components/modules/caret';
import PageManager from '../components/page-manager';
import Listeners from '../components/modules/listeners';
import ListenersAPI from '../components/modules/api/listeners';

export interface EditorModules {
    Layout: Layout,
    Caret: Caret,
    PageManager: PageManager,
    Listeners: Listeners,
    ListenersAPI: ListenersAPI,
}

import Layout from '../components/modules/layout';
import Caret from '../components/modules/caret';
import Input from '../components/modules/input';
import PageManager from '../components/page-manager';
import Listeners from '../components/modules/listeners';
import ListenersAPI from '../components/modules/api/listeners';
import Events from '../components/modules/events';
import EventsAPI from '../components/modules/api/events';

export interface EditorModules {
    Layout: Layout,
    Caret: Caret,
    Input: Input,
    PageManager: PageManager,
    Listeners: Listeners,
    ListenersAPI: ListenersAPI,
    Events: Events,
    EventsAPI: EventsAPI
}

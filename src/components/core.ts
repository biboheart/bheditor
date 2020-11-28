import $ from '../utils/dom';
import { EditorConfig } from '../../types';

export default class Core {
    private config: EditorConfig;

    constructor(config?: EditorConfig|string) {
        this.config = {};

        Promise.resolve().then(async () => {
            this.configuration = config || {};

            await this.validate();
            const { container } = this.config;
            $.append($.getContainer(container || 'editor'), new Text('123'));
        })
    }

    public async validate(): Promise<void> {
        const { container } = this.config;
        if (typeof container === 'string' && !$.get(container)) {
            throw Error(`element with ID «${container}» is missing. Pass correct holder's ID.`);
        }
        if (container && typeof container === 'object' && !$.isElement(container)) {
            throw Error('holder as HTMLElement if provided must be inherit from Element class.');
        }
    }

    public set configuration(config: EditorConfig|string) {
        if (typeof config !== 'object') {
            config = {
                container: config,
            };
          }
        this.config = config;
    }

    public get configuration(): EditorConfig|string {
        return this.config;
    }
}

import $ from '../utils/dom';
import { EditorConfig } from '../../types';
import { EditorModules } from '../types/editor-modules';
import { modules } from './module-manager';

export default class Core {
    private config: EditorConfig;
    public moduleInstances: EditorModules = {} as EditorModules;
    public isReady: Promise<void>;

    constructor(config?: EditorConfig|string) {
        this.config = {};

        let onReady: (value?: void | PromiseLike<void> | undefined) => void, onFail: (reason?: any) => void;

        this.isReady = new Promise((resolve, reject) => {
            onReady = resolve;
            onFail = reject;
        });

        Promise.resolve().then(async () => {
            this.configuration = config || {};

            await this.validate();
            this.init();
            await this.start();

            setTimeout(async () => {
                const { PageManager } = this.moduleInstances;
                PageManager.start();
                onReady();
            }, 500)
        })
    }

    public init(): void {
        this.constructModules();
        this.configureModules();
    }

    public async start(): Promise<void> {
        const modulesToPrepare = [
            'Layout',
            'Caret',
            'PageManager',
        ]

        await modulesToPrepare.reduce((promise, module) => promise.then(async () => {
            await (<any>this.moduleInstances)[module].prepare();
        }), Promise.resolve());
    }

    private constructModules(): void {
        modules.forEach(module => {
            if (typeof module !== 'function') {
                return
            }
            (<any>this.moduleInstances)[module.name] = new module({
                config: (this.configuration as EditorConfig)
            })
        })
    }

    private configureModules(): void {
        for (const name in this.moduleInstances) {
            if (Object.prototype.hasOwnProperty.call(this.moduleInstances, name)) {
                (<any>this.moduleInstances)[name].state = this.getModulesDiff(name);
            }
        }
    }

    private getModulesDiff(name: string): EditorModules {
        const diff: EditorModules = {} as EditorModules;
        for (const moduleName in this.moduleInstances) {
            if (moduleName === name) {
                continue;
            }
            (<any>diff)[moduleName] = (<any>this.moduleInstances)[moduleName];
        }
        return diff;
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

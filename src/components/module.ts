import { EditorConfig } from "../../types";
import { ModuleConfig } from "../types/module-config";
import { EditorModules } from "../types/editor-modules";

export default class Module {
    /**
     * 编辑器模块索引
     */
    protected editorModules: EditorModules = {} as EditorModules;

    /**
     * 编辑器配置对象
     * @type {EditorConfig}
     */
    protected config: EditorConfig;

    /**
     * 初始化模块
     * @param {ModuleConfig} 模块配置对象
     */
    constructor({ config }: ModuleConfig) {
        if (new.target === Module) {
            throw new TypeError('Constructors for abstract class Module are not allowed.');
        }
        this.config = config;
    }

    public get state(): EditorModules {
        return this.editorModules;
    }

    public set state(editor: EditorModules) {
        this.editorModules = editor;
    }
}

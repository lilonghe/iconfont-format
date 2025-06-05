#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { processIconfont } from '../lib/iconfont.js';
import { processLocal } from '../lib/local.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    try {
        // 获取当前工作目录
        const cwd = process.cwd();
        // 尝试导入配置文件
        const configPath = resolve(cwd, 'icon.config.js');
        const config = await import(configPath);

        if (!config.default) {
            throw new Error('配置文件必须使用 export default 导出配置对象');
        }

        const { type, ...options } = config.default;

        // 根据类型调用不同的处理函数
        switch (type) {
            case 'iconfont':
                if (!options.url) {
                    throw new Error('使用 iconfont 类型时，必须提供 url 配置项');
                }
                await processIconfont(options);
                break;
            case 'local':
                if (!options.svgDir) {
                    throw new Error('使用 local 类型时，必须提供 svgDir 配置项');
                }
                await processLocal(options);
                break;
            default:
                throw new Error('type 必须为 "iconfont" 或 "local"');
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
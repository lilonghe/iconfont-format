import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, basename, resolve } from 'node:path';

function extractPathData(content) {
    const paths = content.match(/<path[^>]*>/g) || [];
    const dAttributes = paths
        .map(path => {
            const dMatch = path.match(/d="([^"]*)"/); 
            return dMatch ? dMatch[1] : null;
        })
        .filter(Boolean);

    if (dAttributes.length === 0) return '';
    
    // 如果有多个路径，将它们组合在一起
    return dAttributes.map(d => `<path d="${d}"/>`).join('');
}

function extractViewBox(content) {
    const viewBoxMatch = content.match(/viewBox="([^"]*)"/); 
    return viewBoxMatch ? viewBoxMatch[1] : '';
}

export async function processLocal(options) {
    try {
        // 确保 svgDir 是绝对路径
        const svgDir = resolve(process.cwd(), options.svgDir);
        const savePath = resolve(process.cwd(), options.savePath);

        // 读取目录下所有文件
        const files = await readdir(svgDir);
        const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'));

        if (svgFiles.length === 0) {
            throw new Error(`在 ${options.svgDir} 目录下未找到 SVG 文件`);
        }

        const symbols = {};

        // 处理每个 SVG 文件
        for (const file of svgFiles) {
            const content = await readFile(join(svgDir, file), 'utf-8');
            const id = basename(file, '.svg');

            // 提取 SVG 内容
            let svgContent = content
                .replace(/^[\s\S]*<svg[^>]*>([\s\S]*)<\/svg>[\s\S]*$/, '$1')
                .trim();

            // 提取 path 的 d 属性
            svgContent = extractPathData(svgContent);

            if (options.keepSVG) {
                const viewBox = extractViewBox(content);
                const viewBoxAttr = viewBox ? ` viewBox="${viewBox}"` : '';
                svgContent = `<svg${viewBoxAttr}>${svgContent}</svg>`;
            } else {
                svgContent = `<>${svgContent}</>`;
            }

            if (!options.isColorFul) {
                svgContent = svgContent.replace(/fill="[^"]+"/g, '');
            }

            symbols[id] = svgContent;
        }

        // 生成输出文件
        await writeFile(savePath, `export default {
    ${Object.entries(symbols).map(([key, value]) => `'${key}': ${value}`).join(',\n    ')}
}`);

        console.log('Success：', Object.keys(symbols).length);
    } catch (error) {
        throw new Error(`处理本地 SVG 文件失败: ${error.message}`);
    }
}
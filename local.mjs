import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
    // SVG 文件所在目录
    svgDir: './svg',
    // 输出文件路径
    savePath: './demo2/icons.tsx',
    // 是否是多色图标
    isColorFul: false,
    // 是否保留 svg 标签
    keepSVG: true,
}

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
    return viewBoxMatch ? ` viewBox="${viewBoxMatch[1]}"` : '';
}

async function processSVGFiles() {
    try {
        // 读取目录下所有文件
        const files = await readdir(join(__dirname, config.svgDir));
        const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'));

        const symbols = {};

        // 处理每个 SVG 文件
        for (const file of svgFiles) {
            const content = await readFile(join(__dirname, config.svgDir, file), 'utf-8');
            const id = basename(file, '.svg');

            // 提取 SVG 内容
            let svgContent = content
                .replace(/^[\s\S]*<svg[^>]*>([\s\S]*)<\/svg>[\s\S]*$/, '$1')
                .trim();

            // 提取 path 的 d 属性
            svgContent = extractPathData(svgContent);

            if (config.keepSVG) {
                const viewBox = extractViewBox(content);
                svgContent = `<svg${viewBox}>${svgContent}</svg>`;
            } else {
                svgContent = `<>${svgContent}</>`;
            }

            if (!config.isColorFul) {
                svgContent = svgContent.replace(/fill="[^"]+"/g, '');
            }

            symbols[id] = svgContent;
        }

        // 生成输出文件
        await writeFile(config.savePath, `export default {
    ${Object.entries(symbols).map(([key, value]) => `'${key}': ${value}`).join(',\n    ')}
}`);

        console.log('Success：', Object.keys(symbols).length);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

processSVGFiles();
import { writeFile } from 'node:fs/promises';
import { request } from 'node:https';

function download(url) {
    return new Promise((resolve, reject) => {
        const req = request(url, (res) => {
            let data = '';
            res.on('data', (d) => {
                data += d.toString();
            });

            res.on('end', () => {
                resolve(data);
            });
        });

        req.on('error', (e) => {
            reject(e);
        });
        
        req.end();
    });
}

function formatResponse(content = '', options) {
    const symbolStrList = content.match(/(<symbol).*(<\/symbol>)/g)?.[0].split('</symbol>').filter(Boolean).map(item => item += '</symbol>');

    if (!symbolStrList?.length) {
        throw new Error('无法解析 iconfont 内容');
    }

    const symbols = {};
    symbolStrList.forEach(item => {
        const id = item.match(/id="([\w-]+)"/)?.[1];
        if (id) {
            if(options.keepSVG) {
                // 提取原始 viewBox
                const viewBox = item.match(/viewBox="([^"]*)"/)?.[1] || '';
                const viewBoxAttr = viewBox ? ` viewBox="${viewBox}"` : '';
                item = item.replaceAll('symbol', 'svg');
                // 确保 viewBox 属性被正确保留
                if (viewBox && !item.includes(`viewBox="${viewBox}"`)) {
                    item = item.replace('<svg', `<svg${viewBoxAttr}`);
                }
            } else {
                item = `<>${item.replace(/(<symbol [^>]*>)|(<\/\s*symbol>)/g, '')}</>`;    
            }

            if (!options.isColorFul) {
                item = item.replace(/fill="[^"]+"/g, "");
            }

            symbols[id] = item;
        } else {
            console.warn('Warning: 发现无效的图标 -> ', item);
        }
    });

    return symbols;
}

export async function processIconfont(options) {
    try {
        const content = await download(options.url);
        const svgList = formatResponse(content, options);

        await writeFile(options.savePath, `export default {
    ${Object.entries(svgList).map(([key, value]) => `'${key}': ${value}`).join(',\n    ')}
}`);

        console.log('Success：', Object.keys(svgList).length);
    } catch (error) {
        throw new Error(`处理 iconfont 失败: ${error.message}`);
    }
}
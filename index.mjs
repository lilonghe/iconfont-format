import { writeFile } from 'node:fs/promises';
import { request } from 'node:https';


const config = {
    url: 'https://at.alicdn.com/t/c/font_4622387_tu0pg1aur2b.js',
    savePath: './demo/icons.tsx',
    // 是否是多色图标 is colorful icon
    isColorFul: false,
    // 是否保留 svg 标签 is keep svg tag
    keepSVG: false,
}

function download(callback) {
    const req = request(config.url, (res) => {
        let data = '';
        res.on('data', (d) => {
            data += d.toString();
        });

        res.on('end', () => {
            callback({ svgList: formatResponse(data) })
        })
    });

    req.on('error', (e) => {
        console.error(e.message);
    });
    
    req.end();
}

function formatResponse(content = '') {
    const symbolStrList = content.match(/(\<symbol).*(\<\/symbol\>)/g)?.[0].split('</symbol>').filter(Boolean).map(item => item += '</symbol>');

    if (!symbolStrList?.length) {
        console.log(content);
        console.log('fail');
        return {};
    }
    const symbols = {};
    symbolStrList.forEach(item => {
        const id = item.match(/id="([\w-]+)"/)[1];
        if (id) {
            if(config.keepSVG) {
                item = item.replaceAll('symbol', 'svg');
            } else {
                item = `<>${item.replace(/(\<symbol [^\>]*\>)|(\<\/\s*symbol\>)/g, '')}</>`;
            }

            if (!config.isColorFul) {
                item = item.replace(/fill="[^"]+"/g, "");
            }

            symbols[id] = item;
        } else {
            console.log('ERROR -> ', item)
        }
    });

    return symbols;
}

download(async ({ svgList }) => {
    await writeFile(config.savePath, `export default {
        ${Object.entries(svgList).map(([key, value]) => `'${key}': ${value}`)}    
    }`);

    console.log('Success：', Object.keys(svgList).length);
});
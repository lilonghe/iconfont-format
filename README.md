## Iconfont format
一键下载 Iconfont 项目所有图标，自动生成 icon 组件所需要的图标信息

## Config
```
const config = {
    url: 'https://at.alicdn.com/t/c/font_4622387_tu0pg1aur2b.js',
    savePath: './demo/icons.tsx',
    // 是否是多色图标 is colorful icon
    isColorFul: false,
    // 是否保留 svg 标签 is keep svg tag
    keepSVG: false,
}
```


## Usage
将 index.mjs 拷贝到项目中，修改 index.mjs 中的 config 信息，执行 node index.mjs

```
node index.mjs
```

```
// package.json
"scripts": {
    "icon": "node index.mjs"
}
npm run icon
```
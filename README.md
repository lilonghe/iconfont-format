# Icon format

```
const config = {
    url: 'https://at.alicdn.com/t/c/font_4622387_tu0pg1aur2b.js', // iconfont
    svgPath: './svg/', // local
    savePath: './demo/icons.tsx',
    // 是否是多色图标 is colorful icon
    isColorFul: false,
    // 是否保留 svg 标签 is keep svg tag
    keepSVG: false,
}
```

## Iconfont
`index.mjs`

一键下载 Iconfont 项目所有图标，自动生成 icon 组件所需要的图标信息。


## Local svg
`local.mjs`

一键格式化本地 icon svg 文件，只保留必须信息（path.d）。
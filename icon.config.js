export default {
    // 图标来源类型：'iconfont' 或 'local'
    type: 'local',
    // iconfont 在线链接，type 为 'iconfont' 时必填
    url: 'https://at.alicdn.com/t/c/font_xxxx.js',
    // SVG 文件所在目录，type 为 'local' 时必填
    svgDir: './demo/svg',
    // 输出文件路径
    savePath: './demo/icons.tsx',
    // 是否是多色图标
    isColorFul: false,
    // 是否保留 svg 标签
    keepSVG: true,
}
# svg-icon-format

一个用于格式化 SVG 图标的工具，支持从 iconfont 在线链接或本地 SVG 文件生成标准化的图标组件。

## 特性

- 支持从 iconfont 在线链接获取图标
- 支持处理本地 SVG 文件
- 可选是否保留 SVG 标签及原始 viewBox 属性
- 可选是否保留多色图标

## 安装

```bash
npm install svg-icon-format -g
```

## 使用方法

1. 在你的项目根目录创建 `icon.config.js` 文件：

```javascript
export default {
    // 图标来源类型：'iconfont' 或 'local'
    type: 'local',
    // iconfont 在线链接，type 为 'iconfont' 时必填
    url: 'https://at.alicdn.com/t/c/font_xxxx.js',
    // SVG 文件所在目录，type 为 'local' 时必填
    svgDir: './svg',
    // 输出文件路径
    savePath: './icons.tsx',
    // 是否是多色图标
    isColorFul: false,
    // 是否保留 svg 标签
    keepSVG: false,
}
```

2. 运行命令：

```bash
svg-icon-format
```

## 配置说明

| 配置项 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| type | string | 图标来源类型，可选值：'iconfont'、'local' | - |
| url | string | iconfont 项目在线链接，type 为 'iconfont' 时必填 | - |
| svgDir | string | SVG 文件所在目录，type 为 'local' 时必填 | - |
| savePath | string | 输出文件路径 | - |
| isColorFul | boolean | 是否保留多色图标的颜色信息 | false |
| keepSVG | boolean | 是否在输出中保留 SVG 标签 | false |

## 示例

### 从 iconfont 获取图标

```javascript
// icon.config.js
export default {
    type: 'iconfont',
    url: 'https://at.alicdn.com/t/c/font_xxxx.js',
    savePath: './src/icons.tsx',
}
```

### 处理本地 SVG 文件

```javascript
// icon.config.js
export default {
    type: 'local',
    svgDir: './svg',
    savePath: './src/icons.tsx',
}
```

## 输出示例

```typescript
// icons.tsx
export default {
    'icon-name': <svg viewBox="0 0 1024 1024"><path d="..."/></svg>,
    'another-icon': <svg viewBox="0 0 1024 1024"><path d="..."/></svg>
}
```

## 使用实例
```typescript
import Icon from './Icon';

const MyComponent = () => {
    return (
        <Icon name="icon-name" size="26px" />
    );
}
```

## License

MIT
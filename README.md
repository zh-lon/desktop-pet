# 桌面宠物 Desktop Pet

一个基于 Electron + React + TypeScript 开发的可爱桌面宠物程序。

## 功能特性

- 🐾 **可爱动画**: 多种动作状态(待机、行走、坐下、睡觉)
- 💬 **互动消息**: 宠物会随机显示不同的消息气泡
- 🖱️ **拖动支持**: 可以拖动宠物到桌面任意位置
- 🪟 **透明窗口**: 无边框透明窗口,始终置顶显示
- 🎨 **精美UI**: 渐变色设计,流畅的CSS动画

## 技术栈

- **Electron**: 桌面应用框架
- **React**: 前端UI框架
- **TypeScript**: 类型安全的JavaScript
- **Vite**: 快速的前端构建工具

## 项目结构

```
desktop-pet/
├── src/
│   ├── main.ts          # Electron 主进程
│   ├── preload.ts       # 预加载脚本
│   ├── main.tsx         # React 入口
│   ├── App.tsx          # 主组件
│   ├── App.css          # 样式文件
│   └── index.css        # 全局样式
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── tsconfig.json        # TS 配置(渲染进程)
├── tsconfig.main.json   # TS 配置(主进程)
└── vite.config.ts       # Vite 配置
```

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run dev
```

此命令会同时启动:
- Vite 开发服务器 (端口 5173)
- Electron 应用窗口

## 构建打包

```bash
# Windows 平台
npm run build:win

# macOS 平台
npm run build:mac

# Linux 平台
npm run build:linux
```

构建产物将输出到 `release/` 目录。

## 使用说明

1. **拖动宠物**: 按住鼠标左键拖动宠物到任意位置
2. **关闭程序**: 双击宠物即可关闭程序
3. **观察动作**: 宠物会自动随机切换不同动作和消息

## 自定义开发

### 修改宠物外观

编辑 `src/App.css`,调整以下样式:
- `.pet-body`: 宠物身体颜色和形状
- `.pet-eye`: 眼睛样式
- `.pet-ear`: 耳朵位置和形状

### 添加新动作

1. 在 `src/App.tsx` 的 `Action` 类型中添加新动作
2. 在 `messages` 对象中添加对应消息
3. 在 `src/App.css` 中添加新的动画样式

### 调整窗口属性

编辑 `src/main.ts` 中的 `BrowserWindow` 配置:
- `width/height`: 窗口大小
- `x/y`: 初始位置
- `alwaysOnTop`: 是否置顶

## 开发原则

本项目遵循以下工程原则:
- **KISS**: 保持代码简洁明了
- **DRY**: 避免重复代码
- **SOLID**: 单一职责,清晰的组件划分
- **YAGNI**: 只实现必要功能

## License

MIT

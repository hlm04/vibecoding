# vibecoding

## 开发快速开始

### 环境依赖
- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

### 启动与构建
1. 安装依赖：`cd frontend && npm install`
2. 启动开发服务器：`npm run start`
3. 构建生产包：`npm run build`
4. 代码检查：`npm run lint`

### 代码结构
```
frontend/
├── index.html
├── package.json
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── features/
│       └── kaleidoscope/
│           ├── components/
│           ├── hooks/
│           └── pages/
└── ...
```

上述目录预留了 Kaleidoscope 相关的组件、页面与业务逻辑，方便后续的 H5/WebGL 体验迭代。

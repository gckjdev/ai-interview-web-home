# AI面试助手

这是一个使用现代Web技术构建的AI面试模拟系统，帮助求职者准备面试。

## 功能说明

### 主页 (/)
- 项目介绍和主要功能展示
- 提供进入面试模拟的入口按钮

### 聊天页面 (/chat)
- 模拟真实面试场景的聊天界面
- AI面试官会根据用户回答动态调整问题
- 支持多轮对话，覆盖基本信息、技术问题和行为问题
- 结束时提供简要评价和建议

## 技术栈

- Next.js 14：React框架，用于构建服务端渲染和静态网站
- React 18：用户界面库
- TypeScript：提供类型安全
- Chakra UI：组件库，提供现代化UI设计

## 使用方法

1. 访问网站首页
2. 点击"开始模拟面试"按钮
3. 在聊天界面中告诉AI你想面试的职位
4. 回答AI提出的问题，模拟真实面试场景
5. 完成所有问题后，AI会给出简要评价
6. 如需重新开始，点击右上角的刷新按钮

## API接口说明

### POST /api/chat
- 功能：处理用户消息并返回AI回复
- 请求参数：
  ```json
  {
    "message": "用户输入的消息"
  }
  ```
- 返回数据：
  ```json
  {
    "reply": "AI的回复内容"
  }
  ```

## 项目结构

```
/app
  /api
    /chat
      route.ts      # 聊天API接口
  /chat
    page.tsx        # 聊天页面
  layout.tsx        # 全局布局
  page.tsx          # 首页
/types
  chat.ts           # 类型定义
/public
  # 静态资源
package.json        # 项目依赖
next.config.js      # Next.js配置
tsconfig.json       # TypeScript配置
```

## 后续优化方向

1. 添加更多行业特定的面试问题库
2. 实现用户注册和面试历史记录功能
3. 添加语音输入和输出功能
4. 提供面试表现分析和改进建议
5. 支持上传简历，AI根据简历内容定制面试问题

## 如何运行项目

1. **安装依赖**

首先，在项目根目录运行以下命令安装所有依赖：

```bash
npm install
# 或者
yarn install
# 或者
pnpm install
```

2. **启动开发服务器**

运行以下命令启动开发服务器：

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
```

3. **访问应用**

在浏览器中打开 http://localhost:3000 访问主页，或者直接访问 http://localhost:3000/chat 进入聊天界面。

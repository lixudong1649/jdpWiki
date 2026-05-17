# **AI落地开源项目 - JDP生态**

**GitHub主页**：https://github.com/lixudong1649

## **一、项目目标**

- 搭建个人完整的 **AI 落地开源生态**，系统化学习和实践 **LLM / RAG / AI Agent / 多模态 / AI工程化**。
- 全面梳理知识库，调研国内外主流大模型，探索AI技术在真实场景中的落地方式。
- 所有项目统一使用 `jdp-` 前缀，集中在 GitHub：`https://github.com/lixudong1649`

---

## **二、整体规范体系**

### **1. 数据库规范**
- 全生态统一使用 **MongoDB**：`mongodb://xxx:27017/jdp_db`
- 系统级表：user、permission、dict
- 业务表统一使用 **jdp-xxx** 前缀

### **2. 项目命名规范**
- 所有项目统一命名为 `jdp-项目名`
- 代表性项目包括：jdp-ai、jdp-crawler、jdp-orc、jdp-json-viewer、jdp-chat、jdp-douyang、jdp-kungfu 等

---

## **三、基础能力层（Base Layer）**

### **1. 小九看门（统一权限中心）**
- 项目：**jdp-gatekeeper**
- 能力：SSO、RBAC、统一权限管理
- 技术：Vue + Go + MongoDB

### **2. 字典服务**
- 项目：**jdp-dict**
- 技术：React + Tailwind + MongoDB

### **3. 文件存储（OSS）**
- 项目：**jdp-oss**
- 能力：支持本地磁盘 + 多云Provider可扩展
- 技术：Vue3 + Node + MongoDB

### **4. 小九表单（动态数据记录）**
- 项目：**jdp-record**
- 特点：动态表单生成，支持 MongoDB + SQLite 双库
- 技术：Vue + Node.js

---

## **四、功能型产品层（Application Layer）**

### **1. 小九导航**
- 项目：**jdp-home**
- 功能：浏览器书签同步
- 技术：Vue + Tailwind + Node + MongoDB

### **2. 个人博客**
- 项目：**jdp-blog**
- 技术：VitePress + Algolia搜索 + ngrok
- 部署：Stackblitz
- 优化工具：Bolt.new、ChatGPT
- 访问地址：https://jdp.bolt.host

### **3. 小九AI（核心项目）**
- **项目**：**jdp-ai**
- **功能定位**：多模型智能会话 + 私域知识库检索系统
- **核心特点**：支持本地 Ollama 与云端 API 多模型切换，结合简单文本搜索与 RAG 增强检索，实现高效私域知识问答。
- **技术栈**：
  - 前端：Next.js + TypeScript + TailwindCSS
  - 后端：Node.js
  - AI 框架：LangChain
  - 向量数据库：ChromaDB
  - 向量化模型：Ollama bge-m3
  - LLM 生成：Ollama deepseek-r1:8b 等
  - 会话与消息持久化：当前使用 JSON，可扩展至 MongoDB
- **RAG 流程设计**：采用两阶段处理（初始化阶段 + 在线检索阶段）
- **缓存机制**：实现三层缓存（Chroma向量缓存、retrieval检索结果缓存、answer完整答案缓存）
- **架构设计**：
  - 采用门面模式（Facade） + 适配器模式（Adapter）
  - 基础设施包含熔断、降级兜底、缓存、观测等能力
  - 整体使用分层架构 + 配置驱动开发
  - 实现模型能力抽象、持久化能力抽象
  - 支持控制隔离

**GitHub地址**：https://github.com/lixudong1649/jdp-ai.git

### **4. AI面试助手**
- 项目：**jdp-interview**
- 功能：单页前端 + 实时语音转文字 + AI生成面试回答（支持自动/手动触发）
- 技术：FastAPI/Uvicorn + WebSocket + 讯飞/豆包STT + Groq/星火/OpenAI 等

### **5. 小九简聊**
- 项目：**jdp-chat**
- 功能：轻量无痕聊天
- 技术：Node.js + WebSocket

### **6. 小九抖影（短视频系统）**
- 项目：**jdp-douyang**
- 功能：视频上传、搜索、推荐、混播私域视频库
- 技术：React + Node.js + MongoDB（使用Cursor辅助开发）

### **7. 小九爬爬（爬虫 / 抓包器）**
- 项目：**jdp-crawler**
- 功能：URL指定爬取、信息提取、抓包、API报告生成
- 技术：mitmproxy + Node/Go

### **8. 小九待办**
- 项目：**jdp-todo**
- 功能：表格 + 日历模式计划管理
- 技术：Vue + Node.js + MongoDB

---

## **五、工具型系统（Utility Layer）**

### **1. 小九隐私扫描系统**
- 项目：**jdp-privacy_scanner**
- 功能：支持Regex / Keyword / Pattern / Heuristic等多种方式
- 技术：Python GUI

### **2. 小九OCR**
- 项目：**jdp-orc**
- 流程：OCR识别 → 字段归一化 → 结构化解析
- 技术：Flask + PaddleOCR / EasyOCR + spaCy + Ollama（Qwen2.5）

### **3. 小九JSON可视化工具**
- 项目：**jdp-json-viewer**
- 功能：原生JSON → Grid表格可视化

---

## **六、游戏 / 交互项目（Motion & AR Layer）**

### **1. 小九功夫（AR体感训练）**
- 项目：**jdp-kungfu**
- 功能：浏览器端AR + AI体感训练，支持摄像头动作捕捉、姿态识别、虚拟靶、特效、音效
- 技术：React 19 + TypeScript + Vite + MediaPipe + Gemini 2.5 Flash + Canvas粒子特效 + Web Audio API

### **2. 小九指健**
- 项目：**jdp-finger**
- 技术：React + Base44 Platform + TanStack Query
- 在线地址：https://finger.base44.app

### **3. 小九LOL（轻量MOBA）**
- 项目：**jdp-lol**
- 技术：React + Canvas

---

## **七、其他生态项目**

- **小九音乐**：React、Swift
- **小九帮帮（小程序）**：信息表管理工具

---

## **八、未来规划方向**

- 微信AI客服
- 企业级知识库RAG系统
- 个人AI代理（Multi-Agent）
- 多端Studio一体化平台

---

**持续更新中**，欢迎访问 GitHub 查看各项目源码与最新进展。个别项目private，如需交流，请提前沟通来意

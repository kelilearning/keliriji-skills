# 颗粒日记 Skills 域地图

本文件说明 Skill 叙事与产品权威源的对应关系。`keliriji-skills` 只组织 Agent 工作流，不成为业务数据或学科方法论的新真相源。

## 服务边界

| 域 | 权威服务/仓库 | Skills 职责 | 禁止越界 |
|----|---------------|-------------|----------|
| API Key 与 Open API | `appfunctor-openapi-skills-gateway` | 鉴权、scope、公开 endpoint、委托会话 | 不复制业务数据，不绕过 self 边界 |
| 素材、知识颗粒、LEC、TTQ/PAS 编排 | `PsycheFlow-AppFunctor` | 按公开 Gateway 契约组织流程 | 不直连内部路由或 FC |
| 用户学习会话与 Agent 编排 | `PsycheFlow-Runtime` / `keliagent` | 说明 subject/surface 与 Skill 路由 | 不把 Runtime 状态复制到 Skill |
| 离屏复习 | `PsycheFlow-OffScreenRecap` | 说明 OSR 使用边界 | 不直连库存库、内部 API 或 OSS |
| 商业订单 | `AppFactory` | 未来公开契约下的确认与调用流程 | 不缓存价格，不代替支付身份 |
| 客户端能力 | `PsycheFlow-Mobile2` / `KelirijiMiniProgram` | 提供未开放能力的官方产品路径 | 不把页面存在当作 API 可用 |
| 数学契约 | `appfunctor-math` | `math` 路由与最小方法摘要 | 不推广为默认学科 |
| 语文契约 | `appfunctor-yuwen` | `yuwen` 路由与最小方法摘要 | 不用数学题型解释语文 |
| 英语契约 | `appfunctor-english` | `english` 路由与最小方法摘要 | 不把词汇流推广到其它学科 |

## 核心数据流

```text
用户 / Agent
  │ API Key
  ▼
OpenAPI Skills Gateway
  │ delegated user session
  ▼
AppFunctor ── 素材 / KP / LEC / 业务编排
  ├─ 学科服务 ── yuwen / math / english 专属能力
  ├─ Runtime / keliagent ── LearnerSession 与对话编排
  ├─ OSR ── Shard / Topic / 离屏复习
  └─ AppFactory ── 商业订单（按所属契约独立治理）
```

## Agent 可见能力与产品全貌

| 产品能力 | 产品侧存在 | Skills 公开契约 | 当前状态 |
|----------|------------|------------------|----------|
| API Key / Health | 是 | 是 | available |
| 素材 / KP | 是 | 是 | available |
| LearningEpisode 与只读学习洞察 | 是 | 是 | available |
| TTQ / IPTTQ | 是 | 尚未完整开放 | planned |
| PAS / DRS | 是 | 尚未完整开放 | planned |
| 素材关系图写入 | 是 | 尚未开放 | planned |
| 颗粒工厂 | 是 | 尚未开放 | planned |
| keliagent / OSR | 是 | 受信服务入口，非通用 Open API | limited |

## 数据所有权

- 用户上传素材与知识颗粒：用户私有，由颗粒日记业务后端管理。
- 学习进度、反馈、备注与标注：用户私有，必须后端持久化。
- LearnerSession：Runtime 管理的用户学习上下文。
- Shard / Topic：OSR 私有复习库存。
- 学科宪章：对应 `appfunctor-{subject}` 仓库维护。

Skill 文档和 Agent 对话都不是上述对象的持久化存储。

## 变更同步

| 上游变化 | 本仓库动作 |
|----------|------------|
| Gateway 新增/废弃 endpoint 或 scope | 更新对应 reference、能力矩阵和校验 allowlist |
| AppFunctor 改变业务语义 | 更新工作流与失败恢复，不复制实现细节 |
| 学科宪章 major 变更 | 更新 `subjects.md` 最小摘要与来源 |
| 新学科上线 | 先修订根宪章，再增加学科登记与路由案例 |
| 客户端新增功能 | 只登记产品能力；公开契约发布后再标 available |
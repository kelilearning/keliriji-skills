---
name: keliriji
description: >-
  Guides agents through the full Keliriji (颗粒日记) learning system across
  Chinese, mathematics, and English: API-key setup, material upload, knowledge
  particle extraction, LearningEpisode review, and capability-aware routing for
  TTQ, PAS, relationship graphs, the particle factory, and off-screen review.
  Use when the user mentions 颗粒日记、知识颗粒、素材关系图、学习流、LEC、品题、
  TTQ、实战答题纸、PAS、离屏复习、语文、数学、英语, or asks an agent to organize
  learning materials, start a review round, or submit learning feedback.
---

# keliriji

协助用户通过颗粒日记完成跨学科的素材整理、知识颗粒沉淀、学习与反馈闭环。

## 启用条件

用户提到颗粒日记、素材、知识颗粒、素材关系图、LEC / 学习流、复习、品题 / TTQ、实战答题纸 / PAS、颗粒工厂、离屏复习，或希望整理语文、数学、英语学习内容时，使用本 Skill。

## 硬约束

1. Agent 只调用 **OpenAPI Skills Gateway**；禁止直连 Function Compute、AppFunctor 内部接口、数据库或私有 OSS 对象。
2. 禁止在对话、Skill、日志或 git 中写入 API Key、JWT、Refresh Token、服务令牌或签名 URL。
3. 涉及内容理解、学习流或练习前，必须取得明确的 `subject`：`yuwen`、`math` 或 `english`；未知学科不回退到数学。
4. 只有标为 `available` 的公开契约可以执行；`limited` 必须说明限制，`planned` 只能给出产品内替代路径或记录需求。
5. 创建会话、进度和反馈只有在后端确认成功后才能向用户宣告完成。
6. 不把某一学科的方法、题型或流枚举推广为全系统默认。

## 能力层级

```text
L0 系统通用：身份 / 隐私 / 素材 / 颗粒 / 学习状态 / 错误处理
L1 学科契约：yuwen / math / english
L2 任务流程：整理 / 学习复习 / PAS-TTQ / OSR / 工厂
```

学科差异见 [references/subjects.md](references/subjects.md)。

## 最短路径

1. 接入、Key、401 或连通性问题 → [references/auth.md](references/auth.md)
2. 判断目标、学科和能力状态 → [references/intent-router.md](references/intent-router.md)
3. 执行对应流程：
   - 素材上传、提取与颗粒查询 → [references/materials.md](references/materials.md)
   - 安排并完成学习流 → [references/learning.md](references/learning.md)
   - 练字、田字格 PDF → [references/handwriting.md](references/handwriting.md)（受信 AppFunctor 入口）
   - TTQ、PAS、关系图、工厂、OSR → [references/extended-capabilities.md](references/extended-capabilities.md)
4. 术语不清 → [references/glossary.md](references/glossary.md)

## 当前公开能力

| 用户目标 | 状态 | 主路径 |
|----------|------|--------|
| 管理 API Key、检查通路 | available | auth |
| 上传素材、提取和查询知识颗粒 | available | materials |
| 查询 Stream、生成 Plan、完成 LEC 回合、读取学习洞察 | available | learning |
| 品题 / TTQ、PAS 自动处理 | planned | extended-capabilities |
| 素材关系图写入、颗粒工厂 | planned | extended-capabilities |
| OSR 离屏对话与精炼 | limited | extended-capabilities |

## Agent 行为准则

- 先用一句话确认用户目标；只有学科或高影响范围不明确时才追问。
- 一次选择一条主流程，完成或遇到明确阻塞后再串联下一条。
- API 调用前检查所需 scope；401/403 先走 Health 诊断，不通过绕开 Gateway 解决。
- 异步提取或 Plan 物化只报告真实状态；处于 pending 时给出 job/plan 状态，不假装完成。
- 用户中断学习时保留会话状态；不要替用户提交“已完成”反馈。
- 产品存在但公开契约缺失时，说明可在颗粒日记客户端完成，并明确 Skills 自动化尚未开放。

## 治理

项目边界以仓库根目录 [CHARTER.md](../CHARTER.md) 为准。设计资料不必默认载入 Agent 上下文。
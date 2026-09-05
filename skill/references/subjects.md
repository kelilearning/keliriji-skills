# 学科契约

学科是颗粒日记 Skill 的一等上下文。当前稳定 subject id 为 `yuwen`、`math`、`english`。

## 通用规则

1. 用户、可信会话或业务对象必须提供 subject；不从模糊内容静默猜测。
2. Gateway 的公开契约决定哪些操作可执行；学科仓库决定内容方法论。
3. 学科专属术语只在对应 subject 下使用。
4. 一个任务跨学科时拆成多个明确 subject 的子任务，不用 `general` 假学科混装。

## 学科登记

| Subject | 名称 | 方法论摘要 | 权威源 | 常见产品流 |
|---------|------|------------|--------|------------|
| `yuwen` | 语文 | 语言、文本、文学与表达能力按语文学科宪章组织 | `appfunctor-yuwen/charter.md` | `flashcard_drill`；`classical_chinese`、`reading` 的可用性以 API 为准 |
| `math` | 数学 | ORCST：Object、Relation、Constraint、State、Transform | `appfunctor-math/charter.md` | `flashcard_drill`；`recommended`、`specialized` 的可用性以 API 为准 |
| `english` | 英语 | Native Concept Cognitive Graph 与基础词汇/表达体系 | `appfunctor-english/charter.md` | `flashcard_drill`；`vocabulary`、`reading` 的可用性以 API 为准 |

本表只用于路由，不替代学科宪章，不表示列出的流已经 active。

## 用户输入映射

- `语文`、`中文`、`古文`、`作文` → 通常为 `yuwen`。
- `数学`、`代数`、`几何`、`函数` → 通常为 `math`。
- `英语`、`英文`、`单词`、`语法` → 通常为 `english`。
- `阅读` 可属于 `yuwen` 或 `english`，必须结合上下文确认。
- 只有“试卷”“错题”“课本”不足以确定学科。

## 扩展新学科

新增学科前必须：

1. 在项目宪章登记 subject id 与权威源；
2. 增加路由映射和至少一个歧义案例；
3. 登记适用 Stream，但不把 placeholder 写成 available；
4. 检查 materials 与 learning 两条通用流程无需改变语义；
5. 为学科专属能力新增独立 reference，避免污染通用入口。
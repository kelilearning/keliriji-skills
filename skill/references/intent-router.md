# 意图路由

每次选择一条主流程。路由由“用户目标 + 学科 + 能力状态”共同决定。

## 第一步：确认执行条件

```text
需要调用 API？
  ├─ 否：可解释概念、规划流程或说明产品内路径
  └─ 是：检查 KELIRIJI_API_KEY → GET /health → 检查 scope

任务涉及内容理解、学习或练习？
  ├─ 会话已有明确 subject：继承
  ├─ 用户明确说出学科：映射为 yuwen / math / english
  └─ 仍不明确：只问一次学科，不默认 math
```

## 第二步：选择主流程

| 用户目标 | 流程 | 状态 |
|----------|------|------|
| 注册接入、API Key、401/403、连不上 | [auth.md](auth.md) | available |
| 上传课本/试卷/笔记/图片、提取颗粒、查看任务 | [materials.md](materials.md) | available |
| 查看或检索已有知识颗粒 | [materials.md](materials.md) | available |
| 今天学什么、开始打卡、继续/完成一轮 LEC | [learning.md](learning.md) | available |
| 品题、TTQ、PAS、关系图操作、颗粒工厂、离屏复习 | [extended-capabilities.md](extended-capabilities.md) | planned / limited |

## 学科归一化

| 用户说法 | `subject` |
|----------|-----------|
| 语文、古文、阅读、作文 | `yuwen` |
| 数学、几何、代数 | `math` |
| 英语、单词、英文阅读 | `english` |

“阅读”“素材整理”“复习一下”等表述可能跨学科。若当前会话没有 subject，必须确认，不能只凭题面语言猜测。

## 歧义处理

| 说法 | 处理 |
|------|------|
| “上传这个” | 先确认文件与学科，再走 materials |
| “复习一下” | 确认学科；可查询该学科 Stream 后让用户选择 |
| “出点类似题” | 区分 TTQ 变式、PAS 错因练习和普通 LEC；对应公开 Skills 尚未开放时说明限制 |
| “帮我看看这张答题纸” | 识别为 PAS；不要把普通素材提取冒充 PAS 分析 |
| “离屏给我讲” | 识别 surface/offscreen 目标；转 extended-capabilities 检查入口条件 |
| “把它放进关系图” | 查询可以走 read；写入/拖动/衍生目前不得伪造 endpoint |

## 可串联路径

1. 新素材学习：auth → materials → learning。
2. 已有颗粒复习：auth → learning。
3. 答题反馈：PAS 产品路径 → 公开契约可用后进入专属练习流；当前不回退为普通素材提取。
4. 对话驱动：keliagent 创建带 subject 的会话 → Agent 内部路由本 Skill → 将真实反馈写回学习流。

## 禁止路由

- 未鉴权时不声称已上传、提取、创建 Plan 或提交反馈。
- 未明确学科时不使用 `math` 兜底。
- 不把 PAS 练习题写入 TTQ 诱导题库，反之亦然。
- 不因 Gateway 缺少 endpoint 而直连 AppFunctor、FC 或数据库。
- 不把客户端页面已实现当成 Agent API 已开放。
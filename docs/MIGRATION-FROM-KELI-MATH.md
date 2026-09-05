# 从 keli-math-skills 迁移

`keli-math-skills` 已 deprecated。其数学工作流由本仓库的通用 Skill 与 `math` 学科契约承接。

## 调用方迁移

| 旧配置 | 新配置 |
|--------|--------|
| Skill 名 `kelimath` | Skill 名 `keliriji` |
| 安装目录 `.../skills/kelimath/` | 安装目录 `.../skills/keliriji/` |
| `KELIMATH_API_KEY` | `KELIRIJI_API_KEY` |
| 默认 `subject=math` | 显式 `subject=math` |
| `organize.md` | `materials.md`；TTQ 部分见 `extended-capabilities.md` |
| `review.md` | `learning.md` |
| `pas-practice.md` | `extended-capabilities.md`，等待公开契约 |

## 推荐步骤

1. 安装本仓库 `skill/`，确保 Agent 能发现 `name: keliriji`。
2. 将调用配置改为 `KELIRIJI_API_KEY`；可暂时读取旧变量作为兼容，但不要复制或重发 secret。
3. 所有原数学任务显式加入 `subject=math`。
4. 移除依赖旧文档中未公开 TTQ/PAS endpoint 的自动调用。
5. 运行 `node scripts/validate-skill.mjs`。
6. 验证 Health、`/open/me`、一条素材读取与一条 LEC 查询路径后，再移除旧 Skill 安装。

## 行为变化

- 不再默认数学。缺少 subject 的学习任务会先确认学科。
- API 能力具有 `available`、`limited`、`planned`、`deprecated` 状态。
- 产品中存在但 Gateway 未开放的能力不再给出猜测式 HTTP 步骤。
- 语文、数学、英语共享身份、素材和学习流框架，各自保留学科契约。

## 兼容窗口

迁移期允许宿主将 `kelimath` 触发词转发给 `keliriji` 并设置 `subject=math`。兼容层不得：

- 新建以 `KELIMATH_*` 命名的配置；
- 覆盖用户明确选择的其它学科；
- 调用本仓库标为 planned 的能力；
- 继续分发旧 Skill 作为新安装入口。
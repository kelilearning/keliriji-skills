# 学习流与复习反馈

状态：`available`。前置：[auth.md](auth.md)。建议已有可学习的知识颗粒，见 [materials.md](materials.md)。

正式顶层对象是 `LearningEpisodeStream`、`LearningEpisodeProvider` 和 `LearningEpisodePlan`。Agent 不用 channel、mode 或临时 session 替代这些产品语义。

## 可用契约

| 方法 | 路径 | Scope | 用途 |
|------|------|-------|------|
| `GET` | `/api/v1/open/review/streams` | `read` | 查询当前可用 Stream |
| `GET` | `/api/v1/open/review/mastery-calendar` | `read` | 查询时间范围内的掌握变化 |
| `GET` | `/api/v1/open/review/bookmarks` | `read` | 分页读取收藏卡片 |
| `GET` | `/api/v1/open/review/mastered-particles` | `read` | 分页读取已掌握颗粒 |
| `POST` | `/api/v1/open/review/plans/ensure` | `review` | 确保 Plan 已物化 |
| `GET` | `/api/v1/open/review/plans/ready` | `read` | 读取 Ready Plan |
| `POST` | `/api/v1/open/review/sessions/start` | `review` | 开始学习会话 |
| `POST` | `/api/v1/open/review/sessions/progress` | `review` | 提交过程反馈 |
| `POST` | `/api/v1/open/review/sessions/complete` | `review` | 完成会话 |

请求体、响应和 Stream 可用性以现网公开契约为准，不在本 Skill 固化可能变化的字段。

素材上传、颗粒列表与 Plan ensure/ready 必须显式提供 `subject=yuwen|math|english`；Gateway 不再默认数学。

## L1. 选择学科与 Stream

1. 明确 `subject`，或继承已绑定 subject 的可信会话。
2. 查询 `/review/streams`，只向用户提供该学科当前返回的可用项。
3. 不把数学的 `recommended` / `specialized` 推广到语文或英语。
4. 用户未指定时，可解释各可用 Stream 的目标并让用户选择；不要猜测占位流已激活。

学科与常见流的产品登记见 [subjects.md](subjects.md)，执行时仍以 API 返回为准。

## L2. 取得 Ready Plan

1. 调用 `plans/ensure` 请求物化目标学科与 Stream 的 Plan。
2. 使用 `plans/ready` 查询，不绕过 Ready Store 自行拼卡。
3. 没有 Ready Plan 时，明确处于物化中或当前没有可学习内容。
4. 不以重复 ensure 制造多个并行 Plan。

同一用户的 `(subject, stream)` 同时只应有一条 started 会话。若服务端返回已有会话，恢复它，不新建替代品。

## L3. 开始并推进会话

1. 通过 `sessions/start` 开始服务端确认的 Plan。
2. 每次只呈现当前回合所需内容，接收用户真实回答或反馈。
3. 用 `sessions/progress` 写回事件；失败时保留待提交状态并明确告知，不伪造成功。
4. 用户暂时离开时不调用 complete，也不替用户生成评分。

## L4. 完成

1. 用户完成本轮后调用 `sessions/complete`。
2. 显示服务端返回的总结或下一步，不自行改写为更高掌握度。
3. 需要继续时重新查询 Ready Plan，而不是复用已完成会话。

## L5. 查询学习洞察

- `mastery-calendar` 用 `from`、`to` 和可选 `metric` 查询时间范围内的掌握变化；日期格式与 metric 以公开契约为准。
- `bookmarks` 用 `limit`、`offset` 分页读取用户收藏。
- `mastered-particles` 用 `limit`、`offset` 分页读取已掌握颗粒。
- 三个入口都由 Gateway 强制绑定 API Key 所有者，不接受调用方覆盖 `userId`。
- 这些是只读快照。不要因为列表中没有记录就自动修改掌握状态或取消收藏。

## “推送复习”的含义

在本 Skill 中，“推送”表示选择 subject + Stream、取得 Plan、向用户呈现并完成反馈闭环。它不是营销通知，也不是跳过 Plan 直接修改题库。

## 检查清单

```text
- [ ] subject 已明确
- [ ] Stream 来自该学科当前 API 结果
- [ ] Ready Plan 来自服务端
- [ ] 未创建重复 started 会话
- [ ] progress 是用户真实反馈
- [ ] 用户完成后才调用 complete
- [ ] 洞察查询未被解释为写入或状态变更
```
## L6. 第一方家庭计划对话与下一份 Plan 干预

状态：`limited`，需确认目标 Gateway 已发布以下契约；旧部署不支持时不得执行。

- `GET /api/v1/open/review/coach/evidence`，read：subject、stream、sessionId 均必填。先读取权威 LearnerSession 快照（已存对话、颗粒、教练层、学生层、真实反馈、下一份未消费 Plan）。
- `POST /api/v1/open/review/coach/interventions`，review：同一上下文，加 decisionId、planId、expectedRevision、orderedParticleIds、reason、evidenceRefs。只允许基于 nextPlan 内已有颗粒排序派生新 Plan，其余颗粒保留。新 Plan 插入同一备选队列，返回的新 planId 与 basePlanId 不同。原机械化 Plan 不覆盖、不删除，机械补货照常且派生库存不抵扣保底库存。不修改正在消费的会话，不新增颗粒；无实质改动不入队。
- 第一方受托登录 JWT 仅限这两个路由，Gateway 验证用户，AppFunctor 校验付费学习者绑定。不可用通用环境 API Key 代替当前学生。
- 对话应围绕 currentParticleId；证据缺层时说明局限。不将口述理解为已评分。没有必要调整时继续对话；只有干预返回 applied 才展示新备选已补入。409 重新读取证据，不能盲目覆盖。
- 决策 ID 等于上游幂等 requestId。回流来自权威 LEC feedback，下一轮重新读取。

## L6. 语音复习完成与多端同步（Harness 固定流程）

- 一道题达到本轮要求后，先由服务端写入该学习会话的过程反馈与颗粒完成事件；写入成功后才能确认“已完成、已记录”，随后再引导下一题。
- 单题完成与整轮会话完成分开处理。讨论、打印、暂缓、取消和退出都不代表复习完成。保存失败保留原操作身份重试，不能伪报达标，也不能重复计次。
- 云端已确认的颗粒完成集合是客户端同步依据。Mobile2 将其按用户和远程会话持久化，更新本地待复习题目与数量，并通知首页、学习序列重新读取进度和统计。手机不重复提交云端已经保存的反馈。
- 重复状态、重新进入和旧缓存返回不得恢复该会话已完成的题目；新会话仍允许再次复习同一颗粒。退出颗粒灵果不等待网络请求，后台状态更新不能阻止退出。
- 本 Skill 描述学习流程；写入成功判断、请求去重、缓存投影和界面刷新由 Harness 与客户端代码执行，不依赖大模型临时记住同步指令。

# 素材与知识颗粒

状态：`available`。前置：[auth.md](auth.md)。

本流程适用于语文、数学和英语。开始前确认 `subject`，并将它作为业务上下文传递；不要假设素材天然属于数学。

## 可用契约

| 方法 | 路径 | Scope | 用途 |
|------|------|-------|------|
| `POST` | `/api/v1/open/assets` | `organize` | 创建/上传素材 |
| `GET` | `/api/v1/open/assets/:assetId` | `read` | 查询素材 |
| `POST` | `/api/v1/open/assets/:assetId/extract-particles` | `organize` | 发起颗粒提取 |
| `GET` | `/api/v1/open/jobs/:jobId` | `read` | 查询异步任务 |
| `GET` | `/api/v1/open/knowledge-particles` | `read` | 查询颗粒列表 |
| `GET` | `/api/v1/open/knowledge-particles/:id` | `read` | 查询单个颗粒 |

请求体与响应字段必须以 Gateway 当前 OpenAPI 契约为准。本 Skill 不猜测上传字段、分页参数或 job 状态枚举。

## M1. 确认素材语境

调用前确认：

1. 学科：`yuwen` / `math` / `english`；
2. 素材范围：单张图片、文档或已有 asset；
3. 用户目标：只保存素材，还是继续提取知识颗粒；
4. 是否包含不必要的敏感内容；能裁剪或缩小范围时先最小化。

## M2. 创建素材

1. 使用公开契约创建素材，取得 `assetId`。
2. 若接口返回上传步骤或签名 URL，只按响应要求使用；不记录或复述签名 URL。
3. 通过 `GET /assets/:assetId` 确认素材已归属当前用户且状态可继续。
4. 只有服务端确认后才报告“上传完成”。

素材是用户私有资产。不要将正文复制到日志或其它会话。

## M3. 提取知识颗粒

1. 对目标 `assetId` 调用 `extract-particles`。
2. 若返回异步 `jobId`，使用 `/jobs/:jobId` 查询；尊重服务端重试间隔，不高频轮询。
3. pending/running 时报告“正在处理”，不要提前构造颗粒。
4. completed 后查询知识颗粒，并向用户呈现必要摘要供校对。
5. failed 时保留 asset，报告可操作的错误；不要自动重复创建同一素材。

学科解释由对应学科服务或契约决定。通用 Skill 不自行用数学规则解释语文或英语素材。

## M4. 查询与继续使用

- 列表查询用于定位已有颗粒，避免重复提取。
- 单颗粒查询只返回当前任务需要的字段。
- 需要复习时，将已确认的颗粒交给 [learning.md](learning.md) 的 Plan 流程。
- 需要关系图、TTQ 或 PAS 时先检查 [extended-capabilities.md](extended-capabilities.md) 的开放状态。

## 检查清单

```text
- [ ] subject 已明确
- [ ] 已使用最小权限 Key
- [ ] 素材范围与用户目标已确认
- [ ] assetId 来自服务端真实响应
- [ ] 异步任务达到 completed 后才查询结果
- [ ] 颗粒关键内容已让用户校对
- [ ] 未泄露上传签名、令牌或无关私有正文
```
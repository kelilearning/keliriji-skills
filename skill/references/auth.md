# 鉴权与通路诊断

## 目标

Agent 使用颗粒日记 OpenAPI Skills Gateway 的 API Key 调用 `/api/v1/open/*`。用户登录 JWT 仅用于管理自己的 API Key，不能作为 Agent 长期凭证。

## 服务与凭证

| 用途 | 入口 | 凭证 |
|------|------|------|
| Gateway | `https://skills.keliriji.com` | API Key |
| Key 管理 | `/api/v1/developer/keys` | 用户登录 JWT |
| Open API | `/api/v1/open/*` | `Authorization: Bearer $KELIRIJI_API_KEY` |

新集成使用 `KELIRIJI_API_KEY`。迁移期工具可以读取旧的 `KELIMATH_API_KEY`，但应提示迁移，且不得同时发送两个凭证。

## 创建与保存 Key

1. 用户在颗粒日记官方客户端或网站登录，取得自己的用户会话。
2. 使用用户 JWT 调用 `POST /api/v1/developer/keys`，按当前任务选择最小 scopes。
3. 完整 secret 只显示一次，立即存入调用平台的密钥库或本地环境变量 `KELIRIJI_API_KEY`。
4. 调用带 Key 的 `GET /health`，再调用 `GET /api/v1/open/me` 完成业务验活。

API Key 不能调用 developer keys CRUD。创建、列表、启用、禁用、永久删除和轮换均要求用户登录 JWT。

## Health 诊断顺序

| 请求 | 用途 |
|------|------|
| `GET /health/live` | 只检查 Gateway 进程是否存活 |
| `GET /health` | 检查数据库、AppFunctor 与服务令牌 |
| `GET /health` + API Key | 同时检查 Key 状态、scopes 和委托会话 |
| `GET /api/v1/open/me` + API Key | 验证 read scope 与业务代理链路 |

处理失败时按顺序判断：

1. `/health/live` 失败：Gateway 不可达，不继续业务请求。
2. `/health` 返回 degraded/error：报告对应上游检查，不直连上游绕过。
3. Key 无效、禁用或过期：让用户启用、轮换或新建 Key。
4. Key 有效但 403：缺少当前 endpoint 的 scope，按最小权限补发新 Key。
5. delegated session 失败：这是 Gateway 到 AppFunctor 的委托链路问题，不要求用户暴露账户密码。

## Scope 速查

| Scope | 当前用途 |
|-------|----------|
| `read` | `/open/me`、素材/KP/job 查询、Stream 与 Ready Plan 查询 |
| `organize` | 创建素材、发起知识颗粒提取 |
| `review` | 确保 Plan、开始/推进/完成学习会话 |

具体 scope 以 Gateway 当前公开契约为准。不要为 planned 能力预造 scope 名称。

## 安全规则

- 不要求用户把完整 Key 粘贴到对话中；让用户在其工具或环境中设置。
- 不回显 Authorization header，即使是调试输出。
- Key 轮换后停止使用旧 Key。
- 永久删除、批量禁用或轮换前确认目标 key prefix。
- 不使用 API Key 管理其他 API Key。
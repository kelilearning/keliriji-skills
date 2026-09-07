# keliagent 集成

`keliagent` 是 `keliriji` Skill 当前最直接的运行时消费者。Skill 以本地、版本化、只读组件的方式随 keliagent 部署，不在用户会话期间从 GitHub 下载。

## 组件位置

```text
keliagent/
  canon/                    # L0/L1/L2，方法论与学科知识
  skills/keliriji/          # Skills 层，本仓库 skill/ 的安装快照
    SKILL.md
    references/
    manifest.json
```

Skill 与 Canon 必须分开：Canon 回答“依据什么学”，Skill 回答“允许调用什么、如何执行、失败时怎么办”。

## 更新链路

```text
keliriji-skills/skill
  → keliagent npm run sync-skills
  → 原子复制 + 文件 SHA-256 + 整体 contentDigest
  → npm run validate-skills
  → npm run build
  → 随部署包进入 /opt/keliagent/skills/keliriji
```

规则：

1. 有同级权威源仓时，发布前同步；无源仓的单仓 CI 使用已经提交并校验的本地快照。
2. 内容未变化时不重写 manifest，避免同步时间制造伪版本。
3. 构建与启动前校验 manifest；缺文件、哈希不一致或名称错误时失败。
4. 运行时只读本地文件并做进程内缓存，不请求 GitHub。
5. 更新通过新 keliagent 部署生效；运行中的会话不热替换 Skill 语义。
6. 回滚 keliagent 时同时回滚 Skill 快照，保证执行器与说明一致。

## 运行时装载

Coordinator 先按 `skillAllowlist` 和用户意图选择能力。Pi 每轮加载：

1. `SKILL.md` 总约束；
2. `references/subjects.md`；
3. 已选能力对应的 reference，例如 review 加载 `learning.md`；
4. LearnerSession 与当前学科 L0/L1/L2。

未选中的 reference 不加载，控制上下文长度。确定性执行器与 Pi 使用同一 allowlist，但实际 HTTP 能力仍以 Gateway OpenAPI 契约为准。

## 三方一致性

执行一个能力必须同时满足：

| 层 | 决定什么 |
|----|----------|
| keliagent `skillAllowlist` | 当前运行实例是否允许选择该能力 |
| 本地 `skills/keliriji` | 工作流、学科、隐私和降级规则 |
| Gateway `/openapi.json` | endpoint、方法、参数和 scope 是否真实可用 |

任一层缺失时不得调用。产品页面存在不等于 OpenAPI 已开放。

## 运维检查

```bash
npm run sync-skills
npm run validate-skills
npm run build
curl http://127.0.0.1:5620/health
curl http://127.0.0.1:5620/api/v1/skills
```

诊断接口应返回 Skill 名称、来源、同步时间、文件数和 `contentDigest`。不得返回 Skill 文件全文、API Key 或其它凭证。
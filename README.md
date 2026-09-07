# keliriji-skills

颗粒日记官方 Agent Skills 仓库。它面向整个颗粒日记系统，以统一 API Key 和 OpenAPI Skills Gateway 组织素材、知识颗粒、学习流及学科扩展能力。

> `keli-math-skills` 已进入 deprecated 阶段。新的技能安装、文档和功能扩展统一在本仓库进行；数学作为 `math` 学科插件继续支持。

## 入口

- 项目最高约束：[CHARTER.md](CHARTER.md)
- Agent Skill：[skill/SKILL.md](skill/SKILL.md)
- 能力与服务边界：[docs/DOMAIN-MAP.md](docs/DOMAIN-MAP.md)
- 实施路线：[docs/ROADMAP.md](docs/ROADMAP.md)
- 旧技能迁移：[docs/MIGRATION-FROM-KELI-MATH.md](docs/MIGRATION-FROM-KELI-MATH.md)
- keliagent 集成：[docs/KELIAGENT-INTEGRATION.md](docs/KELIAGENT-INTEGRATION.md)

## 当前能力

| 能力 | 状态 | 说明 |
|------|------|------|
| API Key 与通路诊断 | available | 创建、轮换、禁用、Health、委托会话检查 |
| 素材与知识颗粒 | available | 上传素材、发起提取、查询任务与颗粒 |
| LEC 学习流与学习洞察 | available | Stream、Plan、会话、掌握日历、收藏与已掌握颗粒 |
| 品题、PAS、关系图写入、颗粒工厂、OSR | planned / limited | 产品能力存在，等待各自公开 Skills 契约补齐 |

状态以 Skills Gateway 的公开契约为准，不以客户端是否已有页面为准。

## 凭证

新集成统一使用环境变量：

```text
KELIRIJI_API_KEY=...
```

完整 Key 只在创建或轮换时显示一次。不要将 Key、JWT、服务令牌或签名 URL 写入本仓库。

## 维护原则

1. 先改宪章，再改变能力边界。
2. 通用流程放在 L0，学科差异放在 L1，用户任务工作流放在 L2。
3. `yuwen`、`math`、`english` 都是一等学科；未知学科不得静默回退到数学。
4. 只为已验证的公开 endpoint 提供可执行步骤。

## 校验

```bash
node scripts/validate-skill.mjs
```

校验器默认从同级 `appfunctor-openapi-skills-gateway/src/openapi.json` 读取公开契约。仓库不相邻时，通过 `KELIRIJI_OPENAPI_PATH` 指向该文件。

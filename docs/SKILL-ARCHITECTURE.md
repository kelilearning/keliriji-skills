# Skill 架构

## 安装单元

`skill/` 是 Agent 平台的安装单元：

```text
skill/
  SKILL.md
  references/
    auth.md
    intent-router.md
    subjects.md
    materials.md
    learning.md
    extended-capabilities.md
    glossary.md
```

根目录 `docs/` 用于人类设计与治理，不要求每轮加载。

## Progressive Disclosure

| 场景 | 必读 | 按需 |
|------|------|------|
| 首次接入、401/403 | `SKILL.md`、`auth.md` | `glossary.md` |
| 上传与提取 | `SKILL.md`、`materials.md` | `subjects.md` |
| 开始学习流 | `SKILL.md`、`learning.md` | `subjects.md` |
| TTQ/PAS/OSR/工厂 | `SKILL.md`、`extended-capabilities.md` | `glossary.md` |
| 意图或学科不清 | `intent-router.md` | `subjects.md` |

## 内容分层

- `SKILL.md`：触发词、硬约束、最短路由、能力状态。
- `references/`：Agent 执行时需要的流程、契约与边界。
- `docs/`：架构、治理、迁移与路线图。
- `scripts/`：结构与安全校验，不承载业务调用。

## 平台约定

兼容支持“一个目录 + `SKILL.md` + 相对 references”的 Agent 平台。安装时目录名建议使用 `keliriji`，不要继续创建新的 `kelimath` 安装。

Skill 名 `keliriji` 是稳定公开标识。学科通过运行时 `subject` 选择，不拆成三个互相复制的顶层 Skill。

## 版本纪律

1. 文档-only 修订可以保持兼容。
2. endpoint、scope 或状态升级必须验证 Gateway 契约。
3. 删除路由、重命名 Skill 或改变 subject id 属于破坏性变更，需要迁移说明。
4. 旧 `kelimath` 触发可在迁移期映射到 `keliriji` + `subject=math`，但不得永久形成第二入口。
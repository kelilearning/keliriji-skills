# 实施路线图

## Phase 0：宪章与边界

- [x] 确立颗粒日记全系统定位和三层能力模型。
- [x] 登记 `yuwen`、`math`、`english` 三学科与权威源。
- [x] 定义能力成熟度、隐私、接口和弃用规则。

## Phase 1：可用 Skill 基线

- [x] 建立 `keliriji` 总入口与 Progressive Disclosure。
- [x] 建立 API Key / Health / scope 诊断。
- [x] 建立素材、提取、KP 查询工作流。
- [x] 建立 Stream、Ready Plan、学习反馈工作流。
- [x] 开放掌握日历、收藏与已掌握颗粒的只读学习洞察。
- [x] 建立扩展能力边界与旧数学 Skill 迁移说明。
- [x] 增加结构、链接、endpoint 与安全残留校验。
- [x] 作为版本化本地组件集成到 keliagent，并建立同步、digest、部署和回滚规范。

## Phase 2：Gateway 契约补齐

- [x] 发布 OpenAPI 3.1 机器契约并替代 Skill 校验器的人工 allowlist。
- [ ] 开放关系图读取、标注、衍生与写入契约。
- [ ] 开放 TTQ / CTTQ / IPTTQ 契约，并保留学科适用范围。
- [ ] 开放 PAS 上传、绑定、证据分析与练习调度契约。
- [ ] 开放收藏与掌握状态写入、备注及其它学情能力。

每个 endpoint 上线必须定义 scope、self 边界、幂等性、错误码与审计字段。

## Phase 3：对话与离屏能力

- [ ] 定义第三方 Agent 是否以及如何创建 keliagent 会话。
- [ ] 冻结 `subject`、`surface` 与 LearnerSession 委托规则。
- [ ] 为 OSR 提供不暴露内部库存的公开任务契约。
- [ ] 增加有屏/离屏切换、失败恢复和反馈回流示例。

## Phase 4：商业与完整产品扩展

- [ ] 与 AppFactory 定义颗粒工厂查询、报价和建单边界。
- [ ] 对高影响操作增加显式确认与审计规范。
- [ ] 增加多学科组合任务，但保持每个子任务 subject 明确。
- [ ] 建立真实契约测试和示例对话评测集。

## 发布门槛

每次将能力提升为 `available` 前必须：

1. 公开契约已部署并通过 Health；
2. self、scope、幂等与错误恢复已验证；
3. 对应 reference 和域地图已更新；
4. 校验脚本通过；
5. 至少覆盖三学科适用性或明确标注学科限制。
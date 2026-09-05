# 术语表

| 术语 | 含义 |
|------|------|
| Asset / 素材 | 用户上传或保存的学习来源，是私有对象 |
| KP / 知识颗粒 | 从素材或学习过程沉淀出的可引用学习单元 |
| 素材关系图 | 素材、颗粒及其衍生关系的主工作面 |
| LEC | LearningEpisode 的卡片/序列呈现语境 |
| LearningEpisodeStream | 学习目标与候选组织方式，如打卡、专项或阅读 |
| LearningEpisodeProvider | 为 Stream 物化 Plan 的服务角色 |
| LearningEpisodePlan | 一轮可执行的学习安排 |
| Ready Store | 已物化、可被客户端或 Agent 读取的 Plan 存储语义 |
| TTQ / 品题 | 围绕题目或颗粒进行聚合、比较、变式与能力识别的产品域 |
| CTTQ | 品题的收敛表示，用于减少重复学习负担；不是删除源颗粒 |
| IPTTQ / 品题智能体 | 品题域中的浓缩与诱导题能力；不等于通用聊天 Agent |
| PAS / 实战答题纸 | 将真实书写证据与源颗粒关联的实战反馈对象 |
| OSR | Off-Screen Recap，离屏复习域 |
| Shard / Topic | OSR 内部组织的复习片段与主题对象，按用户私有数据处理 |
| LearnerSession | Runtime 装载的用户学习上下文，不是对话临时文本的别名 |
| subject | 稳定学科标识：`yuwen`、`math`、`english` |
| surface | 交互表面，如 `screen` 或 `offscreen`；不改变业务数据所有权 |
| Skills Gateway | Agent 唯一公开业务调用入口，代表用户建立委托会话 |

## 命名纪律

- 对用户说“品题智能体”“实战答题纸”，内部缩写只用于契约和诊断。
- 不用 session 泛指 Plan、Stream 或 LearnerSession。
- 不把“推送复习”解释成营销通知。
- 不把所有练习统称为 PAS；只有具有答题纸证据与源题绑定的流程才是 PAS。
- 不把学科名省略为默认数学。
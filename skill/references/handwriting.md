# 方正楷体练字纸

状态：limited。此接口属于受信 AppFunctor，不是 Open Gateway API Key 契约；宿主需提供 AppFunctor 地址和用户登录身份。没有该入口时引导用户在 Mobile2 生成，不把 API Key 当作 App 登录凭证。

- 学科为 `yuwen`，根据用户明确选定的字或听写稿准备 `characters`；每项一个汉字，1–240 项，保留练习顺序。
- `code` 使用当前学习页的真实数字编号（4–12 位）；未知时通过现有学习页流程取得，不编造绑定到用户学习记录的编号。
- `POST /api/revision/handwriting-pdf`，JSON：`{"code":"真实学习编号","characters":["中","文"]}`。携带宿主提供的登录身份，成功返回 `application/pdf` 二进制；保存为 PDF 再呈现，不把响应当 JSON。
- PDF 由 API 使用 OSS 上的方正楷体 `FZKai-Z03S` 生成。字体资源由 `GET /api/revision/print-font/handwriting` 返回短效签名 URL、字库索引 URL 和版本；不要把签名链接写进长期技能配置。
- 每个字一个示范格、两个仿写格，A4 每页 16 组。字体缺字或加载失败时报告失败，不用 LXGW、系统楷体或模型生成的字形替代。
- 生成 PDF 不代表已经打印、出纸或完成学习。只有用户要求打印时才提交打印流程。

# 实验室安全管理系统 · Web 管理控制台

中国地质大学（北京）材料科学与工程学院 · 实验室安全管理 demo · 学院 HSE 管理控制台

## 本仓库 (admin web)

- 今日待办 / 事件中心 / 指挥大屏
- 实验室台账 / 人员档案 / 危化品资产
- 统计与报表 / 规则与设置 / 关于系统

## 配套页面

- **微信小程序** demo: https://yaron9.github.io/lab-safety-mp/
- **电子门牌** demo: https://yaron9.github.io/lab-safety-doorplate/

## 本地运行

```sh
python3 -m http.server 8734
open http://localhost:8734/
```

## 技术栈

React 18 UMD + Babel standalone + 单一 styles.css，无构建工具，开箱即跑。

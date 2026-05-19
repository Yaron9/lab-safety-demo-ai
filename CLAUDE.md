# 实验室安全管理系统 demo

中国地质大学（北京）材料科学与工程学院 · 三端联动的实验室安全 demo（演示用，非生产）。
所有数据 mock，所有 dept/student 名都虚构。

## 必读指针（按这个顺序读）

- @.impeccable.md — design context（品牌、调性、anti-references）
- @README.md — 三端 URL + 各端能力清单（也是甲方拿到的版本说明）
- `/Users/yaron/.claude/projects/-Users-yaron-AGI-lab-safety-demo/memory/MEMORY.md` — 累积的用户反馈和偏好

## 三端结构

| 路径 | 端 | 入口文件 |
|---|---|---|
| `/` | **Portal 导航页**（三端入口） | `index.html`（纯 HTML/CSS，无 JS，~240 行 inline style，按 `.impeccable.md` 调性） |
| `/admin/` | Web 管理控制台 | `admin/index.html` + `admin/page-*.jsx` + `admin/shell.jsx` + `admin/styles.css` + `admin/mock.js` |
| `/mp-demo/` | 微信小程序（H5 模拟，不上微信审核） | `mp-demo/index.html` + `mp-demo/page-*.jsx` + `mp-demo/components.jsx` + `mp-demo/styles.css` |
| `/doorplate/` | 电子门牌（1080×1920 竖屏 kiosk） | `doorplate/index.html` + `doorplate/door-display.css`（独立目录，10 状态切换 · 含 `?mode=inspect`） |
| `/lib/` | **三端共享单一来源** | `lib/scoring-rules.js`（IIFE 暴露 `window.SCORING`：5 类 40 条规则 + tally/verdict/currentPeriod 等纯函数 + localStorage 持久化） · `lib/policy-text.json`（PDF OCR 切片 20 段，构建期由 `scripts/ocr-policy.sh` 一次性产出） · `lib/assistant/`（admin 端浮动 AI 助手 · chat-widget.jsx + styles-assistant.css · 前端直连 DeepSeek-V4 + localStorage key） |

`admin/mock.js` 是 admin 唯一数据源；`mp-demo/mock.js` 是小程序自己的；门牌的 LAB/SCENES 内联在 `doorplate/index.html` 里。三端 `today` 必须同步到 `'2026-04-21'`（已是当前基准）。

> Portal 存在的原因：EdgeOne 国内默认域名是 3 小时 token 预览链接，给甲方一个唯一入口最干净。Cookie 落到 `*.edgeone.cool` 域名后，三端在 3 小时内任意切换都不用重新认证。

## 硬约束（违反会被骂）

1. **不要改字体栈** — admin 用 Inter+PingFang，mp 和门牌用 system PingFang，已经定调。`--font` / `--font-num` 是 CSS 变量，沿用就行。
2. **数据全部反算自 MOCK，不许 hardcode 字符串数值**（如 "98%"/"60%"/"响应中" 这种）。每个数字都要能从 `MOCK.labs/events/people/accessFlow` 推出来。
3. **扣分相关数字必须从 `lib/scoring-rules.js` 反算** — 不许 UI 内 hardcode "扣 X 分"。事件/违规只存 `ruleIds`，UI 拼分值走 `SCORING.tally()`；档位走 `SCORING.verdict(pts, 'person'|'lab')`；当前周期走 `SCORING.currentPeriod(MOCK.today)`。规则即数据，新增/调档只改 `lib/scoring-rules.js`。
4. **状态三档**：正常 / 关注 / 预警（lab.status: `'normal'|'warning'|'rectifying'`）。不要 高危/中危/低危/严重隐患/需关注异常 这套。聚合统计沿用 `rectifying>0 → 预警；warnCount>0 → 关注；其余 → 正常` 的口径。
5. **大屏指挥页（`page-bigscreen.jsx`）的「安全实时监控」必须保留 `conic-gradient` 旋转扫描臂**（动态雷达 sweep）— 这是用户领导喜欢的视觉锚点。不要换成静态分层仪表。
6. **系名只用 4 个**（中国地大材料学院实际结构）：材料化学系 / 材料物理系 / 材料工程系 / 测试中心。
   - **教师姓名**保留虚构：赵振华 / 周景明 / 钱雨桐 / 王玉鸿 / 李雪茹 等。
   - **`lab.lead` 是系级实验室管理员**（不是教师）：周建国 / 刘卫平 / 黄文明 / 王宝华。两套人名各司其职，不要混用。
7. **角色术语**：「巡查员」一律改为「实验室管理员」；流程角色叫「教师审核」（不是"导师审核"）；学生关联字段 `student.advisor` 仍叫"导师"。
8. **改样式文件后 bump cache 版本号**：`index.html` 里 `?v=N` 全部 +1（admin/mp-demo/doorplate 各自一组），否则浏览器读旧版（甲方没 hard refresh 习惯）。

## 部署

GitHub repo: https://github.com/Yaron9/lab-safety-demo

| 镜像 | 角色 | URL | 触发 |
|---|---|---|---|
| GitHub Pages | 海外兜底（永久保留） | https://yaron9.github.io/lab-safety-demo/ | `.github/workflows/pages.yml` ~17s |
| EdgeOne Pages | **国内主力 · 演示前手动跑** | `https://lab-safety-demo-<slug>.edgeone.cool?eo_token=...&eo_time=...`（每次部署新 URL · 3 小时窗口） | `.github/workflows/edgeone.yml` push 触发；演示前本地手跑 `npx edgeone pages deploy` 拿新预览 URL |

**国内只能走 EdgeOne 预览链接**——GitHub Pages 默认域名被 GFW 处理；EdgeOne 国内合规要求默认域名只发 3 小时 token 链接（不绑自定义域名 + 备案就这样）。完整运维步骤、演示前 SOP、回滚见 [docs/deploy-mirror.md](docs/deploy-mirror.md)。

### 给甲方拿新 URL（用户说"拿新链接 / 重新部署 / 演示前 / 给甲方"时直接跑，不要问）

凭证已在 macOS Keychain（`-s tencent-cloud-cli -a EDGEONE_API_TOKEN`），以下命令一气呵成：

```sh
cd /Users/yaron/AGI/lab-safety-demo && \
  TOKEN=$(security find-generic-password -a EDGEONE_API_TOKEN -s tencent-cloud-cli -w) && \
  yes "" | npx -y edgeone pages deploy . -n lab-safety-demo -t "$TOKEN" -e production -a global 2>&1 | tail -5
```

输出末尾的 `EDGEONE_DEPLOY_URL=https://lab-safety-demo-XXXXXXXX.edgeone.cool?eo_token=...&eo_time=...` 就是新链接（带完整 query string，3 小时窗口）。直接发给用户，让他转给甲方/打二维码。

### 本地凭证（macOS Keychain）

`~/.claude` 不存任何密钥；以下 secrets 都在 macOS Keychain，按 service `tencent-cloud-cli` 检索：

```sh
# 取 EdgeOne Pages API Token（CI/CD 用，控制台 → Pages → API Token 生成）
security find-generic-password -a EDGEONE_API_TOKEN -s tencent-cloud-cli -w

# 取腾讯云 CAM 凭证（如果以后接 COS/CDN 等）
security find-generic-password -a TENCENTCLOUD_SECRET_ID -s tencent-cloud-cli -w
security find-generic-password -a TENCENTCLOUD_SECRET_KEY -s tencent-cloud-cli -w

# 写入新值
security add-generic-password -a <KEY> -s tencent-cloud-cli -w "<value>" -U
```

> ⚠️ 本仓库当前的 CAM 凭证（SecretId/Key）是主账号 root 权限，仅供一次性测试。**Demo 跑通后去 https://console.cloud.tencent.com/cam/capi 把这对禁用/删除**，避免聊天 transcript 泄露。EdgeOne API Token 才是 CI/CD 长期用的那个。

```sh
# 本地预览
python3 -m http.server 8734
open http://localhost:8734/

# 部署后验证
curl -sI https://yaron9.github.io/lab-safety-demo/ | head -1
gh run list -R Yaron9/lab-safety-demo --limit 1
```

## 已建立的工作模式

- **设计大改用 worktree** — 不确定方向的视觉/结构改动开 `git worktree add` 到 `../lab-safety-demo-XYZ`，并起独立端口（8735）对照 main 的 8734。确认了再 ff merge。已删过 `radar` 分支的 worktree。
- **设计 skill 使用** — `/impeccable craft` 走完整流程（先读 `.impeccable.md` 上下文）。带具体硬约束 brief，不要让 skill 重新发挥。
- **UI 改完用 Playwright 自审** — 见 `memory/feedback_review_before_handoff.md`。
- **AI 助手 key 走 localStorage** — admin 的浮动助手前端直连 DeepSeek，API key 只存浏览器 `localStorage['lab-safety-assistant-deepseek-key']`，不进仓库不上传服务器。本地开发用 `security find-generic-password -a DEEPSEEK_API_KEY -s tencent-cloud-cli -w` 取出粘进浏览器；演示前跑 `bash scripts/assistant-smoke.sh` 验证 key + CORS + 模型路由。

## 不要做的

- 不要做真微信小程序（用户已经决定用 H5 模拟，发给甲方扫码即可）。
- 不要再追问"高危/中危/低危"那套术语。
- 不要给状态卡加边框左侧色条（border-left > 1px 是 AI slop）— 见 `.impeccable.md` 的 absolute_bans。

## 完整改动历史

`git log --oneline` — 已经按 conventional commit 写得比较清楚，需要追溯就直接看 git。

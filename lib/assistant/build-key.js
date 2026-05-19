/* 占位 · 本地预览时为空 · CI 部署到 preview repo（lab-safety-demo-ai）时会被 sed 替换为 window.BUILT_IN_KEY='sk-...'
 *
 * 安全模型：GitHub Pages 公开站点 = 任何放进 build 的 key 都会被访客 view-source 看到。
 * 当前 demo 妥协接受公开 key（用 DeepSeek 额度上限控制风险）。如果以后要藏 key，参考
 * docs/upgrade-plan-v3-ai-assistant.md 的 SCF / Cloudflare Workers / EdgeOne Edge Function 三选一。
 *
 * 加载顺序：admin/index.html 在 chat-widget.jsx 之前引入本文件。chat-widget 优先读 window.BUILT_IN_KEY，
 * 没有则 fallback 到 localStorage（本地开发路径）。
 */
window.BUILT_IN_KEY = '';

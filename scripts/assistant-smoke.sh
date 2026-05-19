#!/usr/bin/env bash
# assistant-smoke.sh · 演示前一键连通验证（不含答案质量校验，那需要浏览器跑）
# 1. CORS preflight  2. 真实 chat 调用  3. usage / 缓存命中率
# 依赖：macOS Keychain 里有 DEEPSEEK_API_KEY · 见 README

set -euo pipefail
cd "$(dirname "$0")/.."

KEY=$(security find-generic-password -a DEEPSEEK_API_KEY -s tencent-cloud-cli -w 2>/dev/null || true)
if [ -z "$KEY" ]; then
  echo "❌ keychain 里没有 DEEPSEEK_API_KEY"
  echo "   提示：security add-generic-password -a DEEPSEEK_API_KEY -s tencent-cloud-cli -w \"<sk-...>\" -U"
  exit 1
fi

echo "→ [1/3] CORS preflight（确认 GitHub Pages 上前端可直连）"
CORS=$(curl -sI -X OPTIONS https://api.deepseek.com/chat/completions \
  -H "Origin: https://yaron9.github.io" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  | grep -i "access-control-allow-origin" || true)
if [ -z "$CORS" ]; then
  echo "❌ CORS preflight 失败"
  exit 1
fi
echo "   ✓ $(echo "$CORS" | tr -d '\r')"

echo "→ [2/3] 真实 chat 调用（最小 prompt，验证 key + 模型路由）"
RESP=$(curl -sN https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $KEY" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"用 12 字介绍自己"}],"stream":false}')

python3 - <<PY
import sys, json
data = json.loads('''$RESP''')
if 'error' in data:
    print('   ❌', data['error'])
    sys.exit(1)
print('   ✓ model =', data.get('model'))
print('   ✓ reply =', data['choices'][0]['message']['content'])
u = data.get('usage', {})
print('   usage: prompt={prompt_tokens}  cached={prompt_cache_hit_tokens}  completion={completion_tokens}'.format(**{
    'prompt_tokens': u.get('prompt_tokens'),
    'prompt_cache_hit_tokens': u.get('prompt_cache_hit_tokens', 0),
    'completion_tokens': u.get('completion_tokens'),
}))
PY

echo "→ [3/3] 知识库文件就位检查"
for f in lib/policy-text.json lib/scoring-rules.js admin/mock.js mp-demo/mock.js; do
  if [ -f "$f" ]; then
    echo "   ✓ $f ($(wc -c < "$f" | tr -d ' ') bytes)"
  else
    echo "   ❌ 缺失 $f"
    exit 1
  fi
done

echo ""
echo "✓ smoke pass · 完整知识库 + 4 题答案质量请打开 http://localhost:8735/admin/ 手动复跑"

#!/usr/bin/env bash
# ocr-policy.sh · 把 docs/ 下的扣分细则 PDF 转 markdown，再切片成 lib/policy-text.json
# 调用：bash scripts/ocr-policy.sh
# 依赖：markitdown（pip install 'markitdown[all]'）、node ≥ 18

set -euo pipefail
cd "$(dirname "$0")/.."

PDF="docs/实验室违规扣分细则及处理办法（试行）讨论试行.pdf"
TMP="/tmp/policy.md"
OUT="lib/policy-text.json"

if [ ! -f "$PDF" ]; then
  # worktree 里 PDF 可能未入仓；回退到 main 工作目录
  ALT="/Users/yaron/AGI/lab-safety-demo/$PDF"
  if [ -f "$ALT" ]; then
    PDF="$ALT"
  else
    echo "❌ PDF 不存在：$PDF" >&2
    exit 1
  fi
fi

echo "→ OCR $PDF → $TMP"
markitdown "$PDF" -o "$TMP"

echo "→ slice → $OUT"
node scripts/slice-policy.mjs "$OUT"

echo "✓ done"

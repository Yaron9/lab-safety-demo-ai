#!/usr/bin/env node
/* slice-policy.mjs · 把 markitdown OCR 出来的 /tmp/policy.md 切片成 lib/policy-text.json。
 * 切片规则：
 *   - 按"第X条"边界切（一 ～ 十八条）
 *   - 标题前的段落归入 { section: '前言' }
 *   - 第十八条尾随的"附件 1 表格"独立成一节，并标注详细 40 条数据见 SCORING.RULES
 * 用法：node scripts/slice-policy.mjs <out-json>   默认输出 lib/policy-text.json
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/tmp/policy.md';
const OUT = process.argv[2] || path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'lib', 'policy-text.json');

const md = fs.readFileSync(SRC, 'utf8');
const lines = md.split('\n');

const sectionRe = /^第[一二三四五六七八九十]+条/;
const sections = [];
let cur = null;

for (const line of lines) {
  if (sectionRe.test(line)) {
    if (cur) sections.push(cur);
    cur = { section: line.trim().split(/\s+/).slice(0, 1)[0], text: line.trim() };
  } else if (cur) {
    cur.text += '\n' + line;
  } else {
    if (sections.length === 0) sections.push({ section: '前言', text: '' });
    sections[0].text += '\n' + line;
  }
}
if (cur) sections.push(cur);

// 附件 1 从最后一条尾部拆出
const last = sections[sections.length - 1];
const attachIdx = last.text.search(/实验室安全违规行为及记分标准|附件 ?1/);
if (attachIdx !== -1) {
  const main = last.text.slice(0, attachIdx).trim();
  const attachment = last.text.slice(attachIdx).trim();
  last.text = main;
  sections.push({
    section: '附件 1 · 违规行为及记分标准表',
    text: attachment,
    note: '附件 1 详细 40 条规则已结构化进 lib/scoring-rules.js 的 RULES 数组；本节是 PDF 原文表格的 OCR 文本，可作为答案出处引用。',
  });
}

// 清理空白
for (const s of sections) {
  s.text = s.text.trim().replace(/\n{3,}/g, '\n\n');
}
const cleaned = sections.filter(s => s.text.length > 0);

fs.writeFileSync(OUT, JSON.stringify(cleaned, null, 2));
const bytes = fs.statSync(OUT).size;
console.log(`Wrote ${cleaned.length} sections → ${OUT} (${bytes} bytes)`);
for (const s of cleaned) {
  const len = s.text.length;
  console.log(`  ${s.section.padEnd(8)} ${String(len).padStart(5)} chars`);
}

/* AI 助手浮窗 · 阶段 A · Step 4：前端直连 DeepSeek + 三层知识库注入
 *
 * 架构（用户指令 2026-05-19）：跳过腾讯云 SCF，纯前端直连 api.deepseek.com（CORS 已验证）。
 * 安全模型：API key 只存浏览器 localStorage（key='lab-safety-assistant-deepseek-key'），不进仓库。
 *
 * System prompt 三层（v3.2 第 3.2 节）：
 *   1. 角色 + 硬约束（口算禁令、必须引规则号、不超 mock）
 *   2. SCORING.RULES + 处置阈值（来自 window.SCORING）
 *   3. 简化 MOCK（labs/events/people 主字段，去掉冗余）+ policy-text.json 全文
 *
 * 暴露：window.AssistantWidget
 */

const LS_KEY = 'lab-safety-assistant-deepseek-key';
const API_URL = 'https://api.deepseek.com/chat/completions';
const MODEL = 'deepseek-chat'; // 实际指向 deepseek-v4-flash

const SUGGESTIONS = [
  '302 实验室现在什么状态？',
  '未戴护目镜扣几分？',
  '实验室扣到 60 分会怎么样？',
  '现在记分周期还剩多久？',
];

/* ─── system prompt 构造 · 见 v3.2 文档第 3.2 节 ─────────────────────── */

/** 把 MOCK 精简为 LLM 可消化的扁平结构。去掉 hazardSources 详细 PPE、
 *  events.actors 字符串、训练 timeline 等次要字段，保留答题需要的核心字段。 */
function simplifyMock(MOCK) {
  if (!MOCK) return {};
  const labs = (MOCK.labs || []).map(l => ({
    id: l.id, name: l.name, dept: l.dept, lead: l.lead,
    status: l.status, level: l.level,
    inRoom: l.inRoom, capacity: l.capacity,
    temp: l.temp, humidity: l.humidity,
    hazards: l.hazards, note: l.note, deadline: l.deadline,
    nextInspection: l.nextInspection,
    labViolations: l.labViolations || [],
  }));
  const events = (MOCK.events || []).map(e => ({
    id: e.id, kind: e.kind, severity: e.severity, lab: e.lab,
    time: e.time, title: e.title, detail: e.detail, status: e.status,
    ruleIds: e.ruleIds, multiplier: e.multiplier,
    subjectPersonId: e.subjectPersonId, counter: e.counter,
  }));
  const people = (MOCK.people || []).map(p => ({
    id: p.id, name: p.name, role: p.role, dept: p.dept,
    labs: p.labs, training: p.training,
    personalViolations: p.personalViolations || [],
    advisor: p.advisor,
  }));
  return { today: MOCK.today, me: MOCK.me, labs, events, people };
}

/** 构造完整 system prompt 内容 · ~15K tokens。 */
function buildSystemPrompt(policyText) {
  const SCORING = window.SCORING;
  const MOCK = window.MOCK;
  const today = MOCK && MOCK.today;

  const periodInfo = SCORING && today ? SCORING.currentPeriod(today) : null;
  const periodLabel = periodInfo ? periodInfo.label : '未知';
  const periodEnd = periodInfo ? periodInfo.end : '';

  const rulesJson = SCORING ? JSON.stringify(SCORING.RULES, null, 0) : '[]';
  const tiersJson = SCORING ? JSON.stringify({
    person: SCORING.PERSON_THRESHOLDS,
    lab: SCORING.LAB_THRESHOLDS,
    periodLimits: SCORING.PERIOD_LIMITS,
    categories: SCORING.CATEGORIES,
  }, null, 0) : '{}';
  const mockJson = JSON.stringify(simplifyMock(MOCK), null, 0);
  const policyJson = JSON.stringify(policyText || [], null, 0);

  return `你是中国地质大学（北京）材料科学与工程学院的实验室安全助手（HSE Assistant）。
当前是 demo 阶段 A · Step 4，仅做纯问答（无工具调用，无写操作）。

## 数据基准
- 今日：${today || '2026-04-21'}
- 当前记分周期：${periodLabel}（结束于 ${periodEnd}）
- 数据来源：本院 8 间实验室 mock + 学院《实验室违规扣分细则及处理办法（试行）》PDF

## 硬约束（违反就是 demo 翻车，必须遵守）
1. **扣分 / 档位 / 周期 / 倒计时绝对不许口算**。所有数字必须来自下面 SCORING 数据 / MOCK 数据 / PDF 文本。
   - 答个人累积扣分：从 MOCK.people[i].personalViolations 的 ruleIds 反查 SCORING.RULES 累加 points。
   - 答实验室累积扣分：从 MOCK.labs[i].labViolations 同上。
   - 答处置档位：用 SCORING.PERSON_THRESHOLDS / LAB_THRESHOLDS 对照。
2. **答数字必须引规则号 + PDF 条款**。例如 "ppe-1（PDF 三-1，未戴护目镜，扣 3 分）"。
3. **不超出 MOCK / SCORING / PDF 范围**。MOCK 里没有的实验室/人员，回答"我没有 X 的数据"，不要编造。
4. **状态三档术语**：正常 / 关注 / 预警（normal / warning / rectifying）。不要用高危/中危/低危那套。
5. **写操作仅生成草稿**，回答"我可以起草一份 XXX 草稿"，不要假装已经登记 / 已经审批 / 已经发送。
6. **回答简洁**：直接给结论 + 1-2 行依据（规则号 + 数字 + PDF 出处），别长篇。
7. **多轮指代延续**：用户用「他 / 她 / 这个 / 那个实验室 / 它 / 那他呢」等代词或省略时，接续上一轮已经确定的对象继续答，不要反问「您指的是谁」。只有上下文真的无法确定指代时才追问。

## 处置阈值与周期定义（SCORING.PERSON_THRESHOLDS / LAB_THRESHOLDS / PERIOD_LIMITS / CATEGORIES）
${tiersJson}

## 全部 40 条扣分规则（SCORING.RULES · id/cat/code/desc/points/waivable）
${rulesJson}

## 当前 MOCK 数据（简化版 · labs / events / people）
${mockJson}

## PDF 制度文本（OCR 切片 · 第一条 ～ 第十八条 + 附件 1 总述）
${policyJson}

## 范例（照这个格式和算法答 · 数字一律用上面注入的真实数据重算，不要照抄范例里的数）

【例 1 · 查个人累积扣分 + 处置档位】
Q：李浩然这周期扣了多少分？现在什么处置？
A：李浩然本周期累计 **18 分 → 挂牌**（已超 12 分挂牌线）。
依据：
- mgmt-6（PDF 一-6 · 实验室内饮食 / 存放食品 · 12 分）
- hazard-6（PDF 四-6 · 高温炉附近堆放易燃物 · 6 分）
12 + 6 = 18 ≥ 12（PERSON_THRESHOLDS 挂牌线）→ 扣留实验室准入证，参加 48 学时安全学习并通过考试后发还。

【例 2 · 多轮指代延续（"那他呢" = 上一轮的人）】
Q：钱雨桐扣了几分？
A：钱雨桐本周期累计 **9 分 → 警示**。依据：mgmt-3（3）+ env-1（3）+ ppe-3（3）= 9，达 9 分警示线（须提交 4 学时安全学习笔记）。
Q：那他还差多少到挂牌？
A：（"他" = 上一轮的钱雨桐）距挂牌线还差 **3 分**：12 − 9 = 3。

【例 3 · 无数据兜底，绝不编造】
Q：李四扣了多少分？
A：我没有"李四"的数据——当前 MOCK 人员名单里没有这个人，无法给出扣分。

回答前先想：
- 用户问的对象在 MOCK 里能找到吗？找不到就直说没数据。
- 用户用了代词 / 省略（"他""这个实验室""那呢"）吗？能从上文确定就接续上一轮的对象、别反问；只有真的无法确定才追问。
- 涉及数字吗？涉及就先在 SCORING.RULES 找规则号、查 points、做加法，绝不口算。
- 涉及处置吗？查 PDF 第十/十一/十二条 + SCORING.*_THRESHOLDS 对照。
`;
}

function AssistantWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  // 优先级：localStorage（用户手粘的）> window.BUILT_IN_KEY（CI 注入的）> ''
  // 这样本地开发能用本地存的 key，preview repo 上甲方零摩擦
  const [apiKey, setApiKey] = React.useState(() =>
    localStorage.getItem(LS_KEY) || (typeof window !== 'undefined' && window.BUILT_IN_KEY) || ''
  );
  const [setupOpen, setSetupOpen] = React.useState(false);
  const [keyDraft, setKeyDraft] = React.useState('');
  const [error, setError] = React.useState('');
  const [policyText, setPolicyText] = React.useState(null);
  const bodyRef = React.useRef(null);
  const abortRef = React.useRef(null);

  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, busy]);

  // 一次性 fetch policy-text.json（PDF OCR 切片），缓存到 state
  React.useEffect(() => {
    fetch('../lib/policy-text.json')
      .then(r => r.json())
      .then(setPolicyText)
      .catch(e => console.warn('[assistant] policy-text 加载失败', e));
  }, []);

  const saveKey = () => {
    const trimmed = keyDraft.trim();
    if (!trimmed) return;
    localStorage.setItem(LS_KEY, trimmed);
    setApiKey(trimmed);
    setKeyDraft('');
    setSetupOpen(false);
    setError('');
  };

  const clearKey = () => {
    localStorage.removeItem(LS_KEY);
    setApiKey('');
    setKeyDraft('');
  };

  const send = async (override) => {
    const content = (override ?? input).trim();
    if (!content || busy) return;
    if (!apiKey) {
      setSetupOpen(true);
      setError('请先粘贴 DeepSeek API Key 才能对话');
      return;
    }
    setError('');
    setInput('');

    const history = messages;
    const userMsg = { role: 'user', content };
    setMessages([...history, userMsg, { role: 'assistant', content: '' }]);
    setBusy(true);

    const systemContent = buildSystemPrompt(policyText);
    const body = {
      model: MODEL,
      messages: [
        { role: 'system', content: systemContent },
        ...history,
        userMsg,
      ],
      stream: true,
    };

    abortRef.current = new AbortController();
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error('HTTP ' + resp.status + ' · ' + text.slice(0, 240));
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              setMessages(m => {
                const next = m.slice();
                const last = next[next.length - 1];
                next[next.length - 1] = { ...last, content: (last.content || '') + delta };
                return next;
              });
            }
          } catch (_) {
            /* skip malformed SSE chunk */
          }
        }
      }
    } catch (e) {
      if (e.name === 'AbortError') return;
      setError('调用失败：' + (e.message || String(e)));
      setMessages(m => {
        const last = m[m.length - 1];
        if (last && last.role === 'assistant' && !last.content) return m.slice(0, -1);
        return m;
      });
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  const cancel = () => {
    if (abortRef.current) abortRef.current.abort();
  };

  const showSetup = setupOpen || (!apiKey && open);

  return (
    <>
      <button
        className="ass-fab"
        data-open={open ? 'true' : 'false'}
        onClick={() => setOpen(o => !o)}
        title={open ? '关闭助手' : '打开 HSE 助手'}
      >
        {open ? '×' : '问'}
      </button>

      {open && (
        <aside className="ass-panel" role="dialog" aria-label="HSE 助手">
          <div className="ass-head">
            <div className="ass-kicker">
              <span className="ass-kicker-dot" data-status={apiKey ? 'on' : 'off'}></span>
              HSE ASSISTANT · {apiKey ? 'ONLINE' : 'SETUP REQUIRED'}
            </div>
            <div className="ass-title-row">
              <div className="ass-title">实验室安全助手</div>
              <div className="ass-head-actions">
                <button
                  className="ass-gear"
                  onClick={() => setSetupOpen(s => !s)}
                  title="设置 API key"
                >⚙</button>
                <button
                  className="ass-close"
                  onClick={() => setOpen(false)}
                  title="关闭助手"
                  aria-label="关闭助手"
                >×</button>
              </div>
            </div>
            <div className="ass-sub">问扣分细则 · 查实验室状态 · 起草事件登记</div>
          </div>

          {showSetup && (
            <div className="ass-setup">
              <div className="ass-setup-kicker">SETUP · DEEPSEEK API KEY</div>
              <input
                type="password"
                value={keyDraft}
                onChange={e => setKeyDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveKey(); }}
                placeholder={apiKey ? '更新 key 或粘贴新的 sk-...' : '粘贴 DeepSeek API key (sk-...)'}
                autoComplete="off"
                spellCheck="false"
              />
              <div className="ass-setup-actions">
                <span className="ass-setup-hint">
                  {apiKey
                    ? '已配置 ✓ key 仅存浏览器 localStorage'
                    : 'key 仅存浏览器 · 不进仓库 · 不上传服务器'}
                </span>
                <div className="ass-setup-btns">
                  {apiKey && <button className="ass-btn-ghost" onClick={clearKey}>清除</button>}
                  <button onClick={saveKey} disabled={!keyDraft.trim()}>保存</button>
                </div>
              </div>
            </div>
          )}

          {error && <div className="ass-error">{error}</div>}

          <div className="ass-body" ref={bodyRef}>
            {messages.length === 0 && (
              <div className="ass-empty">
                <div className="ass-empty-kicker">QUICK START · 试着问</div>
                {SUGGESTIONS.map((q, i) => (
                  <button key={i} onClick={() => send(q)}>{q}</button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={'ass-msg ass-msg-' + m.role}>
                <div className="ass-msg-bubble">
                  {m.content || (busy && i === messages.length - 1
                    ? <span className="ass-thinking">·····</span>
                    : '')}
                </div>
              </div>
            ))}
          </div>

          <div className="ass-input">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={apiKey ? '问 HSE 助手任何问题...' : '先在 ⚙ 设置 key...'}
              disabled={busy}
            />
            {busy
              ? <button onClick={cancel}>停止</button>
              : <button onClick={() => send()} disabled={!input.trim()}>发送</button>}
          </div>
        </aside>
      )}
    </>
  );
}

window.AssistantWidget = AssistantWidget;

/* AI 助手浮窗 · 阶段 A · Step 3：前端直连 DeepSeek（CORS 通） + localStorage key
 *
 * 架构调整（用户指令 2026-05-19）：跳过腾讯云 SCF 中间层，纯前端直连 api.deepseek.com。
 * 安全模型：API key 只存浏览器 localStorage（key='lab-safety-assistant-deepseek-key'），不进仓库。
 * 演示前在你的浏览器粘一次 key 即可；甲方拿到 URL 后第一次访问会看到"设置 key"提示。
 *
 * Step 4 会在 send() 里拼装 SCORING + MOCK + policy-text 三层 system prompt。
 *
 * 暴露：window.AssistantWidget
 */

const LS_KEY = 'lab-safety-assistant-deepseek-key';
const API_URL = 'https://api.deepseek.com/chat/completions';
const MODEL = 'deepseek-chat'; // 实际指向 deepseek-v4-flash（DeepSeek 自动路由）

const SUGGESTIONS = [
  '302 实验室现在什么状态？',
  '未戴护目镜扣几分？',
  '实验室扣到 60 分会怎么样？',
  '现在记分周期还剩多久？',
];

function AssistantWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [apiKey, setApiKey] = React.useState(() => localStorage.getItem(LS_KEY) || '');
  const [setupOpen, setSetupOpen] = React.useState(false);
  const [keyDraft, setKeyDraft] = React.useState('');
  const [error, setError] = React.useState('');
  const bodyRef = React.useRef(null);
  const abortRef = React.useRef(null);

  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, busy]);

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

    const body = {
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            '你是中国地质大学（北京）材料科学与工程学院的实验室安全助手（demo 阶段 A · Step 3，知识库尚未注入，Step 4 注入后才能回答扣分/状态类问题）。' +
            '当前 demo 还在跑通阶段，遇到具体业务问题先回答"知识库正在接入中"，并示意一下问题会怎么处理。' +
            '请用中文回答，简洁明了。',
        },
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
              <button
                className="ass-gear"
                onClick={() => setSetupOpen(s => !s)}
                title="设置 API key"
              >⚙</button>
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

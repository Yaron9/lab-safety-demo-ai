/* AI 助手浮窗 · 阶段 A 骨架（假回复，无后端）
 *
 * 此阶段只跑通 UI 闭环：浮按钮 → 抽屉 → 输入 → 假 assistant 回复 → 消息列表。
 * Step 3 接 SCF 真后端，Step 4 注入知识库变成真问答。
 *
 * 暴露：window.AssistantWidget —— 在 admin/index.html 的 App 根节点末尾挂用。
 */

function AssistantWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const bodyRef = React.useRef(null);

  // 滚动到底部
  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, busy]);

  const send = async (override) => {
    const content = (override ?? input).trim();
    if (!content || busy) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', content }]);
    setBusy(true);
    // Step 2 假回复 · Step 4 会替换为 fetch SCF + 流式
    await new Promise(r => setTimeout(r, 450));
    setMessages(m => [...m, {
      role: 'assistant',
      content: '助手开发中（阶段 A · Step 2 是 UI 骨架）。\nStep 4 会接通 DeepSeek-V4 + 知识库后变成真问答。',
    }]);
    setBusy(false);
  };

  const SUGGESTIONS = [
    '302 实验室现在什么状态？',
    '未戴护目镜扣几分？',
    '实验室扣到 60 分会怎么样？',
    '现在记分周期还剩多久？',
  ];

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
              <span className="ass-kicker-dot"></span>
              HSE ASSISTANT · ONLINE
            </div>
            <div className="ass-title">实验室安全助手</div>
            <div className="ass-sub">问扣分细则 · 查实验室状态 · 起草事件登记</div>
          </div>

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
                <div className="ass-msg-bubble">{m.content}</div>
              </div>
            ))}

            {busy && (
              <div className="ass-msg ass-msg-assistant">
                <div className="ass-msg-bubble ass-thinking">·····</div>
              </div>
            )}
          </div>

          <div className="ass-input">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="问 HSE 助手任何问题..."
              disabled={busy}
            />
            <button onClick={() => send()} disabled={busy || !input.trim()}>发送</button>
          </div>
        </aside>
      )}
    </>
  );
}

window.AssistantWidget = AssistantWidget;

/* ============================================================
   页面 · 系统全貌图（关于系统）
   动态 SVG：外部系统 × 平台核心 × 使用人群 × 主线故事
   ============================================================ */

const SysMapPage = () => {
  const [hl, setHl] = React.useState(null);           // 高亮角色或节点
  const [flow, setFlow] = React.useState(null);       // 当前数据流
  const [story, setStory] = React.useState({ playing: false, step: -1 });
  const timerRef = React.useRef(null);

  // 节点定义（固定坐标）
  const W = 1200, H = 720;
  const nodes = {
    // 外部系统（顶部）
    door:   { x: 150, y: 70,  w: 170, h: 56, label: '门禁系统', sub: '人脸 + 校园卡' },
    sensor: { x: 345, y: 70,  w: 170, h: 56, label: '物联传感器', sub: '温湿度 · 烟感 · VOC' },
    cas:    { x: 540, y: 70,  w: 170, h: 56, label: '学校统一身份', sub: 'CAS / OAuth' },
    acad:   { x: 735, y: 70,  w: 170, h: 56, label: '校务系统', sub: '学籍 · 课表 · 组织' },
    emerg:  { x: 930, y: 70,  w: 170, h: 56, label: '应急联动', sub: '保卫处 · 119' },

    // 平台核心（中间）
    admin:  { x: 140, y: 240, w: 400, h: 220, label: '管理控制台', sub: 'Web · 学院 HSE 管理员', icon: '📊' },
    mp:     { x: 700, y: 240, w: 400, h: 220, label: '微信小程序', sub: '师生 · 巡查员 · 移动端', icon: '📱' },

    // 使用人群（底部）
    admin_role:   { x: 105, y: 580, w: 150, h: 80, label: '学院 HSE 管理员', sub: '配置 · 督办' },
    leader: { x: 280, y: 580, w: 150, h: 80, label: '学院领导', sub: '看大屏 · 看报表' },
    teacher:{ x: 455, y: 580, w: 150, h: 80, label: '教师 / 导师', sub: '审核 · 签字' },
    student:{ x: 730, y: 580, w: 150, h: 80, label: '学生', sub: '预约 · 培训 · 整改' },
    patrol: { x: 905, y: 580, w: 150, h: 80, label: '巡查员', sub: '现场登记 · 复检' },
  };

  // 连线与数据流方向（主线故事按顺序走这些）
  const edges = [
    // 外部系统 → 核心
    { id: 'door-admin',   from: 'door',   to: 'admin',  kind: 'data' },
    { id: 'sensor-admin', from: 'sensor', to: 'admin',  kind: 'data' },
    { id: 'cas-admin',    from: 'cas',    to: 'admin',  kind: 'auth' },
    { id: 'cas-mp',       from: 'cas',    to: 'mp',     kind: 'auth' },
    { id: 'acad-admin',   from: 'acad',   to: 'admin',  kind: 'data' },
    { id: 'emerg-admin',  from: 'admin',  to: 'emerg',  kind: 'alert' },

    // 角色 → 核心 / 核心 → 角色
    { id: 'adminR-admin', from: 'admin_role', to: 'admin', kind: 'use' },
    { id: 'leader-admin', from: 'leader',     to: 'admin', kind: 'use' },
    { id: 'teacher-mp',  from: 'teacher',    to: 'mp',    kind: 'use' },
    { id: 'student-mp',   from: 'student',    to: 'mp',    kind: 'use' },
    { id: 'patrol-mp',    from: 'patrol',     to: 'mp',    kind: 'use' },

    // 核心之间
    { id: 'admin-mp',     from: 'admin',      to: 'mp',    kind: 'sync', dashed: true, label: '规则 · 事件 · 权限 双向同步' },
  ];

  // 主线故事：张一凡案 · 8 步
  const story_steps = [
    { k: 'sensor-admin',   text: '① 门禁识别：单人作业超时，烟感阈值未触发但人数规则命中，触发告警' },
    { k: 'admin-mp',       text: '② 管理控制台生成事件，同步推送到巡查员王玉鸿小程序' },
    { k: 'patrol-mp',      text: '③ 巡查员现场拍照、勾选违规类型、扣 2 分并提交' },
    { k: 'admin-mp',       text: '④ 扣分 / 挂黄牌 / 门禁权限暂停，同步通知学生 + 导师' },
    { k: 'teacher-mp',     text: '⑤ 导师李建国在小程序收到待审 · 复核申诉并驳回，要求整改' },
    { k: 'student-mp',     text: '⑥ 学生完成培训 + 考试 + 整改拍照上传' },
    { k: 'patrol-mp',      text: '⑦ 巡查员复检通过 → 门禁权限自动恢复' },
    { k: 'admin-mp',       text: '⑧ 事件归档，进入大屏统计与月度报表' },
  ];

  // 播放主线故事
  const playStory = React.useCallback(() => {
    setHl(null);
    setFlow(null);
    let i = 0;
    setStory({ playing: true, step: 0 });
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      i += 1;
      if (i >= story_steps.length) {
        clearInterval(timerRef.current);
        setStory({ playing: false, step: story_steps.length - 1 });
        return;
      }
      setStory({ playing: true, step: i });
    }, 1800);
  }, []);
  const stopStory = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStory({ playing: false, step: -1 });
  };
  React.useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // 当前激活的边（高亮 + 粒子动画）
  const activeEdges = React.useMemo(() => {
    if (story.playing || story.step >= 0) {
      return new Set([story_steps[story.step]?.k].filter(Boolean));
    }
    if (flow) {
      // 按 flow 过滤一组 edges
      const map = {
        violation: ['sensor-admin', 'door-admin', 'admin-mp', 'patrol-mp', 'teacher-mp'],
        training:  ['student-mp', 'admin-mp'],
        access:    ['door-admin', 'admin-mp', 'student-mp', 'cas-admin', 'cas-mp'],
        report:    ['leader-admin', 'adminR-admin', 'emerg-admin'],
      };
      return new Set(map[flow] || []);
    }
    if (hl) {
      return new Set(edges.filter(e => e.from === hl || e.to === hl).map(e => e.id));
    }
    return null;
  }, [hl, flow, story]);

  const isEdgeActive = (id) => activeEdges ? activeEdges.has(id) : false;
  const isEdgeDim = (id) => activeEdges && !activeEdges.has(id);
  const isNodeDim = (key) => {
    if (!activeEdges) return false;
    for (const eid of activeEdges) {
      const e = edges.find(x => x.id === eid);
      if (e && (e.from === key || e.to === key)) return false;
    }
    return true;
  };

  // 节点渲染（矩形）
  const nodeRect = (key, variant = 'ext') => {
    const n = nodes[key];
    const dim = isNodeDim(key);
    const activeHL = hl === key;
    const color = {
      ext: { fill: '#f3f6fb', stroke: '#c5d1e0', text: '#334155' },
      core: { fill: '#ebf2ff', stroke: '#6ba4ff', text: '#0f172a' },
      role: { fill: '#fffaf0', stroke: '#e5c68a', text: '#27231b' },
    }[variant];

    const isCore = variant === 'core';
    return (
      <g key={key}
         transform={`translate(${n.x}, ${n.y})`}
         onMouseEnter={() => !story.playing && setHl(key)}
         onMouseLeave={() => !story.playing && setHl(null)}
         style={{ cursor: 'pointer', opacity: dim ? 0.3 : 1, transition: 'opacity 0.3s' }}>
        <rect
          width={n.w} height={n.h} rx={isCore ? 14 : 10}
          fill={color.fill}
          stroke={activeHL ? '#2f6fd8' : color.stroke}
          strokeWidth={activeHL ? 2 : 1.2}
          style={isCore ? { filter: 'drop-shadow(0 4px 12px rgba(15,23,42,0.06))' } : null}
        />
        {isCore ? (
          <>
            {/* core node header — icon + title + sub on one row */}
            <text x={20} y={36} fontSize={26}>{n.icon}</text>
            <text x={56} y={32} fontSize={18} fontWeight={700} fill={color.text} letterSpacing="0.02em">{n.label}</text>
            <text x={56} y={50} fontSize={11.5} fill="#667085" letterSpacing="0.02em">{n.sub}</text>
            {/* divider */}
            <line x1={20} y1={68} x2={n.w - 20} y2={68} stroke="#dbe5f3" strokeWidth="1" strokeDasharray="3 4" />
            {/* internal capability list */}
            <g transform="translate(20, 90)">
              {(key === 'admin' ? [
                '今日待办 · 事件中心',
                '实验室 · 人员 · 危化品',
                '指挥大屏 · 统计报表',
                '安全培训 · 合规监控',
                '规则 · 阈值 · 通知配置',
              ] : [
                '登录 · 身份选择',
                '预约 · 扫码进门',
                '安全培训 · 考试',
                '违规申诉 · 整改拍照',
                '巡查任务 · 现场登记',
              ]).map((t, i) => (
                <g key={i} transform={`translate(0, ${i * 22})`}>
                  <circle cx={3} cy={-4} r={2} fill="#6ba4ff" />
                  <text x={14} y={0} fontSize={12.5} fill="#334155">{t}</text>
                </g>
              ))}
            </g>
          </>
        ) : (
          <>
            <text x={12} y={22} fontSize={13.5} fontWeight={600} fill={color.text}>{n.label}</text>
            <text x={12} y={40} fontSize={11} fill="#667085">{n.sub}</text>
          </>
        )}
      </g>
    );
  };

  // 连线渲染
  const anchor = (from, to) => {
    const a = nodes[from], b = nodes[to];
    const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
    const bx = b.x + b.w / 2, by = b.y + b.h / 2;
    // 从盒子边缘出发
    const dx = bx - ax, dy = by - ay;
    const adx = Math.abs(dx), ady = Math.abs(dy);
    let p1, p2;
    if (ady * a.w > adx * a.h) {
      // 上下出
      p1 = { x: ax, y: ay + (dy > 0 ? a.h / 2 : -a.h / 2) };
    } else {
      p1 = { x: ax + (dx > 0 ? a.w / 2 : -a.w / 2), y: ay };
    }
    if (ady * b.w > adx * b.h) {
      p2 = { x: bx, y: by + (dy > 0 ? -b.h / 2 : b.h / 2) };
    } else {
      p2 = { x: bx + (dx > 0 ? -b.w / 2 : b.w / 2), y: by };
    }
    return { p1, p2 };
  };

  return (
    <div>
      <div className="page-h">
        <div>
          <div className="page-title">系统全貌</div>
          <div className="page-sub">外部系统 · 平台核心 · 使用人群 · 数据如何在五类角色间流转</div>
        </div>
        <div className="row">
          <button className="btn" onClick={() => { stopStory(); setHl(null); setFlow(null); }}>
            重置视图
          </button>
          {!story.playing ? (
            <button className="btn btn-primary" onClick={playStory}>
              ▶ 播放主线故事
            </button>
          ) : (
            <button className="btn btn-danger" onClick={stopStory}>■ 停止</button>
          )}
        </div>
      </div>

      {/* 数据流筛选器 */}
      <div className="filters" style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: 'var(--ink-3)', marginRight: 4 }}>核心数据流：</span>
        {[
          { k: 'violation', l: '违规处置' },
          { k: 'training', l: '培训与准入' },
          { k: 'access', l: '门禁核验' },
          { k: 'report', l: '督办与上报' },
        ].map(x => (
          <button key={x.k}
            className={'pill ' + (flow === x.k ? 'active' : '')}
            onClick={() => { stopStory(); setHl(null); setFlow(flow === x.k ? null : x.k); }}>
            {x.l}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-3)' }}>
          悬停节点查看连线 · 点击角色按钮或流向按钮聚焦
        </span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 16, alignItems: 'start' }}>
        {/* 画布 */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', background: 'linear-gradient(180deg, #fafbfd 0%, #f5f7fb 100%)' }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
              </marker>
              <marker id="arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="#2f6fd8" />
              </marker>
              <marker id="arrow-danger" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="#dc2626" />
              </marker>
            </defs>

            {/* 分层背景 */}
            <g opacity="0.6">
              <rect x={24} y={30} width={W-48} height={120} rx={8} fill="#ffffff" stroke="#e5e7eb" strokeDasharray="4 4" />
              <text x={40} y={22} fontSize={11} fill="#94a3b8" letterSpacing="0.1em">EXTERNAL · 外部系统 & 数据源</text>

              <rect x={24} y={210} width={W-48} height={260} rx={8} fill="#ffffff" stroke="#e5e7eb" strokeDasharray="4 4" />
              <text x={40} y={202} fontSize={11} fill="#94a3b8" letterSpacing="0.1em">PLATFORM · 平台核心</text>

              <rect x={24} y={540} width={W-48} height={140} rx={8} fill="#ffffff" stroke="#e5e7eb" strokeDasharray="4 4" />
              <text x={40} y={532} fontSize={11} fill="#94a3b8" letterSpacing="0.1em">USERS · 使用人群</text>
            </g>

            {/* 连线 */}
            {edges.map(e => {
              const { p1, p2 } = anchor(e.from, e.to);
              const active = isEdgeActive(e.id);
              const dim = isEdgeDim(e.id);
              const isDanger = e.kind === 'alert';
              const stroke = active ? (isDanger ? '#dc2626' : '#2f6fd8') : (isDanger ? '#ef8787' : '#b6c1d2');
              const sw = active ? 2.2 : 1.2;
              const mk = active ? (isDanger ? 'arrow-danger' : 'arrow-on') : 'arrow';
              return (
                <g key={e.id} opacity={dim ? 0.18 : 1} style={{ transition: 'opacity 0.3s' }}>
                  <line
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={stroke} strokeWidth={sw}
                    strokeDasharray={e.dashed ? '6 5' : ''}
                    markerEnd={`url(#${mk})`}
                  />
                  {e.label && (() => {
                    const mx = (p1.x + p2.x) / 2;
                    const my = (p1.y + p2.y) / 2;
                    const cardW = 140, cardH = 44;
                    return (
                      <g style={{ pointerEvents: 'none' }}>
                        <rect
                          x={mx - cardW / 2} y={my - cardH / 2}
                          width={cardW} height={cardH} rx={6}
                          fill="#ffffff"
                          stroke={active ? '#bfdbfe' : '#e2e8f0'}
                          strokeWidth="1"
                          style={{ filter: 'drop-shadow(0 2px 6px rgba(15,23,42,0.08))' }}
                        />
                        <text
                          x={mx} y={my - 4}
                          fontSize={11} fontWeight={600}
                          fill={active ? '#2f6fd8' : '#475569'}
                          textAnchor="middle"
                        >双向同步 ⇄</text>
                        <text
                          x={mx} y={my + 12}
                          fontSize={10}
                          fill={active ? '#6ba4ff' : '#94a3b8'}
                          textAnchor="middle"
                        >规则 · 事件 · 权限</text>
                      </g>
                    );
                  })()}
                  {/* 粒子动画 */}
                  {active && (
                    <circle r={active ? 4.5 : 3} fill={isDanger ? '#dc2626' : '#2f6fd8'}>
                      <animate attributeName="cx" from={p1.x} to={p2.x} dur="1.6s" repeatCount="indefinite" />
                      <animate attributeName="cy" from={p1.y} to={p2.y} dur="1.6s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0;1;1;0" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* 节点 */}
            {['door','sensor','cas','acad','emerg'].map(k => nodeRect(k, 'ext'))}
            {nodeRect('admin', 'core')}
            {nodeRect('mp', 'core')}
            {['admin_role','leader','teacher','student','patrol'].map(k => nodeRect(k, 'role'))}
          </svg>
        </div>

        {/* 右侧故事轴 */}
        <div className="stack-m">
          <div className="card card-pad">
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em', marginBottom: 10 }}>
              MAIN STORY · 主线故事
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5 }}>
              张一凡 · 材料楼 303<br/>
              <span style={{ color: 'var(--ink-2)', fontSize: 12, fontWeight: 400 }}>
                周五夜间单人作业 · 从发现到归档
              </span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {story_steps.map((s, i) => {
                const on = story.step === i;
                const done = story.step > i;
                return (
                  <div key={i}
                    onClick={() => { stopStory(); setStory({ playing: false, step: i }); setHl(null); setFlow(null); }}
                    style={{
                      padding: '8px 10px',
                      background: on ? '#e8f0fe' : done ? '#f0f9f2' : 'transparent',
                      border: on ? '1px solid #6ba4ff' : '1px solid transparent',
                      borderRadius: 6,
                      fontSize: 12,
                      lineHeight: 1.55,
                      color: on ? '#0c3a8c' : done ? '#14532d' : 'var(--ink-2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                    {s.text}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card card-pad" style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.8 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em', marginBottom: 8 }}>
              图例
            </div>
            <div className="row" style={{ gap: 8 }}>
              <svg width="32" height="2"><line x1="0" y1="1" x2="32" y2="1" stroke="#b6c1d2" strokeWidth="1.5"/></svg>
              常规数据流
            </div>
            <div className="row" style={{ gap: 8 }}>
              <svg width="32" height="2"><line x1="0" y1="1" x2="32" y2="1" stroke="#b6c1d2" strokeWidth="1.5" strokeDasharray="5 4"/></svg>
              双向同步
            </div>
            <div className="row" style={{ gap: 8 }}>
              <svg width="32" height="2"><line x1="0" y1="1" x2="32" y2="1" stroke="#dc2626" strokeWidth="2"/></svg>
              应急上报
            </div>
            <div className="row" style={{ gap: 8, marginTop: 4 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, background: '#ebf2ff', border: '1px solid #6ba4ff', borderRadius: 2 }}></span>
              平台核心
            </div>
            <div className="row" style={{ gap: 8 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, background: '#f3f6fb', border: '1px solid #c5d1e0', borderRadius: 2 }}></span>
              外部系统
            </div>
            <div className="row" style={{ gap: 8 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, background: '#fffaf0', border: '1px solid #e5c68a', borderRadius: 2 }}></span>
              使用人群
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.SysMapPage = SysMapPage;

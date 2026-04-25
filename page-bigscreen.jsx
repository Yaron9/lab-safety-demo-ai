/* ⑤ Command Center / Big Screen — 汇报主屏 */
/* 放大、加密、加视觉冲击力；保留学院蓝，夜间深色背景 */

function BigScreenPage({ onOpenLab }) {
  const labs = MOCK.labs;
  const events = MOCK.events;
  const active = events.filter(e => e.status === 'active' || e.status === 'pending');
  const critical = events.filter(e => e.severity === 'critical' && (e.status === 'active' || e.status === 'pending'));

  const totalIn = labs.reduce((s, l) => s + l.inRoom, 0);
  const totalToday = labs.reduce((s, l) => s + l.today, 0);
  const avgScore = Math.round(labs.reduce((s, l) => s + l.score, 0) / labs.length);
  const rectifying = labs.filter(l => l.status === 'rectifying').length;
  const warnCount = labs.filter(l => l.status === 'warning').length;
  const normalCount = labs.filter(l => l.status === 'normal').length;

  // 24h heatmap synthesis for hazard-type violations
  const heatRows = ['火灾', '爆炸', '中毒', '腐蚀', '辐射', '高压', '机械'];
  const heatCols = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const seed = (i, j) => {
    const v = ((i + 1) * 7 + (j + 1) * 3 + (i * j)) % 9;
    return Math.max(0, v - 2);
  };

  // distribution ring
  const total = normalCount + warnCount + rectifying;
  const pctNormal = normalCount / total;
  const pctWarn = warnCount / total;
  const pctRect = rectifying / total;
  const R = 54, C = 2 * Math.PI * R;

  return (
    <div className="bs-root">
      <BgHeader totalIn={totalIn} active={active.length} critical={critical.length} avgScore={avgScore} />

      <div className="bs-grid">
        {/* LEFT COLUMN */}
        <div className="bs-col">
          <BsCard title="实验室分布" hint="当前状态" accent="#6ba4ff">
            <div className="bs-ring-wrap">
              <svg className="bs-radar" viewBox="-92 -92 184 184">
                <defs>
                  <linearGradient id="bsSweep" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="84" y2="0">
                    <stop offset="0%" stopColor="#6ba4ff" stopOpacity="0" />
                    <stop offset="100%" stopColor="#6ba4ff" stopOpacity="0.55" />
                  </linearGradient>
                  <radialGradient id="bsRadarHalo" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#6ba4ff" stopOpacity="0.18" />
                    <stop offset="60%" stopColor="#6ba4ff" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#6ba4ff" stopOpacity="0" />
                  </radialGradient>
                  <filter id="bsRadarGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" />
                  </filter>
                </defs>

                {/* soft outer halo */}
                <circle r="92" fill="url(#bsRadarHalo)" />

                {/* outer dashed ring — slow CW rotation */}
                <g>
                  <circle r="84" fill="none" stroke="#6ba4ff" strokeOpacity="0.32"
                    strokeWidth="0.6" strokeDasharray="2.5 5" />
                  <animateTransform attributeName="transform" type="rotate"
                    from="0" to="360" dur="32s" repeatCount="indefinite" />
                </g>

                {/* mid dashed ring — CCW counter rotation */}
                <g>
                  <circle r="76" fill="none" stroke="#6ba4ff" strokeOpacity="0.22"
                    strokeWidth="0.4" strokeDasharray="1 3.5" />
                  <animateTransform attributeName="transform" type="rotate"
                    from="360" to="0" dur="22s" repeatCount="indefinite" />
                </g>

                {/* 24 tick marks every 15° */}
                <g stroke="#6ba4ff" strokeOpacity="0.42">
                  {Array.from({ length: 24 }, (_, i) => {
                    const a = (i * 15 - 90) * Math.PI / 180;
                    const major = i % 6 === 0;
                    const r1 = 71, r2 = major ? 78 : 73.5;
                    const sw = major ? 1.2 : 0.5;
                    return (
                      <line key={i}
                        x1={Math.cos(a) * r1} y1={Math.sin(a) * r1}
                        x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
                        strokeWidth={sw} />
                    );
                  })}
                </g>

                {/* 4 cardinal crosshair brackets */}
                <g stroke="#6ba4ff" strokeOpacity="0.55" fill="none" strokeWidth="0.8">
                  <path d="M -88 -3 L -88 3 M -92 0 L -82 0" />
                  <path d="M  88 -3 L  88 3 M  82 0 L  92 0" />
                  <path d="M -3 -88 L 3 -88 M 0 -92 L 0 -82" />
                  <path d="M -3  88 L 3  88 M 0  82 L 0  92" />
                </g>

                {/* radar sweep arc — fast CW rotation, glowing trail */}
                <g filter="url(#bsRadarGlow)">
                  <path d="M 0 0 L 78 0 A 78 78 0 0 1 55.15 55.15 Z"
                    fill="url(#bsSweep)" opacity="0.6" />
                  <animateTransform attributeName="transform" type="rotate"
                    from="0" to="360" dur="4.5s" repeatCount="indefinite" />
                </g>

                {/* === existing donut, untouched === */}
                <circle r={R} fill="none" stroke="#1a2340" strokeWidth="14" />
                <circle r={R} fill="none" stroke="#16a34a" strokeWidth="14"
                  strokeDasharray={`${C * pctNormal} ${C}`}
                  strokeDashoffset="0" transform="rotate(-90)" />
                <circle r={R} fill="none" stroke="#d97706" strokeWidth="14"
                  strokeDasharray={`${C * pctWarn} ${C}`}
                  strokeDashoffset={-C * pctNormal} transform="rotate(-90)" />
                <circle r={R} fill="none" stroke="#dc2626" strokeWidth="14"
                  strokeDasharray={`${C * pctRect} ${C}`}
                  strokeDashoffset={-C * (pctNormal + pctWarn)} transform="rotate(-90)" />

                {/* inner core ring (decoration) */}
                <circle r="38" fill="none" stroke="#6ba4ff" strokeOpacity="0.18" strokeWidth="0.4" />

                <text textAnchor="middle" y="-4" fill="#fff" fontSize="26" fontWeight="700" fontFamily="var(--font-num)">{labs.length}</text>
                <text textAnchor="middle" y="16" fill="#7ca0cc" fontSize="10">总间数</text>
              </svg>
              <div className="bs-ring-legend">
                <LegendRow c="#16a34a" label="正常" n={normalCount} total={total} />
                <LegendRow c="#d97706" label="关注" n={warnCount} total={total} />
                <LegendRow c="#dc2626" label="整改 / 停用" n={rectifying} total={total} />
              </div>
            </div>
          </BsCard>

          <BsCard title="近 7 日事件趋势" hint="日均 26 · 环比 ↓12%" accent="#6ba4ff">
            <TrendChart data={MOCK.trend7d} />
          </BsCard>

          <BsCard title="院系安全积分排行" hint="按加权平均">
            <RankList
              rows={[
                { name: '新能源材料系', score: 93, labs: 2, trend: +2 },
                { name: '金属材料系', score: 90, labs: 1, trend: 0 },
                { name: '生物医用材料系', score: 88, labs: 1, trend: -1 },
                { name: '测试中心', score: 84, labs: 3, trend: +1 },
                { name: '无机非金属材料系', score: 62, labs: 1, trend: -8 },
              ]}
            />
          </BsCard>
        </div>

        {/* CENTER — floor plan hero */}
        <div className="bs-col bs-col-center">
          <BsCard
            title="材料学院楼 · 实时平面态势"
            hint="2026-04-21 14:47:32 · 刷新 5s"
            large
            action={<div className="bs-floor-legend"><Dot c="#16a34a" /> 正常 <Dot c="#d97706" /> 关注 <Dot c="#dc2626" /> 告警/整改</div>}
          >
            <FloorPlan labs={labs} onOpenLab={onOpenLab} />
          </BsCard>

          <div className="bs-row-2">
            <BsCard title="危险类型热力 · 本周违规" hint="按日/按类">
              <HazardHeatmap rows={heatRows} cols={heatCols} seed={seed} />
            </BsCard>
            <BsCard title="今日人流" hint="出入峰值 09:00 · 14:00">
              <PeopleFlow />
            </BsCard>
          </div>
        </div>

        {/* RIGHT — live feed */}
        <div className="bs-col">
          <BsCard title="告警队列" hint={`${active.length} 待处理`} pulse accent="#f87171">
            <div className="bs-alert-list">
              {active.slice(0, 5).map(ev => (
                <div key={ev.id} className={'bs-alert bs-sev-' + ev.severity}>
                  <div className="bs-alert-h">
                    <span className="bs-alert-lab">{ev.lab}</span>
                    <span className="bs-alert-time">{ev.time}</span>
                  </div>
                  <div className="bs-alert-t">{ev.title}</div>
                  <div className="bs-alert-d">{ev.detail}</div>
                  {ev.counter && <div className="bs-alert-c mono">⏱ {ev.counter}</div>}
                </div>
              ))}
            </div>
          </BsCard>

          <BsCard title="出入流水 · 实时" hint="滚动播报">
            <div className="bs-flow">
              {MOCK.accessFlow.map((a, i) => (
                <div key={i} className={'bs-flow-row ' + (a.action.startsWith('⚠') || a.action.startsWith('拒') ? 'bad' : a.action === '进入' ? 'in' : 'out')}>
                  <span className="mono bs-flow-t">{a.t}</span>
                  <span className="bs-flow-who">{a.who}</span>
                  <span className="bs-flow-a">{a.action}</span>
                  <span className="bs-flow-lab">{a.lab}</span>
                </div>
              ))}
            </div>
          </BsCard>

          <BsCard title="今日值班" hint="学院 HSE">
            <div className="bs-duty">
              <div className="bs-duty-avatar">李</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="bs-duty-name">李雪茹 · 主班</div>
                <div className="bs-duty-sub">08:00 - 20:00 · 手机 ··· 6688</div>
              </div>
              <button className="bs-btn">呼叫</button>
            </div>
            <div className="bs-duty" style={{ opacity: 0.7 }}>
              <div className="bs-duty-avatar" style={{ background: 'linear-gradient(135deg,#475569,#1e293b)' }}>王</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="bs-duty-name">王玉鸿 · 巡查</div>
                <div className="bs-duty-sub">当前位置 A208 · 已巡 5/8 间</div>
              </div>
              <button className="bs-btn">呼叫</button>
            </div>
          </BsCard>
        </div>
      </div>
    </div>
  );
}

/* ============ sub-components ============ */

function BgHeader({ totalIn, active, critical, avgScore }) {
  const [t, setT] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = n => String(n).padStart(2, '0');
  const time = `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
  return (
    <div className="bs-header">
      <div className="bs-title">
        <span className="bs-title-mark">实</span>
        <div>
          <div className="bs-title-main">材料学院 · 实验室安全指挥大屏</div>
          <div className="bs-title-sub">
            <span className="dot-live"></span> 数据实时 · 通讯正常 · 2026-04-21 <span className="mono">{time}</span>
          </div>
        </div>
      </div>
      <div className="bs-stats">
        <Stat label="当前在室" value={totalIn} unit="人" color="#6ba4ff" />
        <Stat label="待处理告警" value={active} unit="件" color="#fbbf24" pulse={active > 0} />
        <Stat label="严重告警" value={critical} unit="件" color="#f87171" pulse={critical > 0} />
        <Stat label="全院均分" value={avgScore} unit="/100" color="#4ade80" />
      </div>
    </div>
  );
}

function Stat({ label, value, unit, color, pulse }) {
  return (
    <div className={'bs-stat' + (pulse ? ' bs-stat-pulse' : '')}>
      <div className="bs-stat-label">{label}</div>
      <div className="bs-stat-v">
        <span className="num" style={{ color }}>{value}</span>
        <span className="bs-stat-u">{unit}</span>
      </div>
    </div>
  );
}

function BsCard({ title, hint, children, large, action, pulse, accent }) {
  return (
    <div className={'bs-card' + (large ? ' bs-card-lg' : '')} style={accent ? { '--bs-accent': accent } : null}>
      <div className="bs-card-h">
        <div className="bs-card-t">
          {pulse && <span className="dot-live" style={{ marginRight: 8 }}></span>}
          {title}
        </div>
        {action || (hint && <div className="bs-card-hint">{hint}</div>)}
      </div>
      <div className="bs-card-b">{children}</div>
    </div>
  );
}

function LegendRow({ c, label, n, total }) {
  const pct = total ? Math.round((n / total) * 100) : 0;
  return (
    <div className="bs-legend-row">
      <span className="bs-legend-sw" style={{ background: c }}></span>
      <span className="bs-legend-l">{label}</span>
      <span className="bs-legend-n num">{n}</span>
      <span className="bs-legend-p mono">{pct}%</span>
    </div>
  );
}

function TrendChart({ data }) {
  const max = Math.max(...data) * 1.15;
  const W = 320, H = 120, pad = 20;
  const step = (W - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => [pad + i * step, H - pad - (v / max) * (H - pad * 2)]);
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');
  const area = path + ` L${pts[pts.length - 1][0]},${H - pad} L${pts[0][0]},${H - pad} Z`;
  const days = ['15','16','17','18','19','20','21'];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="bs-trend">
      <defs>
        <linearGradient id="bsTrendF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6ba4ff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#6ba4ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(r => (
        <line key={r} x1={pad} x2={W - pad} y1={pad + r * (H - pad * 2)} y2={pad + r * (H - pad * 2)} stroke="#1a2340" strokeDasharray="2 3" />
      ))}
      <path d={area} fill="url(#bsTrendF)" />
      <path d={path} fill="none" stroke="#6ba4ff" strokeWidth="2" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="3" fill="#0a1024" stroke="#6ba4ff" strokeWidth="2" />
          <text x={p[0]} y={H - 4} fill="#5a73a0" fontSize="10" textAnchor="middle" fontFamily="var(--font-num)">{days[i]}</text>
          <text x={p[0]} y={p[1] - 8} fill="#cdd6e8" fontSize="10" textAnchor="middle" fontFamily="var(--font-num)">{data[i]}</text>
        </g>
      ))}
    </svg>
  );
}

function RankList({ rows }) {
  const max = Math.max(...rows.map(r => r.score));
  return (
    <div className="bs-rank">
      {rows.map((r, i) => (
        <div key={i} className="bs-rank-row">
          <span className="bs-rank-i mono">{String(i + 1).padStart(2, '0')}</span>
          <div className="bs-rank-main">
            <div className="bs-rank-h">
              <span className="bs-rank-n">{r.name}</span>
              <span className="bs-rank-v num">{r.score}</span>
            </div>
            <div className="bs-rank-bar">
              <div className="bs-rank-bar-f" style={{ width: (r.score / 100) * 100 + '%', background: r.score >= 85 ? '#16a34a' : r.score >= 70 ? '#d97706' : '#dc2626' }}></div>
            </div>
          </div>
          <span className={'bs-rank-t mono ' + (r.trend > 0 ? 'up' : r.trend < 0 ? 'dn' : 'eq')}>
            {r.trend > 0 ? '▲' + r.trend : r.trend < 0 ? '▼' + Math.abs(r.trend) : '—'}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Floor plan: 4 stacked floors, rooms positioned per floor */
function FloorPlan({ labs, onOpenLab }) {
  const floors = [
    { name: '4F', rooms: [{ id: '410', span: 5 }, { id: '412', span: 3, ghost: '教学库' }, { id: '415', span: 4, ghost: '共享仪器' }] },
    { name: '3F', rooms: [{ id: '302', span: 4 }, { id: '312', span: 4 }, { id: '320', span: 4, ghost: '会议 / 讨论' }] },
    { name: '2F', rooms: [{ id: 'A208', span: 4 }, { id: '207', span: 4 }, { id: '216', span: 4 }] },
    { name: '1F', rooms: [{ id: '105', span: 4 }, { id: 'B105', span: 4 }, { id: 'lobby', span: 4, ghost: '前厅 · 安全教育墙' }] },
  ];
  const map = Object.fromEntries(labs.map(l => [l.id, l]));
  const clr = (s) => s === 'rectifying' ? { bg: 'rgba(220,38,38,0.25)', bd: '#dc2626', fg: '#fecaca' }
                  : s === 'warning' ? { bg: 'rgba(217,119,6,0.22)', bd: '#d97706', fg: '#fde68a' }
                  : { bg: 'rgba(22,163,74,0.2)', bd: '#16a34a', fg: '#bbf7d0' };
  return (
    <div className="bs-floor">
      {floors.map((f, fi) => (
        <div key={f.name} className="bs-floor-row">
          <div className="bs-floor-label mono">{f.name}</div>
          <div className="bs-floor-corridor">
            <div className="bs-floor-line"></div>
            {f.rooms.map((r, ri) => {
              const lab = map[r.id];
              if (!lab) {
                return (
                  <div key={ri} className="bs-floor-room bs-floor-ghost" style={{ flex: r.span }}>
                    <div className="bs-floor-room-id mono">{r.id === 'lobby' ? '' : r.id}</div>
                    <div className="bs-floor-room-ghost">{r.ghost}</div>
                  </div>
                );
              }
              const c = clr(lab.status);
              return (
                <div key={ri}
                  className={'bs-floor-room live ' + lab.status}
                  style={{ flex: r.span, background: c.bg, borderColor: c.bd, color: c.fg }}
                  onClick={() => onOpenLab && onOpenLab(lab)}>
                  {lab.status !== 'normal' && <span className="bs-floor-pulse"><span className="dot-live"></span></span>}
                  <div className="bs-floor-room-top">
                    <span className="bs-floor-room-id mono" style={{ color: c.fg }}>{lab.id}</span>
                    <span className="bs-floor-room-s mono">{lab.score}</span>
                  </div>
                  <div className="bs-floor-room-name">{lab.name}</div>
                  <div className="bs-floor-room-b mono">👥 {lab.inRoom} · {lab.temp}° · {lab.humidity}%</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function HazardHeatmap({ rows, cols, seed }) {
  const color = v => {
    if (v === 0) return 'rgba(107,164,255,0.05)';
    const a = 0.15 + (v / 7) * 0.75;
    return v >= 5 ? `rgba(220,38,38,${a})` : v >= 3 ? `rgba(217,119,6,${a})` : `rgba(107,164,255,${a})`;
  };
  return (
    <div className="bs-heat">
      <div className="bs-heat-cols">
        <span></span>
        {cols.map(c => <span key={c} className="bs-heat-col">{c}</span>)}
      </div>
      {rows.map((r, i) => (
        <div key={r} className="bs-heat-row">
          <span className="bs-heat-rowl">{r}</span>
          {cols.map((c, j) => {
            const v = seed(i, j);
            return <div key={j} className="bs-heat-cell" style={{ background: color(v) }} title={`${r} · ${c}: ${v}`}>{v > 0 ? v : ''}</div>;
          })}
        </div>
      ))}
    </div>
  );
}

function PeopleFlow() {
  const data = [4,5,3,2,1,0,0,3,14,22,28,31,26,18,29,33,27,21,15,8,6,9,5,3];
  const max = Math.max(...data);
  return (
    <div>
      <div className="bs-pf">
        {data.map((v, i) => (
          <div key={i} className="bs-pf-bar-wrap">
            <div className="bs-pf-bar" style={{ height: (v / max) * 100 + '%' }}></div>
          </div>
        ))}
      </div>
      <div className="bs-pf-axis">
        <span>0</span><span>6</span><span>12</span><span>18</span><span>23</span>
      </div>
    </div>
  );
}

function Dot({ c }) {
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: c, marginRight: 4, marginLeft: 8 }}></span>;
}

window.BigScreenPage = BigScreenPage;

/* ============================================================
   实验项目（反馈 3b）
   ------------------------------------------------------------
   高/中/低风险项目的统一审批 + 进行中跟踪
   - KPI 行：进行中 / 待审 / 已结案 / 高风险占比
   - filter：状态（PROJECT_STATUS_ORDER）+ 风险等级
   - 时间流：每条 project 显示当前 step 进度 + lab + 申请人 + 导师
   - 详情面板：完整 timeline + 关联危险源 + SOP + 操作骨架
   ============================================================ */

function ProjectStatusChip({ s }) {
  const m = PROJECT_STATUS_META[s] || { label: s, chipCls: 'chip-gray' };
  return <span className={'chip ' + (m.chipCls || 'chip-gray')}>{m.label}</span>;
}

function ProjectRiskChip({ r }) {
  if (r === 'high')   return <span className="chip chip-red">高风险</span>;
  if (r === 'medium') return <span className="chip chip-amber">中风险</span>;
  return <span className="chip chip-green">低风险</span>;
}

function ProjectsKpi() {
  const all = MOCK.projects || [];
  const active = all.filter(p => p.status === 'active').length;
  const pending = all.filter(p => /-review$/.test(p.status)).length;
  const closed = all.filter(p => p.status === 'closed').length;
  const high = all.filter(p => p.riskLevel === 'high').length;
  const highPct = all.length ? Math.round(high / all.length * 100) : 0;
  return (
    <div className="kpi-row">
      <div className="kpi">
        <div className="kpi-label">进行中</div>
        <div className="kpi-value" style={{ color: 'var(--brand)' }}>{active}</div>
        <div className="kpi-meta">实验进行 · 门禁标识高风险</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">待审</div>
        <div className="kpi-value" style={{ color: 'var(--amber)' }}>{pending}</div>
        <div className="kpi-meta">导师 / 实验中心 / 学院 三级</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">本年已结案</div>
        <div className="kpi-value" style={{ color: 'var(--green)' }}>{closed}</div>
        <div className="kpi-meta">已归档三废 + 关闭高风险标识</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">高风险占比</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{highPct}%</div>
        <div className="kpi-meta">{high} / {all.length} 项</div>
      </div>
    </div>
  );
}

function ProjectRow({ p, onClick }) {
  const lab = (MOCK.labs || []).find(l => l.id === p.lab);
  const stepDesc = p.timeline[p.currentStep]?.title || '—';
  return (
    <div
      onClick={() => onClick(p)}
      style={{
        display: 'grid', gridTemplateColumns: '110px 1fr 220px auto', gap: 14,
        padding: '14px 16px', borderBottom: '1px solid var(--line-2)',
        cursor: 'pointer', alignItems: 'center',
      }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--bg)'}
      onMouseOut={e => e.currentTarget.style.background = ''}
    >
      <div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{p.id}</div>
        <div style={{ marginTop: 4 }}><ProjectRiskChip r={p.riskLevel} /></div>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{p.title}</div>
        <div className="meta" style={{ marginTop: 4 }}>
          <span className="chip chip-brand" style={{ marginRight: 6 }}>{p.lab}</span>
          {lab?.name} · 申请人 <strong>{p.applicant}</strong> · 导师 {p.advisor}
        </div>
        <div className="meta" style={{ fontSize: 11, marginTop: 4 }}>
          📍 当前节点：<strong style={{ color: 'var(--ink)' }}>{stepDesc}</strong>
          {p.estimatedEnd && <span> · 预计 {p.estimatedEnd}</span>}
        </div>
      </div>
      <div style={{ minWidth: 200 }}>
        <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
          {p.timeline.map((t, i) => (
            <div key={i} style={{
              flex: 1, height: 5, borderRadius: 2,
              background: t.done ? 'var(--brand)' : t.current ? 'var(--amber)' : 'var(--line-2)',
            }} />
          ))}
        </div>
        <div className="meta mono" style={{ fontSize: 10, textAlign: 'right' }}>
          {p.currentStep + (p.status === 'closed' ? 1 : 0)} / {p.timeline.length}
        </div>
      </div>
      <div><ProjectStatusChip s={p.status} /></div>
    </div>
  );
}

function ProjectPanel({ p, onClose }) {
  if (!p) return null;
  const lab = (MOCK.labs || []).find(l => l.id === p.lab);
  // 项目可能涉及当前 lab 之外的危险源（如跨实验室协作），从全局 hazardSources 查找
  const allHaz = (MOCK.labs || []).flatMap(l => (l.hazardSources || []).map(h => ({ ...h, labId: l.id, labName: l.name })));
  const linkedHaz = allHaz.filter(h => (p.hazardSources || []).includes(h.id));
  return (
    <>
      <div className="panel-ov" onClick={onClose}></div>
      <div className="panel">
        <div className="panel-h">
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }} className="mono">{p.id}</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2, lineHeight: 1.3 }}>{p.title}</div>
            <div className="row" style={{ marginTop: 8, gap: 6, flexWrap: 'wrap' }}>
              <ProjectRiskChip r={p.riskLevel} />
              <ProjectStatusChip s={p.status} />
              <span className="chip chip-brand">{p.lab}</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ fontSize: 16 }}>✕</button>
        </div>

        <div style={{ padding: '18px 24px' }} className="stack-l">
          <div className="grid-2" style={{ gap: 12 }}>
            <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 6 }}>
              <div className="meta" style={{ fontSize: 11 }}>申请人 / 导师</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{p.applicant}</div>
              <div className="meta" style={{ fontSize: 11, marginTop: 2 }}>导师 {p.advisor}</div>
            </div>
            <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 6 }}>
              <div className="meta" style={{ fontSize: 11 }}>预计结束</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{p.estimatedEnd || '—'}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              SOP 摘要
            </div>
            <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 6, fontSize: 13, lineHeight: 1.6 }}>
              {p.sop}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              涉及危险源 · {linkedHaz.length} 项
            </div>
            {linkedHaz.length === 0 ? (
              <div className="meta" style={{ padding: 10 }}>未关联危险源</div>
            ) : (
              <div className="stack-s">
                {linkedHaz.map(h => (
                  <div key={h.id} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: 'var(--bg)', borderRadius: 6, alignItems: 'center' }}>
                    <HazardKindChip k={h.kind} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{h.name}</div>
                      <div className="meta mono" style={{ fontSize: 11 }}>
                        {h.location}
                        {h.labId !== p.lab && <span style={{ marginLeft: 6, color: 'var(--amber)' }}>· 跨实验室协作 · {h.labId}</span>}
                      </div>
                    </div>
                    <HazardSeverityChip s={h.severity} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              审批 / 推进时间线
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {p.timeline.map((t, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '110px 16px 1fr', gap: 10,
                  padding: '12px 14px',
                  borderBottom: i < p.timeline.length - 1 ? '1px solid var(--line-2)' : 'none',
                  alignItems: 'flex-start',
                  background: t.current ? 'var(--amber-soft, #fef3c7)' : '',
                }}>
                  <span className="meta mono" style={{ fontSize: 11 }}>{t.time}</span>
                  <span style={{
                    width: 12, height: 12, borderRadius: '50%', marginTop: 4,
                    background: t.done ? 'var(--brand)' : t.current ? 'var(--amber)' : 'var(--line-2)',
                  }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}{t.current && <span className="meta" style={{ marginLeft: 6 }}>· 进行中</span>}</div>
                    <div className="meta" style={{ fontSize: 12, marginTop: 2 }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row" style={{ justifyContent: 'flex-end', gap: 8, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
            <button className="btn">导出审批单</button>
            {/-review$/.test(p.status) && <button className="btn btn-danger">驳回</button>}
            {/-review$/.test(p.status) && <button className="btn btn-primary">通过</button>}
            {p.status === 'active' && <button className="btn btn-primary">提交结案</button>}
          </div>
        </div>
      </div>
    </>
  );
}

function ProjectsPage() {
  const [status, setStatus] = React.useState('all');
  const [risk, setRisk] = React.useState('all');
  const [open, setOpen] = React.useState(null);

  const all = MOCK.projects || [];
  const list = all.filter(p => {
    if (status !== 'all' && p.status !== status) return false;
    if (risk !== 'all' && p.riskLevel !== risk) return false;
    return true;
  });
  const countByStatus = s => all.filter(p => p.status === s).length;

  return (
    <div>
      <div className="page-h">
        <div>
          <div className="page-title">实验项目</div>
          <div className="page-sub">
            学生 → 导师 → 实验中心 → 学院终审 · 高/中/低风险分级 · 关联危险源台账
          </div>
        </div>
        <div className="row">
          <button className="btn">导出报表</button>
          <button className="btn btn-primary">+ 新增项目（管理员）</button>
        </div>
      </div>

      <ProjectsKpi />

      <div className="filters">
        <span className="muted" style={{ fontSize: 12 }}>状态</span>
        <button className={'pill ' + (status === 'all' ? 'active' : '')} onClick={() => setStatus('all')}>全部 · {all.length}</button>
        {PROJECT_STATUS_ORDER.map(s => {
          const n = countByStatus(s);
          if (n === 0) return null;
          const m = PROJECT_STATUS_META[s];
          return (
            <button key={s} className={'pill ' + (status === s ? 'active' : '')} onClick={() => setStatus(s)}>
              {m.label} · {n}
            </button>
          );
        })}
        <span style={{ width: 1, height: 18, background: 'var(--line)', margin: '0 4px' }}></span>
        <span className="muted" style={{ fontSize: 12 }}>风险</span>
        {[
          { k: 'all', l: '全部' },
          { k: 'high', l: '高 · ' + all.filter(p => p.riskLevel === 'high').length },
          { k: 'medium', l: '中 · ' + all.filter(p => p.riskLevel === 'medium').length },
          { k: 'low', l: '低 · ' + all.filter(p => p.riskLevel === 'low').length },
        ].map(f => (
          <button key={f.k} className={'pill ' + (risk === f.k ? 'active' : '')} onClick={() => setRisk(f.k)}>{f.l}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-2)' }}>共 {list.length} 项</span>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {list.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>暂无匹配项目</div>
        ) : (
          list.map(p => <ProjectRow key={p.id} p={p} onClick={setOpen} />)
        )}
      </div>

      {open && <ProjectPanel p={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

window.ProjectsPage = ProjectsPage;

// ============================================================
// 学生端 · 实验项目报备（反馈 3b）
// 列表（含内嵌 timeline）/ 报备表单 / 提交成功 三页
// 字典从 components.jsx 的 MP_PROJECT_STATUS_META / MP_PROJECT_RISK_META 读取
// ============================================================

// 我的项目列表（每项内嵌 timeline）
const StuProjectListPage = ({ onNav }) => {
  const list = MP.projects || [];
  const me = MP.student?.name;
  const mine = list.filter(p => p.applicant === me);

  return (
    <MiniProgram navTitle="我的实验项目" showBack onBack={() => onNav('home')} hideTabBar>
      <div style={{ padding: '12px 16px 4px', background: '#fff' }}>
        <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>
          高风险项目须经 导师 / 实验中心 / 学院 三级审批；中/低风险走快速通道。
          每个项目登记后，门牌会自动同步状态。
        </div>
      </div>

      {mine.length === 0 ? (
        <div className="wx-card">
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#999', fontSize: 13 }}>
            还没有项目报备，点下方按钮新建
          </div>
        </div>
      ) : mine.map(p => {
        const stat = MP_PROJECT_STATUS_META[p.status] || { label: p.status, cls: 'gray' };
        const risk = MP_PROJECT_RISK_META[p.riskLevel];
        return (
          <div key={p.id} className="wx-card">
            <div style={{ padding: '14px 16px 0' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                <span className={'wx-tag ' + risk.cls}>{risk.label}</span>
                <span className={'wx-tag ' + stat.cls}>{stat.label}</span>
                <span className="wx-tag gray">阶段 {p.currentStep}/{p.timeline.length}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#000', lineHeight: 1.4 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                实验室 {p.lab} · 导师 {p.advisor}
                {p.estimatedEnd && <span> · 预计 {p.estimatedEnd}</span>}
              </div>
            </div>

            <div style={{ padding: '10px 16px 12px' }}>
              <div style={{ fontSize: 13, color: '#333', background: '#f7f7f7', padding: 10, borderRadius: 6, lineHeight: 1.6 }}>
                <strong style={{ fontSize: 12, color: '#666' }}>SOP：</strong>{p.sop}
              </div>
            </div>

            {p.rejectReason && (
              <div style={{ padding: '0 16px 12px' }}>
                <div style={{ background: '#fbe9e7', padding: 10, borderRadius: 6, fontSize: 13, color: '#7a2018', lineHeight: 1.6 }}>
                  <strong>驳回理由：</strong>{p.rejectReason}
                </div>
              </div>
            )}

            <div style={{ padding: '0 16px 4px', fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>
              审批 / 推进时间线
            </div>
            <div className="timeline" style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 14 }}>
              {p.timeline.map((t, i) => (
                <div key={i} className={'tl-item' + (t.done ? ' done' : '') + (t.current ? ' current' : '')}>
                  <div className="tl-dot">
                    {t.done && <Icon name="check" size={10} color="#fff" stroke={3}/>}
                  </div>
                  <div className="tl-body">
                    <div className="t1">{t.title}</div>
                    <div className="t2">{t.desc}</div>
                    <div className="t3">{t.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {p.status === 'rejected' && (
              <div style={{ padding: '0 16px 14px' }}>
                <button className="wx-btn block" onClick={() => onNav('project-form')}>
                  修订后重新提交
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div className="mp-bottom-bar">
        <button className="wx-btn block" onClick={() => onNav('project-form')}>
          <Icon name="flask" size={16} color="#fff"/> &nbsp;+ 新建项目报备
        </button>
      </div>
    </MiniProgram>
  );
};

// 新建项目报备表单
const StuProjectFormPage = ({ onNav }) => {
  const [labId, setLabId] = React.useState('302');
  const [title, setTitle] = React.useState('');
  const [risk, setRisk] = React.useState('medium');
  const [sop, setSop] = React.useState('');
  const [pickedHaz, setPickedHaz] = React.useState([]);
  const [endDate, setEndDate] = React.useState('');

  const lab = (MP.labs || []).find(l => l.id === labId);
  const advisor = lab?.lead || '—';
  const labHazards = lab?.hazardSources || [];

  const togglePick = (id) => {
    setPickedHaz(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const submit = () => {
    if (!title.trim()) return alert('请填写项目名');
    if (!sop.trim()) return alert('请填写 SOP 摘要');
    if (pickedHaz.length === 0) return alert('请至少选择 1 项涉及的危险源');
    onNav('project-sent');
  };

  return (
    <MiniProgram navTitle="新建项目报备" showBack onBack={() => onNav('project')} hideTabBar>
      <div className="wx-card">
        <div className="wx-card-title">基本信息</div>
        <div className="wx-list">
          <div className="wx-cell">
            <div className="wx-cell-hd" style={{ width: 70, fontSize: 13, color: '#666' }}>项目名</div>
            <div className="wx-cell-bd">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="如：钠离子电池正极材料合成"
                style={{ width: '100%', border: 'none', fontSize: 14, outline: 'none', padding: '6px 0' }}
              />
            </div>
          </div>
          <div className="wx-cell">
            <div className="wx-cell-hd" style={{ width: 70, fontSize: 13, color: '#666' }}>实验室</div>
            <div className="wx-cell-bd">
              <select
                value={labId}
                onChange={e => { setLabId(e.target.value); setPickedHaz([]); }}
                style={{ width: '100%', border: 'none', fontSize: 14, outline: 'none', padding: '6px 0', background: 'transparent' }}
              >
                {(MP.labs || []).map(l => (
                  <option key={l.id} value={l.id}>{l.id} · {l.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="wx-cell">
            <div className="wx-cell-hd" style={{ width: 70, fontSize: 13, color: '#666' }}>导师</div>
            <div className="wx-cell-bd" style={{ fontSize: 14, color: '#333' }}>{advisor} <span style={{ fontSize: 11, color: '#999' }}>（根据实验室自动填充）</span></div>
          </div>
          <div className="wx-cell">
            <div className="wx-cell-hd" style={{ width: 70, fontSize: 13, color: '#666' }}>风险等级</div>
            <div className="wx-cell-bd" style={{ display: 'flex', gap: 8 }}>
              {['high', 'medium', 'low'].map(r => (
                <div
                  key={r}
                  onClick={() => setRisk(r)}
                  style={{
                    padding: '6px 14px', borderRadius: 14, fontSize: 12, cursor: 'pointer',
                    background: risk === r ? '#003f88' : '#f5f5f7', color: risk === r ? '#fff' : '#666',
                  }}
                >
                  {MP_PROJECT_RISK_META[r].label}
                </div>
              ))}
            </div>
          </div>
          <div className="wx-cell">
            <div className="wx-cell-hd" style={{ width: 70, fontSize: 13, color: '#666' }}>预计结束</div>
            <div className="wx-cell-bd">
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                style={{ border: 'none', fontSize: 14, outline: 'none', padding: '6px 0', background: 'transparent' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="wx-card">
        <div className="wx-card-title">涉及危险源 (从 {lab?.name || '所选实验室'} 选)</div>
        <div className="wx-list">
          {labHazards.length === 0 ? (
            <div style={{ padding: '20px 16px', color: '#999', fontSize: 13 }}>该实验室暂无登记危险源</div>
          ) : labHazards.map(h => {
            const picked = pickedHaz.includes(h.id);
            return (
              <div key={h.id} className="wx-cell" onClick={() => togglePick(h.id)} style={{ cursor: 'pointer' }}>
                <div className="wx-cell-hd" style={{ width: 28 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 4,
                    border: '2px solid ' + (picked ? '#003f88' : '#c7c7cc'),
                    background: picked ? '#003f88' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {picked && <Icon name="check" size={12} color="#fff" stroke={3}/>}
                  </div>
                </div>
                <div className="wx-cell-bd">
                  <div className="wx-cell-bd-title" style={{ fontSize: 13 }}>{h.name}</div>
                  <div className="wx-cell-bd-desc">
                    <span className={'wx-tag ' + (h.severity === 'critical' ? 'red' : 'orange')}>
                      {h.severity === 'critical' ? '严重' : '关注'}
                    </span>
                    <span style={{ marginLeft: 6, fontSize: 11, color: '#666' }}>
                      PPE: {(h.ppe || []).join(' · ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="wx-card">
        <div className="wx-card-title">SOP 摘要 *</div>
        <div style={{ padding: '4px 16px 16px' }}>
          <textarea
            value={sop}
            onChange={e => setSop(e.target.value)}
            placeholder="说明实验流程、关键参数、应急处置预案。如：高温炉 800°C 烧结 6h · 真空环境 · 单批次 ≤ 5g · 必须双人在场。"
            style={{
              width: '100%', minHeight: 110, border: '1px solid var(--line)',
              borderRadius: 8, padding: 10, fontSize: 14, fontFamily: 'inherit',
              outline: 'none', resize: 'none',
            }}
          />
        </div>
      </div>

      <div className="mp-bottom-bar">
        <button className="wx-btn gray" style={{ flex: 1 }} onClick={() => onNav('project')}>取消</button>
        <button className="wx-btn block" style={{ flex: 2 }} onClick={submit}>提交报备</button>
      </div>
    </MiniProgram>
  );
};

// 提交成功
const StuProjectSentPage = ({ onNav }) => {
  return (
    <MiniProgram navTitle="提交成功" showBack onBack={() => onNav('project')} hideTabBar>
      <div className="scan-result-card" style={{ marginTop: 32 }}>
        <div className="scan-result-icon ok" style={{ background: '#e5f5e9', color: '#2e7d32' }}>
          <Icon name="check" size={30} stroke={3}/>
        </div>
        <div className="scan-result-title">项目报备已提交</div>
        <div className="scan-result-sub" style={{ marginTop: 8 }}>
          系统已根据风险等级分配审批链
        </div>
        <div style={{ marginTop: 16, padding: 12, background: '#f7f7f7', borderRadius: 8, textAlign: 'left', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>
          ① 导师审核（24h 内响应）<br/>
          ② 中/高风险 → 实验中心备案<br/>
          ③ 高风险 → 学院安全副院长终审<br/>
          ④ 通过后立项 · 门牌自动同步项目状态<br/>
          —————<br/>
          系统已通知：<br/>
          · 导师赵振华（小程序消息）<br/>
          · 管理控制台事件中心
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <button className="wx-btn block" onClick={() => onNav('project')}>查看我的项目</button>
      </div>
    </MiniProgram>
  );
};

Object.assign(window, {
  StuProjectListPage, StuProjectFormPage, StuProjectSentPage,
});

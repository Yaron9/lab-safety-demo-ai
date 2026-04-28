/* ④ People + ⑤ Big screen + Lab detail panel */

function PeoplePage() {
  const [f, setF] = React.useState('all');
  const list = MOCK.people.filter(p => f === 'all' || (f === 'risk' && p.status !== '正常') || p.role === f);
  return (
    <div>
      <div className="page-h">
        <div>
          <div className="page-title">人员档案</div>
          <div className="page-sub">按角色查看 · 可追溯每人的培训、违规、出入记录</div>
        </div>
        <div className="row">
          <button className="btn">导入名单</button>
          <button className="btn btn-primary">+ 新增人员</button>
        </div>
      </div>

      <div className="filters">
        {[
          { k: 'all', l: '全部', n: MOCK.people.length },
          { k: '学生', l: '学生', n: MOCK.people.filter(p => p.role === '学生').length },
          { k: '导师', l: '导师', n: MOCK.people.filter(p => p.role === '导师').length },
          { k: '巡查员', l: '巡查员', n: MOCK.people.filter(p => p.role === '巡查员').length },
          { k: 'risk', l: '🚨 高风险', n: MOCK.people.filter(p => p.status !== '正常').length },
        ].map(x => (
          <button key={x.k} className={'pill ' + (f === x.k ? 'active' : '')} onClick={() => setF(x.k)}>{x.l} · {x.n}</button>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>姓名</th>
              <th>角色 / 院系</th>
              <th>可进入实验室</th>
              <th>安全积分</th>
              <th>违规次数</th>
              <th>培训状态</th>
              <th style={{ width: 100 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="row">
                    <div className="avatar" style={{ background: 'linear-gradient(135deg,#94a3b8,#475569)' }}>{p.name[0]}</div>
                    <div>
                      <strong>{p.name}</strong>
                      <div className="meta mono" style={{ fontSize: 11 }}>{p.id}</div>
                    </div>
                  </div>
                </td>
                <td>{p.role}<div className="meta">{p.dept}</div></td>
                <td>
                  {p.labs.map(l => <span key={l} className="chip chip-brand" style={{ marginRight: 4 }}>{l}</span>)}
                </td>
                <td>
                  <span style={{ fontWeight: 700, fontSize: 15, color: p.score >= 85 ? 'var(--green)' : p.score >= 70 ? 'var(--amber)' : 'var(--red)' }} className="num">{p.score}</span>
                  <span className="meta"> / 100</span>
                </td>
                <td>
                  {p.violations > 0 ? <span className="chip chip-amber">{p.violations} 次</span> : <span className="meta">0</span>}
                </td>
                <td>
                  {p.training === 'valid' && <span className="chip chip-green">有效</span>}
                  {p.training === 'expiring' && <span className="chip chip-amber">即将到期</span>}
                </td>
                <td>
                  {p.status === '黄牌' ? <span className="chip chip-amber">黄牌</span> : <span className="chip chip-gray">正常</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Lab detail — slide-over panel */
function LabPanel({ lab, onClose }) {
  if (!lab) return null;
  const labEvents = MOCK.events.filter(e => e.lab === lab.id);
  const doorBg = lab.status === 'normal' ? '#15803d' : lab.status === 'warning' ? '#d97706' : '#dc2626';
  return (
    <>
      <div className="panel-ov" onClick={onClose}></div>
      <div className="panel">
        <div className="panel-h">
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}><span className="mono">{lab.id}</span> · {lab.dept}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>{lab.name}</div>
            <div className="row" style={{ marginTop: 8, gap: 6 }}>
              {statusChip(lab.status)}
              <span className="chip chip-gray">负责人 {lab.lead}</span>
              <span className="chip chip-gray">积分 <span className="num">{lab.score}</span></span>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ fontSize: 18 }}>✕</button>
        </div>

        <div style={{ padding: '18px 24px' }} className="stack-l">
          {/* Live state */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>实时</div>
            <div className="grid-3" style={{ gap: 10 }}>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 6 }}>
                <div className="meta" style={{ fontSize: 11 }}>在室人数</div>
                <div className="num" style={{ fontSize: 22, fontWeight: 700 }}>{lab.inRoom}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 6 }}>
                <div className="meta" style={{ fontSize: 11 }}>温度</div>
                <div className="num" style={{ fontSize: 22, fontWeight: 700 }}>{lab.temp}°</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 6 }}>
                <div className="meta" style={{ fontSize: 11 }}>湿度</div>
                <div className="num" style={{ fontSize: 22, fontWeight: 700 }}>{lab.humidity}%</div>
              </div>
            </div>
          </div>

          {/* Hazards */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>危险类别</div>
            <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
              {lab.hazards.map(h => <span key={h} className="chip chip-amber">⚠ {h}</span>)}
            </div>
            {lab.hazardSources && lab.hazardSources.length > 0 && (
              <div className="meta" style={{ marginTop: 10, fontSize: 12 }}>
                🔬 已登记危险源 <strong style={{ color: 'var(--ink)' }}>{lab.hazardSources.length}</strong> 项
                （{lab.hazardSources.filter(h => h.severity === 'critical').length} 项严重）
                · 详情见侧栏「危险源台账」
              </div>
            )}
          </div>

          {/* Vacation Auth · 反馈 11 */}
          {lab.vacationAuth && lab.vacationAuth.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                寒暑假白名单 · {lab.vacationAuth.length} 人
              </div>
              <div className="stack-s">
                {lab.vacationAuth.map(v => (
                  <div key={v.studentId} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', background: 'var(--bg)', borderRadius: 6, fontSize: 12,
                  }}>
                    <span>
                      <strong>{v.studentName}</strong>
                      <span className="meta" style={{ marginLeft: 6 }}>· {v.dayOnly ? '仅日间' : '全天'} · 由 {v.grantedBy}</span>
                    </span>
                    <span className="meta mono" style={{ fontSize: 11 }}>
                      {v.fromDate.slice(5)} → {v.toDate.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Door preview */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>门牌屏幕预览 · 实时同步</div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 180, background: '#111', borderRadius: 14, padding: 4, boxShadow: 'var(--sh-lg)', flexShrink: 0 }}>
                <div style={{ background: doorBg, borderRadius: 10, padding: 12, aspectRatio: '9/16', display: 'flex', flexDirection: 'column', gap: 8, color: '#fff' }}>
                  <div style={{ fontSize: 9, opacity: 0.85 }}>{lab.dept}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.15 }}>{lab.name}</div>
                  <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'var(--font-num)' }}>{lab.id}</div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.25)' }}></div>
                  <div style={{ fontSize: 9, opacity: 0.8 }}>负责人</div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{lab.lead}</div>
                  <div style={{ fontSize: 9, opacity: 0.8, marginTop: 4 }}>危险告示</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {lab.hazards.slice(0, 4).map(h => (
                      <span key={h} style={{ fontSize: 8, padding: '2px 5px', background: 'rgba(0,0,0,0.25)', borderRadius: 3 }}>⚠ {h}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 'auto', fontSize: 9, opacity: 0.85, display: 'flex', justifyContent: 'space-between' }}>
                    <span>🌡 {lab.temp}°</span>
                    <span>👥 {lab.inRoom}</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)' }} className="stack-m">
                <div>门口的电子门牌会<strong>自动同步</strong>实验室状态：</div>
                <div>• 负责人、危险类别、在室人数实时刷新</div>
                <div>• 状态异常时整块变橙 / 红</div>
                <div>• 整改期显示倒计时</div>
                <button className="btn btn-sm" style={{ alignSelf: 'flex-start', marginTop: 4 }}>推送更新 →</button>
              </div>
            </div>
          </div>

          {lab.note && (
            <div style={{ padding: 12, background: 'var(--amber-soft)', border: '1px solid #fde68a', borderRadius: 6, fontSize: 12 }}>
              💡 <strong>备注：</strong>{lab.note}
              {lab.deadline && <span> · 截止 <strong>{lab.deadline}</strong></span>}
            </div>
          )}

          {/* recent events */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>近期事件 · {labEvents.length}</div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {labEvents.length > 0 ? labEvents.map(ev => <EventRow key={ev.id} ev={ev} />) : (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--ink-3)' }}>暂无事件记录</div>
              )}
            </div>
          </div>

          <div className="row" style={{ justifyContent: 'flex-end', gap: 8, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
            <button className="btn">编辑档案</button>
            <button className="btn">生成检查表</button>
            <button className="btn btn-primary">前往完整页面 →</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* Placeholder page for not-yet-detailed routes */
function PlaceholderPage({ title, desc, features }) {
  return (
    <div>
      <div className="page-h">
        <div>
          <div className="page-title">{title}</div>
          <div className="page-sub">{desc}</div>
        </div>
      </div>
      <div className="card card-pad" style={{ padding: 40, textAlign: 'center', background: 'repeating-linear-gradient(45deg, #fff, #fff 10px, #fafbfd 10px, #fafbfd 20px)' }}>
        <div style={{ fontSize: 40, opacity: 0.4 }}>🚧</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 10 }}>该页面骨架就位 · 等交互方向确认后细化</div>
        <div className="meta" style={{ marginTop: 6, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          {desc}
        </div>
        {features && (
          <div style={{ marginTop: 20, display: 'inline-block', textAlign: 'left' }} className="stack-m">
            {features.map((f, i) => <div key={i} style={{ color: 'var(--ink-2)', fontSize: 13 }}>• {f}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}

function EventPanel({ ev, onClose }) {
  if (!ev) return null;
  return (
    <>
      <div className="panel-ov" onClick={onClose}></div>
      <div className="panel" style={{ width: 480 }}>
        <div className="panel-h">
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{ev.lab} · {ev.time}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{ev.title}</div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: '18px 24px' }} className="stack-l">
          <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 6, fontSize: 13, color: 'var(--ink)' }}>
            {ev.detail}
          </div>
          {ev.progress != null && (
            <div>
              <div className="between" style={{ marginBottom: 6, fontSize: 12 }}>
                <span className="meta">整改进度</span>
                <strong>{ev.progress}%</strong>
              </div>
              <div className="progress"><div className="progress-fill" style={{ width: ev.progress + '%' }}></div></div>
            </div>
          )}
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>处理动作</div>
            <div className="stack-m">
              <div className="row" style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6 }}>
                <input type="checkbox" /> 通知实验室负责人（{ev.lab === 'A208' ? '钱雨桐' : ev.lab === '410' ? '周景明' : '赵振华'}）
              </div>
              <div className="row" style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6 }}>
                <input type="checkbox" defaultChecked /> 短信通知当事人
              </div>
              <div className="row" style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6 }}>
                <input type="checkbox" /> 升级至学院 HSE 督导
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>处理备注</div>
            <textarea placeholder="填写处理情况、联系结果..." style={{ width: '100%', minHeight: 80, padding: 10, border: '1px solid var(--line)', borderRadius: 6, fontFamily: 'inherit', fontSize: 13, resize: 'vertical' }}></textarea>
          </div>
          <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn" onClick={onClose}>稍后再说</button>
            <button className="btn btn-danger">上报升级</button>
            <button className="btn btn-primary">确认处理</button>
          </div>
        </div>
      </div>
    </>
  );
}

window.PeoplePage = PeoplePage;
window.LabPanel = LabPanel;
window.EventPanel = EventPanel;
window.PlaceholderPage = PlaceholderPage;

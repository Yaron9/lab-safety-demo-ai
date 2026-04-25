/* ⑥ Reports — 统计与报表 · 给院长/评估用 */

function ReportsPage() {
  const [period, setPeriod] = React.useState('month');

  // Monthly synthesized series
  const months = ['11月','12月','1月','2月','3月','4月'];
  const evSeries = [58, 72, 65, 48, 42, 31]; // violations
  const alertSeries = [18, 24, 21, 19, 14, 12];

  // Violation type breakdown (for Top 违规类型)
  const types = [
    { k: '未戴防护装备', n: 18, color: '#dc2626' },
    { k: '可燃试剂乱放', n: 12, color: '#d97706' },
    { k: '单人操作', n: 9, color: '#f59e0b' },
    { k: '废液未分类', n: 6, color: '#1e5eb5' },
    { k: '离岗未断电', n: 5, color: '#6ba4ff' },
    { k: '培训过期进入', n: 3, color: '#94a3b8' },
  ];
  const totalType = types.reduce((s, t) => s + t.n, 0);

  // Department comparison
  const depts = [
    { n: '材料化学系', score: 91, eventsDelta: -4, trainDone: 96, hi: true },
    { n: '材料工程系', score: 90, eventsDelta: -1, trainDone: 95 },
    { n: '测试中心',   score: 85, eventsDelta: -2, trainDone: 89 },
    { n: '材料物理系', score: 62, eventsDelta: +3, trainDone: 71, lo: true },
  ];

  return (
    <div>
      <div className="page-h">
        <div>
          <div className="page-title">统计与报表</div>
          <div className="page-sub">数据对上对外 · 月报 / 季报 / 年报 · 可生成标准格式 PDF</div>
        </div>
        <div className="row">
          <div className="rp-seg">
            {[['month','月度'],['quarter','季度'],['year','年度']].map(([k,l]) => (
              <button key={k} className={'rp-seg-b ' + (period === k ? 'active' : '')} onClick={() => setPeriod(k)}>{l}</button>
            ))}
          </div>
          <button className="btn">导出 Excel</button>
          <button className="btn btn-primary">生成 PDF 月报</button>
        </div>
      </div>

      {/* 1. Hero KPIs with subtext */}
      <div className="rp-hero">
        <HeroStat label="本月事件总数" v="43" delta="-19%" good sub="告警 12 · 违规 31" />
        <HeroStat label="培训合规率" v="91" unit="%" delta="+3pp" good sub="应训 142 · 已训 129" />
        <HeroStat label="整改按期完成" v="88" unit="%" delta="+5pp" good sub="15 项 · 逾期 2 项" />
        <HeroStat label="全院安全积分" v="85.6" delta="+1.2" good sub="较上月 / 学校 TOP 30%" />
      </div>

      {/* 2. Six-month trend + violation type donut */}
      <div className="grid-2" style={{ marginTop: 16, gap: 16 }}>
        <div className="card">
          <div className="card-h">
            <h3>近 6 个月事件趋势</h3>
            <div className="row" style={{ fontSize: 11, color: 'var(--ink-2)' }}>
              <span><span className="rp-dot" style={{ background: '#d97706' }}></span> 违规</span>
              <span style={{ marginLeft: 12 }}><span className="rp-dot" style={{ background: '#dc2626' }}></span> 告警</span>
            </div>
          </div>
          <div className="card-body">
            <TwinTrend months={months} a={evSeries} b={alertSeries} />
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <h3>违规类型 Top 6</h3>
            <span className="meta" style={{ fontSize: 11 }}>本月共 {totalType} 条</span>
          </div>
          <div className="card-body">
            <div className="rp-donut-wrap">
              <DonutChart types={types} total={totalType} />
              <div className="rp-donut-legend">
                {types.map(t => (
                  <div key={t.k} className="rp-donut-row">
                    <span className="rp-donut-sw" style={{ background: t.color }}></span>
                    <span className="rp-donut-l">{t.k}</span>
                    <span className="rp-donut-n num">{t.n}</span>
                    <span className="rp-donut-p mono">{Math.round(t.n / totalType * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Department comparison */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-h">
          <h3>院系对标 · 本月</h3>
          <span className="meta" style={{ fontSize: 11 }}>积分 · 事件变化 · 培训完成 · 三项对比</span>
        </div>
        <div style={{ overflow: 'auto' }}>
          <table className="tbl rp-tbl">
            <thead>
              <tr>
                <th style={{ width: 40 }}>排名</th>
                <th>院系</th>
                <th>安全积分</th>
                <th>事件环比</th>
                <th>培训完成率</th>
                <th style={{ width: 120 }}>综合评级</th>
              </tr>
            </thead>
            <tbody>
              {depts.map((d, i) => (
                <tr key={d.n} className={d.hi ? 'rp-hi' : d.lo ? 'rp-lo' : ''}>
                  <td className="mono" style={{ textAlign: 'center', fontWeight: 700, fontSize: 15 }}>{i + 1}</td>
                  <td>
                    <strong>{d.n}</strong>
                    {d.hi && <span className="chip chip-green" style={{ marginLeft: 6 }}>🏆 院级标兵</span>}
                    {d.lo && <span className="chip chip-red" style={{ marginLeft: 6 }}>⚠ 重点督导</span>}
                  </td>
                  <td>
                    <div className="rp-score">
                      <div className="rp-score-bar">
                        <div className="rp-score-fill" style={{ width: d.score + '%', background: d.score >= 85 ? '#16a34a' : d.score >= 70 ? '#d97706' : '#dc2626' }}></div>
                      </div>
                      <span className="num rp-score-v">{d.score}</span>
                    </div>
                  </td>
                  <td>
                    <span className={'rp-delta mono ' + (d.eventsDelta < 0 ? 'good' : d.eventsDelta > 0 ? 'bad' : 'neu')}>
                      {d.eventsDelta < 0 ? '↓ ' + Math.abs(d.eventsDelta) : d.eventsDelta > 0 ? '↑ ' + d.eventsDelta : '— 0'}
                    </span>
                  </td>
                  <td>
                    <div className="rp-score">
                      <div className="rp-score-bar">
                        <div className="rp-score-fill" style={{ width: d.trainDone + '%', background: '#1e5eb5' }}></div>
                      </div>
                      <span className="num rp-score-v">{d.trainDone}%</span>
                    </div>
                  </td>
                  <td>
                    {d.score >= 90 ? <span className="chip chip-green">A · 优秀</span>
                    : d.score >= 80 ? <span className="chip chip-brand">B · 良好</span>
                    : d.score >= 70 ? <span className="chip chip-amber">C · 合格</span>
                    : <span className="chip chip-red">D · 待整改</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Monthly report preview */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-h">
          <h3>4 月月报预览 · 一键生成</h3>
          <div className="row">
            <button className="btn btn-sm">调整模板</button>
            <button className="btn btn-sm btn-primary">下载 PDF</button>
          </div>
        </div>
        <div className="card-body" style={{ background: 'var(--bg)' }}>
          <div className="rp-paper">
            <div className="rp-paper-h">
              <div>
                <div className="rp-paper-org">材料科学与工程学院 · HSE</div>
                <div className="rp-paper-title">实验室安全月度报告</div>
                <div className="rp-paper-period">2026 年 4 月（04-01 至 04-30）· 汇报人 李雪茹</div>
              </div>
              <div className="rp-paper-seal">CAUC · HSE · 2026</div>
            </div>
            <div className="rp-paper-grid">
              <div>
                <div className="rp-h2">一、总体态势</div>
                <p>全院 8 间在管实验室，本月事件总数 <strong>43 件（环比 ↓19%）</strong>，其中告警 12、违规 31。严重级告警 2 起，均 30 分钟内响应到位。</p>
                <p>整改任务 15 项，按期完成 88%，逾期 2 项（均集中于 410 实验室，已进入停用整改期）。</p>

                <div className="rp-h2">二、亮点</div>
                <ul>
                  <li>材料化学系 302 / 312 实验室连续 3 个月零违规，建议推为学院标兵；</li>
                  <li>全员培训完成率较上月提升 <strong>3 个百分点</strong>，达 91%；</li>
                  <li>大屏指挥 + 自动扣分上线后，违规响应时效由 4.2h 缩短至 1.1h。</li>
                </ul>

                <div className="rp-h2">三、需关注</div>
                <ul>
                  <li>410 功能材料合成实验室 <strong>安全积分 48 / 100</strong>，已触发关闭整改，4-28 前复检；</li>
                  <li>单人夜间操作告警仍有 3 起，建议与门禁系统联动做硬阻断；</li>
                  <li>材料物理系培训率 71%，拟下发专项函。</li>
                </ul>
              </div>
              <div>
                <div className="rp-h2">四、关键数字</div>
                <div className="rp-stats">
                  <div><span className="meta">事件</span><strong className="num">43</strong></div>
                  <div><span className="meta">告警</span><strong className="num">12</strong></div>
                  <div><span className="meta">违规</span><strong className="num">31</strong></div>
                  <div><span className="meta">整改</span><strong className="num">15</strong></div>
                  <div><span className="meta">培训率</span><strong className="num">91%</strong></div>
                  <div><span className="meta">综合分</span><strong className="num">85.6</strong></div>
                </div>

                <div className="rp-h2" style={{ marginTop: 18 }}>五、附件</div>
                <ul>
                  <li>410 整改过程资料（8 张照片）</li>
                  <li>全员培训名单 · 应训 142 / 已训 129</li>
                  <li>重大告警处置复盘（3 起）</li>
                </ul>

                <div className="rp-sign">
                  <div><span className="meta">编制</span> 李雪茹</div>
                  <div><span className="meta">审核</span> ___________</div>
                  <div><span className="meta">日期</span> 2026-04-30</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ label, v, unit, delta, good, sub }) {
  return (
    <div className="rp-hero-card">
      <div className="rp-hero-label">{label}</div>
      <div className="rp-hero-v">
        <span className="num">{v}</span>
        {unit && <span className="rp-hero-u">{unit}</span>}
        {delta && <span className={'rp-hero-d ' + (good ? 'good' : 'bad')}>{delta}</span>}
      </div>
      <div className="rp-hero-sub">{sub}</div>
    </div>
  );
}

function TwinTrend({ months, a, b }) {
  const max = Math.max(...a) * 1.2;
  const W = 560, H = 180, pL = 32, pR = 16, pT = 10, pB = 24;
  const step = (W - pL - pR) / (months.length - 1);
  const scale = v => H - pB - (v / max) * (H - pT - pB);
  const ptsA = a.map((v, i) => [pL + i * step, scale(v)]);
  const ptsB = b.map((v, i) => [pL + i * step, scale(v)]);
  const line = pts => pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');
  const area = pts => line(pts) + ` L${pts[pts.length - 1][0]},${H - pB} L${pts[0][0]},${H - pB} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="rpA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map(r => (
        <g key={r}>
          <line x1={pL} x2={W - pR} y1={pT + r * (H - pT - pB)} y2={pT + r * (H - pT - pB)} stroke="#f1f5f9" />
          <text x={pL - 6} y={pT + r * (H - pT - pB) + 3} fontSize="10" fill="#94a3b8" textAnchor="end" fontFamily="var(--font-num)">{Math.round(max * (1 - r))}</text>
        </g>
      ))}
      <path d={area(ptsA)} fill="url(#rpA)" />
      <path d={line(ptsA)} fill="none" stroke="#d97706" strokeWidth="2" />
      <path d={line(ptsB)} fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
      {ptsA.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke="#d97706" strokeWidth="2" />
          <text x={p[0]} y={p[1] - 10} fill="#475569" fontSize="11" textAnchor="middle" fontWeight="600" fontFamily="var(--font-num)">{a[i]}</text>
        </g>
      ))}
      {ptsB.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#dc2626" />)}
      {months.map((m, i) => (
        <text key={m} x={pL + i * step} y={H - 6} fontSize="11" fill="#94a3b8" textAnchor="middle">{m}</text>
      ))}
    </svg>
  );
}

function DonutChart({ types, total }) {
  const R = 54, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <svg viewBox="-70 -70 140 140" width="160" height="160">
      <circle r={R} fill="none" stroke="#f1f5f9" strokeWidth="16" />
      {types.map((t, i) => {
        const pct = t.n / total;
        const dash = C * pct;
        const offset = -C * acc;
        const el = <circle key={i} r={R} fill="none" stroke={t.color} strokeWidth="16"
          strokeDasharray={`${dash} ${C}`} strokeDashoffset={offset} transform="rotate(-90)" />;
        acc += pct;
        return el;
      })}
      <text textAnchor="middle" y="-2" fill="#0f172a" fontSize="22" fontWeight="700" fontFamily="var(--font-num)">{total}</text>
      <text textAnchor="middle" y="16" fill="#94a3b8" fontSize="10">违规总数</text>
    </svg>
  );
}

window.ReportsPage = ReportsPage;

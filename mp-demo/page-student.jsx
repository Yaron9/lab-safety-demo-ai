// ============================================================
// 学生/教师端 页面
// ============================================================

const STU_TABS = [
  { key: 'home', icon: 'home', label: '首页' },
  { key: 'book', icon: 'calendar', label: '预约' },
  { key: 'train', icon: 'book', label: '培训', dot: true },
  { key: 'msg', icon: 'bell', label: '消息', badge: 2 },
  { key: 'me', icon: 'user', label: '我的' },
];

// ============================================================
// 首页 · 学生 · 挂黄牌状态
// ============================================================
const StuHomePage = ({ onNav }) => {
  const u = MP.student;
  // 累积扣分制（PDF 试行版）：points 越高越严重；满 12 分挂牌、权限暂停
  const points = SCORING.tally(u.personalViolations);
  const ceiling = SCORING.PERIOD_LIMITS.person;
  const verdict = SCORING.verdict(points, 'person');
  const pct = Math.min(100, (points / ceiling) * 100);
  const limited = verdict.tier === 'rectifying';
  const violationCount = (u.personalViolations || []).length;
  // 进度条阈值刻度 · 从 SCORING.PERSON_THRESHOLDS 反算（避免 hardcode 50% 等数字）
  const warnAt = SCORING.PERSON_THRESHOLDS.find(t => t.tier === 'warning').at;     // 6
  const warnPct = (warnAt / ceiling) * 100;                                          // 50%

  return (
    <MiniProgram
      navTitle="实验室安全"
      navTransparent
      statusColored
      tabItems={STU_TABS}
      activeTab="home"
      onTabChange={onNav}
    >
      <div className={'home-head' + (limited ? ' limited' : '')}>
        <div className="home-user">
          <div className="home-avatar">{u.avatar}</div>
          <div className="home-user-meta">
            <div className="name">
              {u.name}
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 7px', borderRadius: 4, fontSize: 11, fontWeight: 400 }}>
                {u.role}
              </span>
            </div>
            <div className="sub">{u.dept} · {u.grade}</div>
          </div>
        </div>
      </div>

      <div className="score-card">
        <div className="score-top">
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>本周期累积扣分</div>
            <div className="score-big" style={{ marginTop: 4, color: verdict.color }}>
              <span className="num">{points}</span>
              <span className="suffix">/ {ceiling}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, fontFamily: 'var(--font-num)' }}>
              {SCORING.formatPeriod(MP.today)}
            </div>
          </div>
          <div className={'score-trend ' + (verdict.tier !== 'normal' ? 'down' : '')}>
            <Icon name="warn" size={12} />
            {verdict.label}
          </div>
        </div>
        {/* 进度条：扣分占比，越满越糟（与旧 100 分制语义相反）· marker 在「警示阈值」处 */}
        <div className="score-bar">
          <div className="score-bar-fill" style={{ width: pct + '%', background: verdict.color }} />
          <div className="score-bar-marker" style={{ left: 'calc(' + warnPct + '% - 1px)' }} />
        </div>
        <div className="score-labels">
          <span>0</span>
          <span style={{ color: '#e8882b' }}>≥ {warnAt} · 学习</span>
          <span style={{ color: 'var(--wx-red)' }}>{ceiling} · 挂牌</span>
        </div>

        {/* 快捷入口 */}
        <div className="quick-grid" style={{ marginTop: 14, borderTop: '1px solid var(--line-weak)', paddingTop: 14 }}>
          <div className="quick-item" {...clickable(() => onNav('scan'), '扫码进门')}>
            <div className="quick-icon" style={{ background: 'linear-gradient(135deg,#003f88,#002d66)' }}>
              <Icon name="qr" size={20} color="#fff" />
            </div>
            扫码进门
          </div>
          <div className="quick-item" {...clickable(() => onNav('book'), '实验预约')}>
            <div className="quick-icon" style={{ background: 'linear-gradient(135deg,#4a90e2,#357abd)' }}>
              <Icon name="calendar" size={20} color="#fff" />
            </div>
            实验预约
          </div>
          <div className="quick-item" {...clickable(() => onNav('violation'), '我的违规')}>
            <div className="quick-icon" style={{ background: 'linear-gradient(135deg,#e8882b,#b8661a)' }}>
              <Icon name="warn" size={20} color="#fff" />
            </div>
            我的违规
            <span className="quick-badge">1</span>
          </div>
          <div className="quick-item" {...clickable(() => onNav('train'), '安全培训')}>
            <div className="quick-icon" style={{ background: 'linear-gradient(135deg,#c9a961,#003f88)' }}>
              <Icon name="book" size={20} color="#fff" />
            </div>
            安全培训
          </div>
          <div className="quick-item" {...clickable(() => onNav('project'), '项目报备')}>
            <div className="quick-icon" style={{ background: 'linear-gradient(135deg,#10b981,#003f88)' }}>
              <Icon name="flask" size={20} color="#fff" />
            </div>
            项目报备
          </div>
          <div className="quick-item" {...clickable(() => onNav('waste'), '废液报备')}>
            <div className="quick-icon" style={{ background: 'linear-gradient(135deg,#06b6d4,#0369a1)' }}>
              <Icon name="shield" size={20} color="#fff" />
            </div>
            废液报备
          </div>
          <div className="quick-item" {...clickable(() => onNav('purchase'), '危化品采购')}>
            <div className="quick-icon" style={{ background: 'linear-gradient(135deg,#f97316,#9a3412)' }}>
              <Icon name="flask" size={20} color="#fff" />
            </div>
            危化品采购
          </div>
          <div className="quick-item" {...clickable(() => onNav('night'), '过夜申请')}>
            <div className="quick-icon" style={{ background: 'linear-gradient(135deg,#7c3aed,#1e1b4b)' }}>
              <Icon name="bell" size={20} color="#fff" />
            </div>
            过夜申请
          </div>
        </div>
      </div>

      {/* 限制状态横幅 */}
      {limited && (
        <div className="alert-banner" onClick={() => onNav('violation')} style={{ cursor: 'pointer' }}>
          <div className="alert-banner-icon">
            <Icon name="warn" size={18} color="#fff" stroke={2.4} />
          </div>
          <div className="alert-banner-body">
            <div className="alert-banner-title">你的门禁权限已暂停</div>
            <div style={{ fontSize: 12, color: '#7a4a00', lineHeight: 1.5 }}>
              完成下方 3 项后自动恢复。预计需要 40 分钟。
            </div>
            <div className="alert-steps">
              {u.pendingSteps.map(s => (
                <span key={s.id} className={'alert-step ' + (s.done ? 'done' : 'todo')}>
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 实时看板已移除 · 学生在做实验，无需远程查看实验室；导师 / 实验室管理员端保留 */}

      {/* 今日预约 */}
      <div className="wx-card">
        <div className="wx-card-title">
          今日预约
          <span className="more" onClick={() => onNav('book')}>
            查看全部 <Icon name="chevron-right" size={12} />
          </span>
        </div>
        {MP.todayBookings.map(b => (
          <div key={b.id} className="book-item" style={{ borderTop: '0.5px solid var(--line)' }}>
            <div className="book-time">
              <div className="start">{b.start}</div>
              <div className="end">至 {b.end}</div>
            </div>
            <div className="book-meta">
              <div className="title">{b.lab}</div>
              <div className="sub">
                <span className="wx-tag green">已审批</span>
                <span>{b.topic}</span>
              </div>
            </div>
            {!b.canEnter ? (
              <div className="wx-tag gray"><Icon name="lock" size={10} /> 权限暂停</div>
            ) : (
              <div style={{ color: 'var(--wx-green)' }}><Icon name="chevron-right" size={18} /></div>
            )}
          </div>
        ))}
      </div>

      {/* 最新通知 */}
      <div className="wx-card">
        <div className="wx-card-title">
          最新通知
          <span className="more" onClick={() => onNav('msg')}>
            查看全部 <Icon name="chevron-right" size={12} />
          </span>
        </div>
        {MP.messages.slice(0, 2).map(m => (
          <div key={m.id} className="msg-item" onClick={() => m.type === 'violation' ? onNav('violation') : onNav('msg')}>
            <div className="msg-icon" style={{ background: m.iconBg, color: m.iconColor }}>
              <Icon name={m.icon} size={18} />
              {m.unread && <span className="msg-icon-badge" />}
            </div>
            <div className="msg-body">
              <div className="msg-row1">
                <span className="title">{m.title}</span>
                <span className="time">{m.time}</span>
              </div>
              <div className="msg-preview">{m.preview}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 12 }} />
    </MiniProgram>
  );
};

// ============================================================
// 预约 · 列表 + 新建
// ============================================================
// tabItems prop 让教师/学生共用此页时各自呈现自己的底部 tabbar（学生 5 格含培训 / 教师 4 格无培训）
const StuBookPage = ({ onNav, tabItems = STU_TABS }) => {
  const [tab, setTab] = React.useState('new');
  const [slot, setSlot] = React.useState('1417');

  const slots = [
    { id: '0912', time: '09:00 - 12:00', status: 'disabled', lb: '已满' },
    { id: '1316', time: '13:00 - 16:00', status: 'ok' },
    { id: '1417', time: '14:00 - 17:00', status: 'ok' },
    { id: '1720', time: '17:00 - 20:00', status: 'ok' },
    { id: '2024', time: '20:00 - 24:00', status: 'disabled', lb: '禁用' },
    { id: '0008', time: '00:00 - 08:00', status: 'disabled', lb: '禁用' },
  ];

  return (
    <MiniProgram
      navTitle="实验预约"
      tabItems={tabItems}
      activeTab="book"
      onTabChange={onNav}
    >
      <div className="mini-tabs">
        <div className={'mini-tabs-item' + (tab === 'new' ? ' active' : '')} onClick={() => setTab('new')}>新建预约</div>
        <div className={'mini-tabs-item' + (tab === 'my' ? ' active' : '')} onClick={() => setTab('my')}>我的预约</div>
      </div>

      {tab === 'new' && (
        <>
          <div className="wx-card">
            <div className="wx-card-title">实验信息</div>
            <div className="form-section" style={{ margin: 0 }}>
              <div className="form-row">
                <div className="form-label">实验室</div>
                <div className="form-ctrl">材料楼 303 · 高温烧结</div>
                <div className="form-arrow"><Icon name="chevron-right" size={16} /></div>
              </div>
              <div className="form-row">
                <div className="form-label">日期</div>
                <div className="form-ctrl">2026-04-23（周三）</div>
                <div className="form-arrow"><Icon name="chevron-right" size={16} /></div>
              </div>
              <div className="form-row">
                <div className="form-label">实验课题</div>
                <div className="form-ctrl">陶瓷基复合材料烧结工艺研究</div>
              </div>
              <div className="form-row">
                <div className="form-label">指导老师</div>
                <div className="form-ctrl">赵振华（自动从学籍获取）</div>
              </div>
              <div className="form-row">
                <div className="form-label">同行人员</div>
                <div className="form-ctrl"><span className="placeholder">请选择同行人员（可选）</span></div>
                <div className="form-arrow"><Icon name="chevron-right" size={16} /></div>
              </div>
            </div>
          </div>

          <div className="wx-card">
            <div className="wx-card-title">选择时段</div>
            <div className="slot-grid">
              {slots.map(s => (
                <div
                  key={s.id}
                  className={'slot-cell ' + (s.status === 'disabled' ? 'disabled' : (slot === s.id ? 'on' : ''))}
                  onClick={() => s.status !== 'disabled' && setSlot(s.id)}
                >
                  <div>{s.time}</div>
                  {s.lb && <div className="lb">{s.lb}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="wx-card">
            <div className="wx-card-title">安全确认</div>
            <div style={{ padding: '8px 16px 16px', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--wx-green)' }}>
                <Icon name="check" size={14} /> 《实验室基础安全》已通过 · 有效期至 2026-09-01
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--wx-green)' }}>
                <Icon name="check" size={14} /> 《高温设备操作》已通过 · 有效期至 2027-01-15
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--wx-orange)' }}>
                <Icon name="warn" size={14} /> 安全分 78 （低于 80，需导师二次签字）
              </div>
            </div>
          </div>

          <div className="mp-bottom-bar">
            <button className="wx-btn ghost" style={{ flex: 1 }} onClick={() => onNav('home')}>存为草稿</button>
            <button className="wx-btn block" style={{ flex: 3 }} onClick={() => onNav('home')}>
              提交预约 · 待教师审核
            </button>
          </div>
        </>
      )}

      {tab === 'my' && (
        <>
          <div className="wx-card">
            <div className="wx-card-title">进行中</div>
            <div className="book-item" style={{ borderTop: '0.5px solid var(--line)' }}>
              <div className="book-time">
                <div className="start">14:00</div>
                <div className="end">至 17:00</div>
              </div>
              <div className="book-meta">
                <div className="title">材料楼 303</div>
                <div className="sub">
                  <span className="wx-tag green">已审批</span>
                  <span>4月23日 · 陶瓷基复合材料</span>
                </div>
              </div>
              <div className="wx-tag gray"><Icon name="lock" size={10} /> 权限暂停</div>
            </div>
          </div>
          <div className="wx-card">
            <div className="wx-card-title">已完成（近 30 天）</div>
            <div className="book-item" style={{ borderTop: '0.5px solid var(--line)' }}>
              <div className="book-time"><div className="start">14:00</div><div className="end">3小时</div></div>
              <div className="book-meta">
                <div className="title">材料楼 303</div>
                <div className="sub"><span>4月15日 · 陶瓷基复合材料</span></div>
              </div>
              <span className="wx-tag red">违规</span>
            </div>
            <div className="book-item">
              <div className="book-time"><div className="start">09:00</div><div className="end">3小时</div></div>
              <div className="book-meta">
                <div className="title">材料楼 303</div>
                <div className="sub"><span>3月3日 · 陶瓷基复合材料</span></div>
              </div>
              <span className="wx-tag green">正常</span>
            </div>
          </div>
        </>
      )}
    </MiniProgram>
  );
};

// ============================================================
// 扫码进门（相机扫码界面）
// ============================================================
// homePage prop · 跨角色复用时返回到对应角色 home（学生 home / 教师 t-home / 管理员 p-tasks）
const StuScanPage = ({ onNav, homePage = 'home' }) => {
  return (
    <MiniProgram
      navTitle="扫一扫"
      navTransparent
      statusColored
      showBack
      onBack={() => onNav(homePage)}
      hideTabBar
      bodyBg="#000"
    >
      <div className="scan-page">
        <div className="scan-cam" />
        <div className="scan-frame">
          <div className="scan-corner tl" />
          <div className="scan-corner tr" />
          <div className="scan-corner bl" />
          <div className="scan-corner br" />
          <div className="scan-line" />
        </div>
        <div className="scan-hint">
          将实验室门口二维码放入框内<br/>
          <span style={{ fontSize: 11, opacity: 0.7 }}>系统将核验你的预约、培训与权限</span>
        </div>
        <div className="scan-foot">
          <div className="scan-foot-btn">
            <div className="ic"><Icon name="flash" size={20} color="#fff"/></div>
            闪光灯
          </div>
          <div className="scan-foot-btn">
            <div className="ic"><Icon name="qr" size={20} color="#fff"/></div>
            相册
          </div>
          <div className="scan-foot-btn" onClick={() => onNav('scan-result')}>
            <div className="ic" style={{ background: 'rgba(7,193,96,0.9)' }}><Icon name="check" size={22} color="#fff"/></div>
            模拟识别
          </div>
        </div>
      </div>
    </MiniProgram>
  );
};

// 扫码结果（被拦截）· cta 仅学生场景显示「立即完成培训与整改」按钮
const StuScanResultPage = ({ onNav, showStudentCta = true }) => {
  return (
    <MiniProgram
      navTitle="进门核验"
      showBack
      onBack={() => onNav('scan')}
      hideTabBar
    >
      <div className="scan-result-card">
        <div className="scan-result-icon warn">
          <Icon name="warn" size={30} stroke={2.2}/>
        </div>
        <div className="scan-result-title">无法进入</div>
        <div className="scan-result-sub">门禁权限已暂停，请先完成培训与整改</div>
      </div>

      <div className="wx-card">
        <div className="wx-card-title">核验明细</div>
        <div className="wx-list">
          <div className="wx-cell">
            <div className="wx-cell-hd" style={{ width: 32 }}><Icon name="map-pin" size={18} color="#4a6fa5"/></div>
            <div className="wx-cell-bd">
              <div className="wx-cell-bd-title">材料楼 303</div>
              <div className="wx-cell-bd-desc">高温烧结实验室</div>
            </div>
          </div>
          <div className="wx-cell">
            <div className="wx-cell-hd" style={{ width: 32 }}><Icon name="check-circle" size={18} color="#003f88"/></div>
            <div className="wx-cell-bd">
              <div className="wx-cell-bd-title">预约核验 · 通过</div>
              <div className="wx-cell-bd-desc">14:00 - 17:00 · 已审批</div>
            </div>
          </div>
          <div className="wx-cell">
            <div className="wx-cell-hd" style={{ width: 32 }}><Icon name="check-circle" size={18} color="#003f88"/></div>
            <div className="wx-cell-bd">
              <div className="wx-cell-bd-title">培训核验 · 通过</div>
              <div className="wx-cell-bd-desc">基础安全 / 高温设备</div>
            </div>
          </div>
          <div className="wx-cell">
            <div className="wx-cell-hd" style={{ width: 32 }}><Icon name="x-circle" size={18} color="#d4453a"/></div>
            <div className="wx-cell-bd">
              <div className="wx-cell-bd-title" style={{ color: 'var(--wx-red)' }}>权限核验 · 拦截</div>
              <div className="wx-cell-bd-desc">账号挂黄牌，门禁暂停</div>
            </div>
          </div>
        </div>
      </div>

      {showStudentCta && (
        <div style={{ padding: '0 16px' }}>
          <button className="wx-btn block" onClick={() => onNav('train')}>
            <Icon name="book" size={16} color="#fff"/> 立即完成培训与整改
          </button>
        </div>
      )}
    </MiniProgram>
  );
};

// ============================================================
// 消息中心
// ============================================================
const StuMsgPage = ({ onNav }) => {
  return (
    <MiniProgram
      navTitle="消息"
      tabItems={STU_TABS}
      activeTab="msg"
      onTabChange={onNav}
    >
      <div style={{ background: '#fff' }}>
        {MP.messages.map(m => (
          <div
            key={m.id}
            className="msg-item"
            onClick={() => m.type === 'violation' ? onNav('violation') : alert('消息详情 · ' + m.title)}
          >
            <div className="msg-icon" style={{ background: m.iconBg, color: m.iconColor }}>
              <Icon name={m.icon} size={18} />
              {m.unread && <span className="msg-icon-badge" />}
            </div>
            <div className="msg-body">
              <div className="msg-row1">
                <span className="title">{m.title}</span>
                <span className="time">{m.time}</span>
              </div>
              <div className="msg-preview">{m.preview}</div>
            </div>
          </div>
        ))}
      </div>
    </MiniProgram>
  );
};

Object.assign(window, {
  STU_TABS, StuHomePage, StuBookPage, StuScanPage, StuScanResultPage, StuMsgPage,
});

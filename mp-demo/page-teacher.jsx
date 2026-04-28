// ============================================================
// 教师 / 导师端页面（与学生共享大部分功能，多了"待审工作台"和"我的学生"）
// ============================================================

const TEA_TABS = [
  { key: 't-home', icon: 'home', label: '首页' },
  { key: 'book', icon: 'calendar', label: '预约' },
  { key: 't-msg', icon: 'bell', label: '消息', badge: 3 },
  { key: 't-me', icon: 'user', label: '我的' },
];

// ---------- 教师待审 mock ----------
const TEA_PENDING = [
  {
    id: 'AP-V20250307-018',
    kind: 'appeal',
    title: '张一凡 · 夜间单人作业申诉',
    sub: '扣 2 分 · 3月7日 22:40 · 材料楼 303',
    time: '8 分钟前',
    tag: '申诉复核',
    tagCls: 'red',
    urgent: true,
  },
  {
    id: 'AP-BK-2025031001',
    kind: 'booking',
    title: '刘梓萱 · 夜间加班申请',
    sub: '3月11日 20:00 — 23:30 · 材料楼 303',
    time: '35 分钟前',
    tag: '预约审批',
    tagCls: 'blue',
  },
  {
    id: 'AP-CHEM-042',
    kind: 'chem',
    title: '陈昊 · 冰醋酸领用',
    sub: '领用 500ml · 用于陶瓷前驱体溶解',
    time: '1 小时前',
    tag: '危化领用',
    tagCls: 'orange',
  },
  {
    id: 'AP-RECT-011',
    kind: 'rectify',
    title: '王磊 · 废液标签整改复核',
    sub: '已上传 4 张照片 · 巡查员复检待签字',
    time: '昨天',
    tag: '整改签字',
    tagCls: 'gold',
  },
  {
    id: 'AP-PROJ-2026-04',
    kind: 'project',
    title: '张一凡 · 聚合物固态电解质制备',
    sub: '中风险 · 涉及锂金属（手套箱内）· 312 实验室',
    time: '12 分钟前',
    tag: '项目审核',
    tagCls: 'blue',
    projectId: 'proj-2026-04',
  },
];

const TEA_STUDENTS = [
  { name: '张一凡', grade: '研三', score: 78, flag: 'yellow', tag: '挂黄牌', note: '夜间单人作业 · 整改中' },
  { name: '刘梓萱', grade: '研二', score: 94, flag: 'good', tag: '优秀', note: '本月 0 违规 · 安全之星候选' },
  { name: '陈昊', grade: '研二', score: 88, flag: 'ok', tag: '正常', note: '培训完成度 4/5' },
  { name: '周佳明', grade: '研一', score: 92, flag: 'ok', tag: '正常', note: '刚完成入门培训' },
  { name: '王磊', grade: '博二', score: 82, flag: 'warn', tag: '整改中', note: '废液标签缺失 · 已拍照上传' },
  { name: '李思远', grade: '博三', score: 96, flag: 'good', tag: '优秀', note: '连续 6 月零违规' },
  { name: '赵雪', grade: '研三', score: 90, flag: 'ok', tag: '正常', note: '培训完成度 5/5' },
];

// ---------- 首页 ----------
const TeaHomePage = ({ onNav, goPending }) => {
  const u = MP.teacher;
  const urgentPending = TEA_PENDING.filter(p => p.urgent);

  return (
    <MiniProgram
      hideNav
      statusColored
      tabItems={TEA_TABS}
      activeTab="t-home"
      onTabChange={onNav}
    >
      {/* 顶部 hero · 教师蓝 */}
      <div className="home-head">
        <div className="home-user">
          <div className="home-avatar">{u.avatar}</div>
          <div className="home-user-meta">
            <div className="name">
              {u.name} 老师
              <span style={{ fontSize: 11, padding: '2px 7px', background: 'rgba(201,169,97,0.25)', borderRadius: 4, border: '1px solid rgba(201,169,97,0.6)', fontWeight: 500 }}>
                导师
              </span>
            </div>
            <div className="sub">{u.title} · {u.dept}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Icon name="bell" size={22} color="#fff" />
          </div>
        </div>
      </div>

      {/* 数据卡 */}
      <div className="score-card" style={{ marginTop: -40 }}>
        <div className="between" style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>我的工作台</div>
            <div style={{ display: 'flex', gap: 24, marginTop: 10 }}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#d4453a', lineHeight: 1 }}>{TEA_PENDING.length}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>待我审批</div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#003f88', lineHeight: 1 }}>{u.students}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>指导学生</div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#c9a961', lineHeight: 1 }}>{u.labs}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>负责实验室</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 紧急待办：申诉复核 */}
      {urgentPending.length > 0 && (
        <div className="alert-banner" onClick={() => goPending(urgentPending[0])} style={{ background: 'linear-gradient(135deg,#fbe9e7 0%,#f8ddd9 100%)', borderColor: '#e8a69b', cursor: 'pointer' }}>
          <div className="alert-banner-icon" style={{ background: '#d4453a' }}>
            <Icon name="warn" size={20} color="#fff"/>
          </div>
          <div className="alert-banner-body">
            <div className="alert-banner-title" style={{ color: '#8a1f14' }}>
              {urgentPending.length} 条学生申诉待复核
            </div>
            <div style={{ fontSize: 12, color: '#5c4515', marginBottom: 6 }}>
              {urgentPending[0].title}
            </div>
            <button className="wx-btn mini" style={{ background: '#d4453a' }} onClick={() => goPending(urgentPending[0])}>
              立即复核 <Icon name="chevron-right" size={12} color="#fff"/>
            </button>
          </div>
        </div>
      )}

      {/* 待审工作台 */}
      <div className="wx-card">
        <div className="wx-card-title">
          待审工作台
          <span className="more" onClick={() => onNav('t-pending')}>
            全部 {TEA_PENDING.length} 条 <Icon name="chevron-right" size={12}/>
          </span>
        </div>
        <div className="wx-list">
          {TEA_PENDING.slice(0, 3).map(p => {
            const meta = MP_PENDING_KIND_META[p.kind] || { bg: '#f5f5f7', color: '#666', icon: 'info' };
            return (
              <div key={p.id} className="wx-cell" onClick={() => goPending(p)}>
                <div className="wx-cell-hd">
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: meta.bg, color: meta.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon name={meta.icon} size={18}/>
                  </div>
                </div>
                <div className="wx-cell-bd">
                  <div className="wx-cell-bd-title">
                    {p.title}
                    <span className={'wx-tag ' + p.tagCls}>{p.tag}</span>
                  </div>
                  <div className="wx-cell-bd-desc">{p.sub}</div>
                </div>
                <div className="wx-cell-ft" style={{ fontSize: 11 }}>{p.time}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 今日实验 · 教师和学生一样要做 */}
      <div className="wx-card">
        <div className="wx-card-title">
          今日实验
          <span className="more" onClick={() => onNav('book')}>本周 3 场 <Icon name="chevron-right" size={12}/></span>
        </div>
        <div className="wx-list">
          <div className="wx-cell">
            <div className="wx-cell-hd" style={{ width: 48 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#003f88' }}>今天</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>15:00</div>
              </div>
            </div>
            <div className="wx-cell-bd">
              <div className="wx-cell-bd-title">材料楼 303 · 高温烧结</div>
              <div className="wx-cell-bd-desc">陶瓷基复合材料对照组测试</div>
            </div>
            <div className="wx-cell-ft">
              <button className="wx-btn mini" onClick={() => onNav('scan')}>扫码进入</button>
            </div>
          </div>
          <div className="wx-cell">
            <div className="wx-cell-hd" style={{ width: 48 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>周四</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>09:00</div>
              </div>
            </div>
            <div className="wx-cell-bd">
              <div className="wx-cell-bd-title">材料楼 305 · XRD 分析</div>
              <div className="wx-cell-bd-desc">研二组实验指导</div>
            </div>
            <div className="wx-cell-ft arrow"/>
          </div>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="wx-card">
        <div className="quick-grid" style={{ padding: '14px 0' }}>
          <div className="quick-item" onClick={() => onNav('t-pending')}>
            <div className="quick-icon" style={{ background: 'linear-gradient(135deg,#d4453a,#9c2d24)' }}>
              <Icon name="pen" size={20} color="#fff"/>
            </div>
            <div>待审工作台</div>
            {TEA_PENDING.length > 0 && <span className="quick-badge">{TEA_PENDING.length}</span>}
          </div>
          <div className="quick-item" onClick={() => onNav('t-students')}>
            <div className="quick-icon" style={{ background: 'linear-gradient(135deg,#c9a961,#a8893f)' }}>
              <Icon name="users" size={20} color="#fff"/>
            </div>
            <div>我的学生</div>
          </div>
          <div className="quick-item" onClick={() => onNav('book')}>
            <div className="quick-icon" style={{ background: 'linear-gradient(135deg,#003f88,#002d66)' }}>
              <Icon name="calendar" size={20} color="#fff"/>
            </div>
            <div>实验预约</div>
          </div>
          <div className="quick-item" onClick={() => onNav('scan')}>
            <div className="quick-icon" style={{ background: 'linear-gradient(135deg,#4a6fa5,#335685)' }}>
              <Icon name="qr" size={20} color="#fff"/>
            </div>
            <div>扫码进门</div>
          </div>
        </div>
      </div>

      <div style={{ height: 16 }}/>
    </MiniProgram>
  );
};

// ---------- 待审工作台全量页 ----------
const TeaPendingListPage = ({ onNav, goPending }) => (
  <MiniProgram navTitle="待审工作台" showBack onBack={() => onNav('t-home')} hideTabBar>
    <div className="filters-bar" style={{ display: 'flex', gap: 8, padding: '10px 16px', background: '#fff', borderBottom: '0.5px solid var(--line)', overflow: 'auto' }}>
      {['全部', '申诉复核', '预约审批', '危化领用', '整改签字'].map((f, i) => (
        <span key={f} className={'wx-tag ' + (i === 0 ? 'green' : 'gray')} style={{ padding: '6px 12px', flexShrink: 0, fontSize: 12 }}>
          {f}
        </span>
      ))}
    </div>
    <div className="wx-list" style={{ marginTop: 8 }}>
      {TEA_PENDING.map(p => {
        const meta = MP_PENDING_KIND_META[p.kind] || { bg: '#f5f5f7', color: '#666', icon: 'info' };
        return (
          <div key={p.id} className="wx-cell" onClick={() => goPending(p)}>
            <div className="wx-cell-hd">
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: meta.bg, color: meta.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon name={meta.icon} size={18}/>
              </div>
            </div>
            <div className="wx-cell-bd">
              <div className="wx-cell-bd-title">
                {p.title}
                <span className={'wx-tag ' + p.tagCls}>{p.tag}</span>
              </div>
              <div className="wx-cell-bd-desc">{p.sub}</div>
            </div>
            <div className="wx-cell-ft arrow" style={{ fontSize: 11 }}>{p.time}</div>
          </div>
        );
      })}
    </div>
    <div style={{ padding: 16, textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>
      — 到底了 · 共 {TEA_PENDING.length} 条待审 —
    </div>
  </MiniProgram>
);

// ---------- 申诉复核详情页（导师端 · 仅事实补充，无判决权） ----------
// 反馈 8：驳回权移交巡查员/实验中心。导师只做事实核实，提交后移交巡查员终审。
const TeaReviewPage = ({ onNav, item }) => {
  const [reason, setReason] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const v = MP.violation;

  if (submitted) {
    return (
      <MiniProgram navTitle="补充已提交" showBack onBack={() => onNav('t-home')} hideTabBar>
        <div className="scan-result-card" style={{ marginTop: 32 }}>
          <div className="scan-result-icon ok" style={{ background: '#e5ecf5', color: '#003f88' }}>
            <Icon name="check" size={30} stroke={3}/>
          </div>
          <div className="scan-result-title">事实补充已提交</div>
          <div className="scan-result-sub" style={{ marginTop: 8 }}>
            已移交实验中心巡查员终审
          </div>
          <div style={{ marginTop: 16, padding: 12, background: '#f7f7f7', borderRadius: 8, textAlign: 'left', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
            系统将自动同步至：<br/>
            · 学生张一凡（小程序消息 · 待终审）<br/>
            · 巡查员王玉鸿（待复核队列）<br/>
            · 管理控制台事件中心
          </div>
          <div style={{ marginTop: 12, padding: 10, background: '#fff8e1', border: '1px solid #f5d97a', borderRadius: 8, fontSize: 12, color: '#7a5c00', lineHeight: 1.6 }}>
            说明：导师仅核实事实 / 补充情况，<strong>支持或驳回的最终决定由实验中心巡查员做出</strong>。
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <button className="wx-btn block" onClick={() => onNav('t-home')}>返回首页</button>
        </div>
      </MiniProgram>
    );
  }

  return (
    <MiniProgram navTitle="申诉事实补充" showBack onBack={() => onNav('t-pending')} hideTabBar>
      <div style={{ padding: '10px 16px 0', background: '#fff' }}>
        <div className="wx-tag red" style={{ marginBottom: 8 }}>扣 2 分 · 夜间单人作业</div>
        <div style={{ fontSize: 17, fontWeight: 600, color: '#000' }}>张一凡 · 材料楼 303 违规申诉</div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
          违规编号 {v.id} · 巡查员 {v.inspector} 登记
        </div>
      </div>

      <div className="wx-card" style={{ marginTop: 8 }}>
        <div className="wx-card-title">违规事实</div>
        <div style={{ padding: '0 16px 14px', fontSize: 13, color: '#333', lineHeight: 1.6 }}>
          {v.description}
        </div>
        <div className="photo-grid" style={{ paddingTop: 0 }}>
          {v.photos.slice(0, 3).map((p, i) => (
            <div key={i} className="photo-cell">
              <Icon name="camera" size={22}/>
              <div className="ph-label">{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="wx-card">
        <div className="wx-card-title">学生申诉</div>
        <div style={{ padding: '4px 16px 14px' }}>
          <div style={{ padding: 12, background: '#f7f7f7', borderRadius: 8, fontSize: 13, lineHeight: 1.65, color: '#333' }}>
            老师您好：<br/>
            {v.studentAppeal}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8 }}>
            提交于 3月8日 10:30 · 附申诉理由 1 份
          </div>
        </div>
      </div>

      <div className="wx-card">
        <div className="wx-card-title">事实补充 · 仅核实，不判决</div>
        <div style={{ padding: '4px 16px 16px' }}>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="请补充您所了解的事实情况（如：实验性质、当晚同组人员、平时表现等）。最终是否撤销由实验中心巡查员裁定。"
            style={{
              width: '100%', minHeight: 110, border: '1px solid var(--line)',
              borderRadius: 8, padding: 10, fontSize: 14, fontFamily: 'inherit',
              outline: 'none', resize: 'none',
            }}
          />
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6, lineHeight: 1.6 }}>
            提交后会作为终审参考材料推送给巡查员王玉鸿；学生会同步看到您的补充内容。
          </div>
        </div>
      </div>

      <div className="mp-bottom-bar">
        <button className="wx-btn gray" style={{ flex: 1 }} onClick={() => onNav('t-pending')}>稍后再处理</button>
        <button
          className="wx-btn"
          style={{ flex: 2 }}
          disabled={!reason.trim()}
          onClick={() => setSubmitted(true)}
        >
          提交补充 → 移交巡查员
        </button>
      </div>
    </MiniProgram>
  );
};

// ---------- 我的学生 ----------
const TeaStudentsPage = ({ onNav }) => (
  <MiniProgram navTitle="我的学生" showBack onBack={() => onNav('t-home')} hideTabBar>
    <div style={{ padding: '12px 12px 4px', display: 'flex', gap: 8 }}>
      <div style={{ flex: 1, padding: 12, background: '#fff', borderRadius: 10, textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#003f88' }}>12</div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>指导学生</div>
      </div>
      <div style={{ flex: 1, padding: 12, background: '#fff', borderRadius: 10, textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#c9a961' }}>1</div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>挂黄牌</div>
      </div>
      <div style={{ flex: 1, padding: 12, background: '#fff', borderRadius: 10, textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#d4453a' }}>2</div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>整改中</div>
      </div>
    </div>

    <div className="wx-card">
      <div className="wx-card-title">全部学生</div>
      <div className="wx-list">
        {TEA_STUDENTS.map(s => (
          <div key={s.name} className="wx-cell" onClick={() => alert(s.name + ' · 学生详情页 · 功能开发中')}>
            <div className="wx-cell-hd">
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: s.flag === 'yellow' ? '#c9a961' :
                           s.flag === 'warn' ? '#e8882b' :
                           s.flag === 'good' ? '#003f88' : '#e5e5e5',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 15
              }}>{s.name[0]}</div>
            </div>
            <div className="wx-cell-bd">
              <div className="wx-cell-bd-title">
                {s.name}
                <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 400 }}>· {s.grade}</span>
                {s.flag === 'yellow' && <span className="wx-tag yellow">{s.tag}</span>}
                {s.flag === 'warn' && <span className="wx-tag orange">{s.tag}</span>}
                {s.flag === 'good' && <span className="wx-tag blue">{s.tag}</span>}
              </div>
              <div className="wx-cell-bd-desc">{s.note}</div>
            </div>
            <div className="wx-cell-ft" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: s.score >= 90 ? '#003f88' : s.score >= 80 ? '#333' : '#c9a961' }}>
                {s.score}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-3)' }}>安全分</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ padding: 16, textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>
      · 导师可查看所有指导学生的安全分、违规与培训进度 ·
    </div>
  </MiniProgram>
);

// ---------- 教师消息中心 ----------
const TeaMsgPage = ({ onNav, goPending }) => {
  const msgs = [
    {
      kind: 'appeal', icon: 'warn', color: '#d4453a', bg: '#fbe9e7',
      title: '【申诉复核】张一凡',
      preview: '对 3月7日 扣 2 分提起申诉，理由：样品降温阶段不得中断。请在 48 小时内复核。',
      time: '8 分钟前', unread: true,
    },
    {
      kind: 'booking', icon: 'calendar', color: '#003f88', bg: '#e5ecf5',
      title: '【预约审批】刘梓萱',
      preview: '申请 3月11日 20:00 夜间加班使用材料楼 303 实验室。',
      time: '35 分钟前', unread: true,
    },
    {
      kind: 'chem', icon: 'flask', color: '#b8661a', bg: '#faf1e0',
      title: '【危化品领用】陈昊',
      preview: '申请领用冰醋酸 500ml。导师签字后自动同步至危化品台账。',
      time: '1 小时前', unread: true,
    },
    {
      kind: 'system', icon: 'info', color: '#4a6fa5', bg: '#e5ecf5',
      title: '【系统通知】月度安全报表',
      preview: '您负责的 3 间实验室 2 月安全报表已生成，本月 1 例违规（张一凡）。',
      time: '昨天', unread: false,
    },
  ];
  return (
    <MiniProgram navTitle="消息" tabItems={TEA_TABS} activeTab="t-msg" onTabChange={onNav}>
      <div className="wx-list" style={{ marginTop: 0 }}>
        {msgs.map((m, i) => (
          <div key={i} className="msg-item" onClick={() => m.kind !== 'system' ? goPending({ id: 'x' + i }) : alert('月度安全报表 · 功能开发中')}>
            <div className="msg-icon" style={{ background: m.bg, color: m.color }}>
              <Icon name={m.icon} size={20}/>
              {m.unread && <span className="msg-icon-badge"/>}
            </div>
            <div className="msg-body">
              <div className="msg-row1">
                <div className="title">{m.title}</div>
                <div className="time">{m.time}</div>
              </div>
              <div className="msg-preview">{m.preview}</div>
            </div>
          </div>
        ))}
      </div>
    </MiniProgram>
  );
};

// ---------- 教师 "我的" ----------
const TeaMePage = ({ onNav }) => {
  const u = MP.teacher;
  return (
    <MiniProgram
      navTitle="我的"
      tabItems={TEA_TABS}
      activeTab="t-me"
      onTabChange={onNav}
      navTransparent
      statusColored
    >
      <div className="me-hero">
        <div className="me-user">
          <div className="me-avatar">{u.avatar}</div>
          <div className="me-user-meta">
            <div className="name">
              {u.name}
              <span style={{ fontSize: 11, padding: '2px 7px', background: 'rgba(201,169,97,0.3)', borderRadius: 4 }}>
                导师
              </span>
            </div>
            <div className="sub">{u.title} · {u.dept}</div>
          </div>
        </div>
      </div>

      <div className="me-stats">
        <div className="me-stat"><div className="n">{u.score}</div><div className="lb">安全分</div></div>
        <div className="me-stat"><div className="n">{u.students}</div><div className="lb">指导学生</div></div>
        <div className="me-stat"><div className="n">{u.labs}</div><div className="lb">负责实验室</div></div>
      </div>

      <div className="wx-card" style={{ marginTop: 16 }}>
        <div className="wx-card-title">教学管理</div>
        <div className="wx-list">
          <div className="wx-cell" onClick={() => onNav('t-pending')}>
            <div className="wx-cell-hd" style={{ width: 32 }}><Icon name="pen" size={18} color="#d4453a"/></div>
            <div className="wx-cell-bd"><div className="wx-cell-bd-title">待审工作台</div></div>
            <div className="wx-cell-ft arrow">{TEA_PENDING.length} 条待审</div>
          </div>
          <div className="wx-cell" onClick={() => onNav('t-students')}>
            <div className="wx-cell-hd" style={{ width: 32 }}><Icon name="users" size={18} color="#c9a961"/></div>
            <div className="wx-cell-bd"><div className="wx-cell-bd-title">我的学生</div></div>
            <div className="wx-cell-ft arrow">{u.students} 人</div>
          </div>
          <div className="wx-cell" onClick={() => alert('我负责的实验室 · 功能开发中')}>
            <div className="wx-cell-hd" style={{ width: 32 }}><Icon name="flask" size={18} color="#003f88"/></div>
            <div className="wx-cell-bd"><div className="wx-cell-bd-title">我负责的实验室</div></div>
            <div className="wx-cell-ft arrow">303 / 305 / 402</div>
          </div>
          <div className="wx-cell" onClick={() => alert('教学督导记录 · 功能开发中')}>
            <div className="wx-cell-hd" style={{ width: 32 }}><Icon name="medal" size={18} color="#c9a961"/></div>
            <div className="wx-cell-bd"><div className="wx-cell-bd-title">教学督导记录</div></div>
            <div className="wx-cell-ft arrow">本年 48 次</div>
          </div>
        </div>
      </div>

      <div className="wx-card">
        <div className="wx-card-title">我的实验</div>
        <div className="wx-list">
          <div className="wx-cell" onClick={() => onNav('book')}>
            <div className="wx-cell-hd" style={{ width: 32 }}><Icon name="calendar" size={18} color="#003f88"/></div>
            <div className="wx-cell-bd"><div className="wx-cell-bd-title">预约实验室</div></div>
            <div className="wx-cell-ft arrow"/>
          </div>
          <div className="wx-cell" onClick={() => onNav('scan')}>
            <div className="wx-cell-hd" style={{ width: 32 }}><Icon name="qr" size={18} color="#003f88"/></div>
            <div className="wx-cell-bd"><div className="wx-cell-bd-title">扫码进门</div></div>
            <div className="wx-cell-ft arrow"/>
          </div>
          <div className="wx-cell" onClick={() => onNav('train')}>
            <div className="wx-cell-hd" style={{ width: 32 }}><Icon name="book" size={18} color="#c9a961"/></div>
            <div className="wx-cell-bd"><div className="wx-cell-bd-title">继续培训</div></div>
            <div className="wx-cell-ft arrow">已修 4 本</div>
          </div>
        </div>
      </div>

      <div className="me-logout" onClick={() => onNav('login')}>
        <Icon name="logout" size={14} color="#d4453a"/> &nbsp;退出登录
      </div>
      <div style={{ height: 12 }}/>
    </MiniProgram>
  );
};

// ---------- 项目审核页（导师端 · 反馈 3b 第二级审批） ----------
const TeaProjectPage = ({ onNav, item }) => {
  const projects = MP.projects || [];
  const proj = projects.find(p => p.id === item?.projectId) || projects.find(p => p.status === 'advisor-review') || projects[0];
  const [decision, setDecision] = React.useState(null);   // 'approve' | 'reject'
  const [reason, setReason] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const riskMeta = MP_PROJECT_RISK_META[proj?.riskLevel] || { label: '—', cls: 'gray' };

  if (submitted) {
    return (
      <MiniProgram navTitle="审核完成" showBack onBack={() => onNav('t-home')} hideTabBar>
        <div className="scan-result-card" style={{ marginTop: 32 }}>
          <div className={'scan-result-icon ok'}
            style={{ background: decision === 'approve' ? '#e5f5e9' : '#fbe9e7',
                     color: decision === 'approve' ? '#2e7d32' : '#d4453a' }}>
            <Icon name={decision === 'approve' ? 'check' : 'x-circle'} size={30} stroke={3}/>
          </div>
          <div className="scan-result-title">
            {decision === 'approve' ? '已通过审核 · 进入下一级' : '已驳回 · 通知学生修订'}
          </div>
          <div className="scan-result-sub" style={{ marginTop: 8 }}>
            {decision === 'approve'
              ? (proj?.riskLevel === 'low' ? '低风险走快速通道 · 准予立项' : (proj?.riskLevel === 'medium' ? '推送至 实验中心 备案' : '推送至 实验中心 + 学院终审'))
              : '学生小程序消息已通知 · 等待修订重提'}
          </div>
          <div style={{ marginTop: 16, padding: 12, background: '#f7f7f7', borderRadius: 8, textAlign: 'left', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
            系统将自动同步至：<br/>
            · 学生{proj?.applicant}（小程序消息）<br/>
            · {decision === 'approve' && proj?.riskLevel !== 'low' ? '实验中心王玉鸿（待复核队列）' : '管理控制台事件中心'}
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <button className="wx-btn block" onClick={() => onNav('t-home')}>返回首页</button>
        </div>
      </MiniProgram>
    );
  }

  if (!proj) {
    return (
      <MiniProgram navTitle="项目审核" showBack onBack={() => onNav('t-home')} hideTabBar>
        <div style={{ padding: 32, textAlign: 'center', color: '#999' }}>未找到待审项目</div>
      </MiniProgram>
    );
  }

  return (
    <MiniProgram navTitle="项目报备审核" showBack onBack={() => onNav('t-pending')} hideTabBar>
      <div style={{ padding: '10px 16px 0', background: '#fff' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          <span className={'wx-tag ' + riskMeta.cls}>{riskMeta.label}</span>
          <span className="wx-tag blue">导师审核 · 第二级</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, color: '#000' }}>{proj.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
          编号 {proj.id} · 申请人 {proj.applicant} · 实验室 {proj.lab}
        </div>
      </div>

      <div className="wx-card" style={{ marginTop: 8 }}>
        <div className="wx-card-title">SOP 摘要</div>
        <div style={{ padding: '0 16px 14px', fontSize: 13, color: '#333', lineHeight: 1.7 }}>
          {proj.sop}
        </div>
        {proj.estimatedEnd && (
          <div style={{ padding: '0 16px 14px', fontSize: 12, color: 'var(--text-2)' }}>
            预计结束：{proj.estimatedEnd}
          </div>
        )}
      </div>

      <div className="wx-card">
        <div className="wx-card-title">涉及危险源 ({proj.hazardSourcesEmbed?.length || 0})</div>
        <div className="wx-list">
          {(proj.hazardSourcesEmbed || []).map((h, i) => (
            <div key={i} className="wx-cell">
              <div className="wx-cell-bd">
                <div className="wx-cell-bd-title" style={{ fontSize: 13 }}>{h.name}</div>
                <div className="wx-cell-bd-desc">
                  <span className={'wx-tag ' + (h.severity === 'critical' ? 'red' : h.severity === 'warning' ? 'orange' : 'gray')}>
                    {h.severity === 'critical' ? '严重' : h.severity === 'warning' ? '关注' : '一般'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wx-card">
        <div className="wx-card-title">审核意见</div>
        <div style={{ padding: '4px 16px 8px', display: 'flex', gap: 10 }}>
          <div
            onClick={() => setDecision('approve')}
            style={{
              flex: 1, textAlign: 'center', padding: '12px 0',
              border: '1.5px solid ' + (decision === 'approve' ? '#2e7d32' : 'var(--line)'),
              background: decision === 'approve' ? '#e5f5e9' : '#fff',
              color: decision === 'approve' ? '#2e7d32' : '#333',
              borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer',
            }}>
            <Icon name="check-circle" size={18} color={decision === 'approve' ? '#2e7d32' : '#999'}/> 通过
          </div>
          <div
            onClick={() => setDecision('reject')}
            style={{
              flex: 1, textAlign: 'center', padding: '12px 0',
              border: '1.5px solid ' + (decision === 'reject' ? '#d4453a' : 'var(--line)'),
              background: decision === 'reject' ? '#fbe9e7' : '#fff',
              color: decision === 'reject' ? '#d4453a' : '#333',
              borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer',
            }}>
            <Icon name="x-circle" size={18} color={decision === 'reject' ? '#d4453a' : '#999'}/> 驳回
          </div>
        </div>
        <div style={{ padding: '8px 16px 16px' }}>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder={
              decision === 'reject'
                ? '请说明驳回原因（学生会看到，作为修订依据）...'
                : '通过 · 可补充建议（选填，如「请双人在场」）...'
            }
            style={{
              width: '100%', minHeight: 90, border: '1px solid var(--line)',
              borderRadius: 8, padding: 10, fontSize: 14, fontFamily: 'inherit',
              outline: 'none', resize: 'none',
            }}
          />
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6, lineHeight: 1.6 }}>
            {decision === 'approve' && (proj.riskLevel === 'low'
              ? '低风险项目导师签字即生效，无需上报。'
              : (proj.riskLevel === 'medium'
                ? '中风险项目通过后会推送至实验中心备案。'
                : '高风险项目通过后会推送至实验中心 + 学院终审。'))}
            {decision === 'reject' && '驳回后学生需修订 SOP / 危险源说明后重新提交。'}
            {!decision && '请先选择通过或驳回。'}
          </div>
        </div>
      </div>

      <div className="mp-bottom-bar">
        <button className="wx-btn gray" style={{ flex: 1 }} onClick={() => onNav('t-pending')}>稍后再处理</button>
        <button
          className={'wx-btn ' + (decision === 'reject' ? 'danger' : '')}
          style={{ flex: 2 }}
          disabled={!decision || (decision === 'reject' && !reason.trim())}
          onClick={() => setSubmitted(true)}
        >
          提交审核
        </button>
      </div>
    </MiniProgram>
  );
};

Object.assign(window, {
  TEA_TABS, TEA_PENDING, TEA_STUDENTS,
  TeaHomePage, TeaPendingListPage, TeaReviewPage, TeaStudentsPage, TeaMsgPage, TeaMePage, TeaProjectPage,
});

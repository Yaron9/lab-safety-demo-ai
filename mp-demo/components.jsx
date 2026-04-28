// ============================================================
// 微信小程序 Demo · 通用组件（frame、状态栏、胶囊按钮、tabBar、图标等）
// ============================================================

// ---------- 图标 ----------
const Icon = ({ name, size = 18, color = 'currentColor', stroke = 2 }) => {
  const s = size;
  const common = {
    width: s,
    height: s,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  switch (name) {
    case 'back': return <svg {...common}><path d="M15 18L9 12L15 6" /></svg>;
    case 'more': return <svg {...common}><circle cx="5" cy="12" r="1.4" fill={color} stroke="none"/><circle cx="12" cy="12" r="1.4" fill={color} stroke="none"/><circle cx="19" cy="12" r="1.4" fill={color} stroke="none"/></svg>;
    case 'close': return <svg {...common}><path d="M18 6L6 18M6 6L18 18"/></svg>;
    case 'home': return <svg {...common}><path d="M3 12L12 4L21 12"/><path d="M5 10V20H19V10"/></svg>;
    case 'bell': return <svg {...common}><path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"/><path d="M13.7 21C13.5 21.3 13.3 21.6 12.9 21.8C12.6 22 12.3 22 12 22C11.7 22 11.4 22 11.1 21.8C10.7 21.6 10.5 21.3 10.3 21"/></svg>;
    case 'book': return <svg {...common}><path d="M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg>;
    case 'qr': return <svg {...common}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14H17V17H14z M20 14V17M14 20H17M20 20H21"/></svg>;
    case 'user': return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21C4 16.6 7.6 13 12 13C16.4 13 20 16.6 20 21"/></svg>;
    case 'users': return <svg {...common}><circle cx="9" cy="8" r="3.5"/><path d="M3 20C3 16.7 5.7 14 9 14C12.3 14 15 16.7 15 20"/><circle cx="17" cy="9" r="2.5"/><path d="M15 14.5C15.8 14.2 16.7 14 17.6 14C19.9 14 21.8 15.8 22 18"/></svg>;
    case 'calendar': return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9H21M8 3V7M16 3V7"/></svg>;
    case 'camera': return <svg {...common}><path d="M23 19A2 2 0 0 1 21 21H3A2 2 0 0 1 1 19V8A2 2 0 0 1 3 6H7L9 3H15L17 6H21A2 2 0 0 1 23 8Z"/><circle cx="12" cy="13" r="4"/></svg>;
    case 'warn': return <svg {...common}><path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.53 21H20.47A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z"/><path d="M12 9V13" strokeWidth={2.5}/><circle cx="12" cy="17" r="1" fill={color} stroke="none"/></svg>;
    case 'check': return <svg {...common}><path d="M5 13L9 17L19 7" strokeWidth={2.5}/></svg>;
    case 'check-circle': return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M8 12L11 15L16 9" strokeWidth={2.5}/></svg>;
    case 'x-circle': return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M15 9L9 15M9 9L15 15"/></svg>;
    case 'info': return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M12 16V12M12 8H12.01"/></svg>;
    case 'chevron-right': return <svg {...common}><path d="M9 18L15 12L9 6"/></svg>;
    case 'arrow-up': return <svg {...common}><path d="M12 19V5M5 12L12 5L19 12"/></svg>;
    case 'arrow-down': return <svg {...common}><path d="M12 5V19M5 12L12 19L19 12"/></svg>;
    case 'flash': return <svg {...common}><path d="M13 2L4 13H12L11 22L20 11H12L13 2Z"/></svg>;
    case 'flask': return <svg {...common}><path d="M9 2H15M10 2V8L4 18A2 2 0 0 0 6 21H18A2 2 0 0 0 20 18L14 8V2"/><path d="M6 15H18"/></svg>;
    case 'shield': return <svg {...common}><path d="M12 2L4 6V12C4 17 8 21 12 22C16 21 20 17 20 12V6L12 2Z"/><path d="M9 12L11 14L15 10"/></svg>;
    case 'fire': return <svg {...common}><path d="M12 22C16 22 19 19 19 15C19 11 15 10 14 6C12 10 5 11 5 16C5 19.5 8 22 12 22Z"/></svg>;
    case 'bolt': return <svg {...common}><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/></svg>;
    case 'bio': return <svg {...common}><path d="M8 2V8L4 14A4 4 0 0 0 8 20H16A4 4 0 0 0 20 14L16 8V2"/><path d="M8 2H16"/><circle cx="10" cy="14" r="1" fill={color}/><circle cx="14" cy="16" r="1" fill={color}/></svg>;
    case 'mail': return <svg {...common}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7L12 13L22 7"/></svg>;
    case 'comment': return <svg {...common}><path d="M21 15A2 2 0 0 1 19 17H7L3 21V5A2 2 0 0 1 5 3H19A2 2 0 0 1 21 5Z"/></svg>;
    case 'mentor': return <svg {...common}><path d="M22 10V6A2 2 0 0 0 20 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H14M17 14V18M17 22V18M17 18H21M17 18H13"/></svg>;
    case 'list': return <svg {...common}><path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01"/></svg>;
    case 'logout': return <svg {...common}><path d="M9 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H9M16 17L21 12L16 7M21 12H9"/></svg>;
    case 'clipboard': return <svg {...common}><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4H19A2 2 0 0 1 21 6V20A2 2 0 0 1 19 22H5A2 2 0 0 1 3 20V6A2 2 0 0 1 5 4H8"/></svg>;
    case 'medal': return <svg {...common}><circle cx="12" cy="15" r="6"/><path d="M8 9L6 3L10 5L12 1L14 5L18 3L16 9"/></svg>;
    case 'lock': return <svg {...common}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7A4 4 0 0 1 16 7V11"/></svg>;
    case 'plus': return <svg {...common}><path d="M12 5V19M5 12H19"/></svg>;
    case 'pen': return <svg {...common}><path d="M12 20H21M17 3.5L20.5 7L8 19.5L3.5 20.5L4.5 16L17 3.5Z"/></svg>;
    case 'map-pin': return <svg {...common}><path d="M21 10C21 17 12 23 12 23S3 17 3 10A9 9 0 0 1 21 10Z"/><circle cx="12" cy="10" r="3"/></svg>;
    case 'flag': return <svg {...common}><path d="M4 15S5 14 8 14S13 16 16 16S20 15 20 15V3S19 4 16 4S11 2 8 2S4 3 4 3Z"/><path d="M4 22V15"/></svg>;
    case 'wifi': return <svg width={s} height={s} viewBox="0 0 18 12" fill={color}><path d="M9 10.5 A1.5 1.5 0 1 1 9 7.5 A1.5 1.5 0 1 1 9 10.5"/><path d="M9 1.5C5.5 1.5 2.5 2.9 0 5L1.4 6.4C3.5 4.6 6.1 3.5 9 3.5C11.9 3.5 14.5 4.6 16.6 6.4L18 5C15.5 2.9 12.5 1.5 9 1.5Z"/><path d="M9 5C6.7 5 4.6 5.9 3 7.4L4.4 8.8C5.7 7.7 7.3 7 9 7C10.7 7 12.3 7.7 13.6 8.8L15 7.4C13.4 5.9 11.3 5 9 5Z"/></svg>;
    case 'signal': return <svg width={s} height={s} viewBox="0 0 18 12" fill={color}><rect x="1" y="8" width="2" height="3" rx="0.5"/><rect x="5" y="6" width="2" height="5" rx="0.5"/><rect x="9" y="4" width="2" height="7" rx="0.5"/><rect x="13" y="2" width="2" height="9" rx="0.5"/></svg>;
    case 'battery': return <svg width={s*1.4} height={s*0.6} viewBox="0 0 25 12" fill="none" stroke={color}><rect x="0.5" y="0.5" width="21" height="11" rx="2.5"/><rect x="2" y="2" width="18" height="8" rx="1" fill={color}/><rect x="22.5" y="3.5" width="2" height="5" rx="1" fill={color} stroke="none"/></svg>;
    default: return null;
  }
};

// ---------- 顶部状态栏 ----------
const StatusBar = ({ onColored }) => (
  <div className={'mp-status' + (onColored ? ' on-colored' : '')}>
    <span className="mp-status-time">9:41</span>
    <div className="mp-status-right">
      <Icon name="signal" size={14} />
      <Icon name="wifi" size={14} />
      <Icon name="battery" size={16} />
    </div>
  </div>
);

// ---------- 导航栏（标题 + 胶囊按钮） ----------
const NavBar = ({ title, transparent, onBack, showBack }) => (
  <div className={'mp-nav' + (transparent ? ' transparent' : '')}>
    <div className="mp-nav-left">
      {showBack && (
        <div className="mp-nav-back" onClick={onBack}>
          <Icon name="back" size={22} />
        </div>
      )}
    </div>
    <div className="mp-nav-title">{title}</div>
    <div className="mp-capsule">
      <div className="mp-capsule-btn"><Icon name="more" size={18} /></div>
      <div className="mp-capsule-btn"><Icon name="close" size={14} stroke={2.2}/></div>
    </div>
  </div>
);

// ---------- TabBar ----------
const TabBar = ({ items, active, onChange }) => (
  <div className="mp-tabbar">
    {items.map(it => (
      <div
        key={it.key}
        className={'mp-tab-item' + (active === it.key ? ' active' : '')}
        onClick={() => onChange(it.key)}
      >
        <div className="mp-tab-icon">
          <Icon name={it.icon} size={22} stroke={active === it.key ? 2.2 : 1.8} />
        </div>
        <div>{it.label}</div>
        {it.badge > 0 && <span className="mp-tab-badge">{it.badge > 99 ? '99+' : it.badge}</span>}
        {it.dot && !it.badge && <span className="mp-tab-dot" />}
      </div>
    ))}
  </div>
);

// ---------- 小程序外壳 ----------
const MiniProgram = ({
  children,
  navTitle,
  navTransparent,
  showBack,
  onBack,
  hideNav,
  hideTabBar,
  tabItems,
  activeTab,
  onTabChange,
  statusColored,
  bodyBg,
}) => (
  <div className="mp-device">
    <div className="mp-screen" style={bodyBg ? { background: bodyBg } : undefined}>
      <StatusBar onColored={statusColored} />
      {!hideNav && (
        <NavBar
          title={navTitle}
          transparent={navTransparent}
          showBack={showBack}
          onBack={onBack}
        />
      )}
      <div className="mp-body">
        {children}
      </div>
      {!hideTabBar && tabItems && (
        <TabBar items={tabItems} active={activeTab} onChange={onTabChange} />
      )}
      <div className="mp-home-indicator" />
    </div>
  </div>
);

// ============================================================
// === MP 端 UI 元数据字典（单一真相源 · 各页面只读不改） =======
// 与 admin/MOCK 的 PROJECT_STATUS_META / PROJECT_RISK_META 语义对齐，
// 但 cls 字段使用 mp 端的 wx-tag 颜色系（red/orange/green/blue/gold/gray）
// 而非 admin 端的 chip-* class。新增 kind/status 时只改这一处。
// ============================================================

const MP_PROJECT_STATUS_META = {
  active:           { label: '进行中',          cls: 'green' },
  rejected:         { label: '已驳回 · 待修订', cls: 'red' },
  'advisor-review': { label: '导师审核中',      cls: 'orange' },
  'center-review':  { label: '实验中心审核',    cls: 'orange' },
  'dean-review':    { label: '学院终审',        cls: 'orange' },
  closed:           { label: '已结案',          cls: 'gray' },
  draft:            { label: '草稿',            cls: 'gray' },
};

const MP_PROJECT_RISK_META = {
  high:   { label: '高风险', cls: 'red' },
  medium: { label: '中风险', cls: 'orange' },
  low:    { label: '低风险', cls: 'green' },
};

// 教师端 TEA_PENDING.kind 的视觉元数据（icon 用 components.jsx 的 Icon 名）
const MP_PENDING_KIND_META = {
  appeal:   { tagCls: 'red',    bg: '#fbe9e7', color: '#d4453a', icon: 'warn' },
  booking:  { tagCls: 'blue',   bg: '#e5ecf5', color: '#003f88', icon: 'calendar' },
  chem:     { tagCls: 'orange', bg: '#faf1e0', color: '#b8661a', icon: 'flask' },
  rectify:  { tagCls: 'gold',   bg: '#fbf4e0', color: '#8a6d28', icon: 'check-circle' },
  project:  { tagCls: 'blue',   bg: '#e5ecf5', color: '#003f88', icon: 'flask' },
  waste:    { tagCls: 'green',  bg: '#e5f5e9', color: '#2e7d32', icon: 'shield' },
  purchase: { tagCls: 'orange', bg: '#fff0d6', color: '#a04706', icon: 'mail' },
  night:    { tagCls: 'blue',   bg: '#ede9fe', color: '#5b21b6', icon: 'bell' },
};

// ============================================================
// === TeaSubmittedView · 教师/巡查员审批提交后的反馈页（抽出共享） ====
// 用于 TeaReviewPage / TeaProjectPage / PatAppealPage 等审批页提交后的
// 「图标 + 标题 + 副标题 + 同步通知列表 + 可选 amber 说明」。
// 各页只传内容、不再各自维护一份 30 行的反馈页布局。
// ============================================================
const TeaSubmittedView = ({
  navTitle,
  icon = 'check', iconBg = '#e5f5e9', iconColor = '#2e7d32',
  title, subtitle,
  syncList = [],
  footnote,
  onBack,
  backText = '返回首页',
}) => (
  <MiniProgram navTitle={navTitle} showBack onBack={onBack} hideTabBar>
    <div className="scan-result-card" style={{ marginTop: 32 }}>
      <div className="scan-result-icon ok" style={{ background: iconBg, color: iconColor }}>
        <Icon name={icon} size={30} stroke={3}/>
      </div>
      <div className="scan-result-title">{title}</div>
      {subtitle && <div className="scan-result-sub" style={{ marginTop: 8 }}>{subtitle}</div>}
      {syncList.length > 0 && (
        <div style={{ marginTop: 16, padding: 12, background: '#f7f7f7', borderRadius: 8, textAlign: 'left', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
          系统将自动同步至：<br/>
          {syncList.map((s, i) => <React.Fragment key={i}>· {s}<br/></React.Fragment>)}
        </div>
      )}
      {footnote && (
        <div style={{ marginTop: 12, padding: 10, background: '#fff8e1', border: '1px solid #f5d97a', borderRadius: 8, fontSize: 12, color: '#7a5c00', lineHeight: 1.6 }}>
          {footnote}
        </div>
      )}
    </div>
    <div style={{ padding: 16 }}>
      <button className="wx-btn block" onClick={onBack}>{backText}</button>
    </div>
  </MiniProgram>
);

// ============================================================
// === LabRealtimeCard · 我的实验室 · 实时看板（反馈 4） ============
// 学生 home / 教师 home 共用：视频缩略图（mock：色相渐变 + LIVE 标识）+
// inRoom 头像组 + 温度 + 一键呼叫负责人/巡查员（tel: 跳系统拨号）
// 仅显示 lab.contacts 配置的角色；缺数据时降级文字提示。
// ============================================================
const LabRealtimeCard = ({ lab }) => {
  if (!lab) return null;
  const inRoom = lab.inRoom ?? 0;
  const temp = lab.temp ?? '—';
  const hue = lab.camHue ?? 200;
  const contacts = lab.contacts || [];
  const lead = contacts.find(c => c.role === 'lead');
  const inspector = contacts.find(c => c.role === 'inspector');

  return (
    <div className="wx-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div style={{ fontSize: 11, color: '#999', letterSpacing: 0.5 }}>MY LAB · LIVE</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#000', marginTop: 2 }}>
            {lab.id} · {lab.name}
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{lab.dept}</div>
      </div>

      {/* mock 视频缩略图：色相渐变 + LIVE 闪烁红点 + 摄像头图标 */}
      <div style={{
        position: 'relative', height: 140, margin: '0 16px', borderRadius: 8, overflow: 'hidden',
        background: `linear-gradient(135deg, hsl(${hue}, 30%, 28%), hsl(${hue}, 35%, 14%))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ color: 'rgba(255,255,255,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Icon name="camera" size={32} color="rgba(255,255,255,0.4)" />
          <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1.5 }}>CAM-{lab.id}</div>
        </div>
        {/* LIVE 标识 */}
        <div style={{
          position: 'absolute', top: 8, left: 8,
          padding: '2px 8px', borderRadius: 3, fontSize: 10, fontWeight: 600,
          background: 'rgba(212, 69, 58, 0.92)', color: '#fff', letterSpacing: 1,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'mp-live-blink 1.2s infinite' }} />
          LIVE
        </div>
        {/* 右下角时间码 */}
        <div style={{
          position: 'absolute', bottom: 6, right: 8,
          fontSize: 10, color: 'rgba(255,255,255,0.55)',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          {new Date().toTimeString().slice(0, 8)}
        </div>
      </div>

      {/* 实时数据 + 在室人员 */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: '#999' }}>在室</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: inRoom > 0 ? '#003f88' : '#999', fontFamily: 'JetBrains Mono, monospace' }}>{inRoom}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#999' }}>温度</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#333', fontFamily: 'JetBrains Mono, monospace' }}>{temp}°C</div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          {Array.from({ length: Math.min(inRoom, 3) }).map((_, i) => (
            <div key={i} style={{
              width: 26, height: 26, borderRadius: '50%',
              background: `hsl(${(hue + i * 60) % 360}, 35%, 50%)`,
              color: '#fff', fontSize: 11, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #fff', marginLeft: i > 0 ? -6 : 0,
            }}>{['赵','李','张'][i] || '·'}</div>
          ))}
          {inRoom === 0 && <div style={{ fontSize: 11, color: '#999' }}>暂无人员</div>}
        </div>
      </div>

      {/* 通话按钮（tel: 跳拨号；当前 demo 仅展示 phone 占位） */}
      <div style={{ padding: '8px 16px 14px', display: 'flex', gap: 8 }}>
        {lead ? (
          <a href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
            className="wx-btn ghost" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', fontSize: 12, padding: '8px 0', color: '#003f88', borderColor: '#c4d2e8', background: '#f0f4fa' }}>
            ☎ 呼叫 {lead.name}（{lead.role === 'lead' ? '负责人' : '巡查员'}）
          </a>
        ) : (
          <div className="wx-btn ghost" style={{ flex: 1, textAlign: 'center', fontSize: 12, padding: '8px 0', color: '#999' }}>未配置负责人</div>
        )}
        {inspector && (
          <a href={`tel:${inspector.phone.replace(/[^0-9+]/g, '')}`}
            className="wx-btn ghost" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', fontSize: 12, padding: '8px 0', color: '#d4453a', borderColor: '#fdc6c0', background: '#fff5f3' }}>
            ☎ 呼叫巡查员
          </a>
        )}
      </div>
    </div>
  );
};

// 导出到 window
Object.assign(window, {
  Icon, StatusBar, NavBar, TabBar, MiniProgram, TeaSubmittedView, LabRealtimeCard,
  MP_PROJECT_STATUS_META, MP_PROJECT_RISK_META, MP_PENDING_KIND_META,
});

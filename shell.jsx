/* Shell + Sidebar + Topbar */
const { useState, useEffect, useMemo } = React;

const ICONS = {
  inbox: '📥', events: '⚠', labs: '🏛', people: '👥', training: '🎓', chems: '🧪', reports: '📊', settings: '⚙', bigscreen: '📺', sysmap: '🗺',
  search: '🔍', bell: '🔔', help: '?', dark: '◐',
};

function Sidebar({ page, setPage, counts }) {
  const nav = [
    { k: 'inbox', label: '今日待办', ico: ICONS.inbox, badge: counts.inbox },
    { k: 'events', label: '事件中心', ico: ICONS.events, badge: counts.events },
    { k: 'bigscreen', label: '指挥大屏', ico: ICONS.bigscreen },
  ];
  const nav2 = [
    { k: 'labs', label: '实验室台账', ico: ICONS.labs },
    { k: 'people', label: '人员档案', ico: ICONS.people },
    { k: 'training', label: '安全培训', ico: ICONS.training },
    { k: 'chems', label: '危化品 · 资产', ico: ICONS.chems },
  ];
  const nav3 = [
    { k: 'reports', label: '统计与报表', ico: ICONS.reports },
    { k: 'settings', label: '规则与设置', ico: ICONS.settings },
    { k: 'sysmap', label: '关于系统', ico: ICONS.sysmap },
  ];
  const renderItem = (n) => (
    <div key={n.k} className={'nav-item ' + (page === n.k ? 'active' : '')} onClick={() => setPage(n.k)}>
      <span className="ico">{n.ico}</span>
      <span>{n.label}</span>
      {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
    </div>
  );
  return (
    <aside className="side">
      <div className="brand">
        <div className="brand-mark">实</div>
        <div>
          <div className="brand-name">材料学院 · 实验室安全</div>
          <div className="brand-sub">管理控制台 v2.3</div>
        </div>
      </div>
      <div className="nav-group">
        <div className="nav-label">日常</div>
        {nav.map(renderItem)}
      </div>
      <div className="nav-group">
        <div className="nav-label">台账</div>
        {nav2.map(renderItem)}
      </div>
      <div className="nav-group">
        <div className="nav-label">系统</div>
        {nav3.map(renderItem)}
      </div>
      <div className="me-card">
        <div className="avatar">{MOCK.me.avatar}</div>
        <div style={{ minWidth: 0 }}>
          <div className="me-name">{MOCK.me.name}</div>
          <div className="me-role">{MOCK.me.role}</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ crumbs }) {
  return (
    <div className="topbar">
      <div className="crumb">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="muted">›</span>}
            {i === crumbs.length - 1 ? <strong>{c}</strong> : <span>{c}</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="search">
        <span className="search-ico">{ICONS.search}</span>
        <input placeholder="搜索 实验室 / 人员 / 违规记录..." />
        <span className="search-kbd">⌘K</span>
      </div>
      <div className="topbar-act">
        <button className="icon-btn" title="通知">{ICONS.bell}<span className="dot"></span></button>
        <button className="icon-btn" title="帮助">{ICONS.help}</button>
      </div>
    </div>
  );
}

window.Sidebar = Sidebar;
window.Topbar = Topbar;
window.ICONS = ICONS;

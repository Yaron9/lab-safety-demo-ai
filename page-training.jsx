/* ============================================================
   安全培训 · 合规监控台
   ------------------------------------------------------------
   定位：HSE 管理员盯合规率、抓到期、挂新课的工作页
   不是 LMS（视频/答题在小程序学生端）
   - KPI 行：合规率 / 即将到期 / 已过期 / 本月新发布
   - 三个 tab：课程目录 / 人员合规 / 公告 (历史)
   - 课程行点击 → 滑出详情面板（学员分布 + 课程内容接入位）
   - 人员行点击 → 滑出培训档案（已修课程时间线）
   ============================================================ */

const TRAINING_COURSES = [
  {
    id: 'c-101', code: 'C-101', name: '实验室安全通识', cat: 'general',
    type: 'required', audience: '全院 / 师生', renew: '一年',
    duration: '60 分钟 · 含考试',
    enrolled: 142, completed: 129, expiring: 8, expired: 2,
    publishedAt: '2025-09-01', updatedAt: '2026-03-12',
    desc: '入门必修 · 实验室通用准则 / 个人防护 / 应急处置基础',
  },
  {
    id: 'c-201', code: 'C-201', name: '危险化学品管理', cat: 'chem',
    type: 'required', audience: '涉化人员', renew: '一年',
    duration: '90 分钟 · 含考试',
    enrolled: 68, completed: 56, expiring: 5, expired: 0,
    publishedAt: '2025-09-15', updatedAt: '2026-04-01',
    desc: '化学品分类 / SDS 阅读 / 储存运输 / 三废处置',
  },
  {
    id: 'c-202', code: 'C-202', name: '废液与三废处置', cat: 'chem',
    type: 'required', audience: '涉化人员', renew: '一年',
    duration: '40 分钟 · 含考试',
    enrolled: 68, completed: 62, expiring: 1, expired: 0,
    publishedAt: '2025-10-01', updatedAt: '2026-02-20',
    desc: '废液分类 / 标签规范 / 第三方回收对接',
  },
  {
    id: 'c-301', code: 'C-301', name: '高压设备 / 压力容器', cat: 'physical',
    type: 'elective', audience: '物理系 · 测试中心', renew: '两年',
    duration: '60 分钟',
    enrolled: 24, completed: 18, expiring: 0, expired: 0,
    publishedAt: '2025-11-08', updatedAt: '2026-01-15',
    desc: '高压气瓶操作 / 密封性 / 阀门检查',
  },
  {
    id: 'c-302', code: 'C-302', name: '辐射安全', cat: 'physical',
    type: 'required', audience: '测试中心 (XRD/SEM)', renew: '两年',
    duration: '50 分钟 · 含考试',
    enrolled: 12, completed: 9, expiring: 2, expired: 0,
    publishedAt: '2025-09-20', updatedAt: '2026-04-10',
    desc: 'X 射线 / 电子束防护 / 个人剂量监测',
  },
  {
    id: 'c-401', code: 'C-401', name: '生物安全', cat: 'bio',
    type: 'required', audience: '生物医用', renew: '一年',
    duration: '45 分钟 · 含考试',
    enrolled: 14, completed: 12, expiring: 1, expired: 0,
    publishedAt: '2025-10-12', updatedAt: '2026-03-25',
    desc: '生物样本处置 / 二级生物安全柜 / 废弃物灭活',
  },
  {
    id: 'c-501', code: 'C-501', name: '应急处置 / 急救', cat: 'general',
    type: 'elective', audience: '全院推荐', renew: '一年',
    duration: '40 分钟',
    enrolled: 142, completed: 87, expiring: 0, expired: 0,
    publishedAt: '2025-09-15', updatedAt: '2026-02-01',
    desc: '心肺复苏 / 化学灼伤 / 触电急救 / 火情报警',
  },
  {
    id: 'c-601', code: 'C-601', name: '单人作业与夜间安全', cat: 'general',
    type: 'elective', audience: '全院 (夜间作业人员)', renew: '一年',
    duration: '30 分钟',
    enrolled: 48, completed: 23, expiring: 0, expired: 0,
    publishedAt: '2026-04-12', updatedAt: '2026-04-12', isNew: true,
    desc: '单人作业禁止清单 / 夜间报备 / 远程语音提醒',
  },
];

// 人员合规视图（基于现有 MOCK.people 扩充）
function buildPeopleCompliance() {
  // 给每个人造一个培训快照
  const map = {
    p01: { coursesDone: 4, coursesRequired: 5, expiring: 1, expired: 1, status: '已过期' },  // 李浩然 黄牌
    p02: { coursesDone: 5, coursesRequired: 5, expiring: 0, expired: 0, status: '合规' },     // 王语嫣
    p03: { coursesDone: 3, coursesRequired: 5, expiring: 1, expired: 1, status: '已过期' },  // 赵梓豪 黄牌
    p04: { coursesDone: 5, coursesRequired: 5, expiring: 0, expired: 0, status: '合规' },     // 孙静怡
    p05: { coursesDone: 4, coursesRequired: 5, expiring: 1, expired: 0, status: '即将到期' }, // 钱雨桐
    p06: { coursesDone: 6, coursesRequired: 6, expiring: 0, expired: 0, status: '合规' },     // 赵振华 导师
    p07: { coursesDone: 5, coursesRequired: 6, expiring: 1, expired: 0, status: '即将到期' }, // 周景明 导师
    p08: { coursesDone: 6, coursesRequired: 6, expiring: 0, expired: 0, status: '合规' },     // 王玉鸿 巡查
  };
  return MOCK.people.map(p => ({ ...p, ...(map[p.id] || {}) }));
}

const NOTICES = [
  { t: '2026-04-12', tag: 'NEW',    text: '《单人作业与夜间安全》课程上线 (C-601) · 全院推荐选修', who: '李雪茹' },
  { t: '2026-04-10', tag: 'UPDATE', text: '《辐射安全》题库更新 v3 · 测试中心 12 人需重新答题', who: '李雪茹' },
  { t: '2026-04-01', tag: 'UPDATE', text: '《危险化学品管理》新增氢氟酸专题 · 涉化 68 人需补习', who: '李雪茹' },
  { t: '2026-03-25', tag: 'UPDATE', text: '《生物安全》考题更新 v2 · 生物医用 14 人复训', who: '王玉鸿' },
  { t: '2026-03-12', tag: 'UPDATE', text: '《实验室安全通识》大纲对齐教育部 2026 新规', who: '李雪茹' },
];

const CAT_LABEL = { general: '通用', chem: '化学', physical: '物理', bio: '生物' };
const CAT_TONE  = { general: 'chip-brand', chem: 'chip-amber', physical: 'chip-gray', bio: 'chip-green' };

/* ===== sub-components ===== */

function CourseStatusChip({ c }) {
  const rate = (c.completed / c.enrolled);
  if (c.expired > 0) return <span className="chip chip-red">{c.expired} 人已过期</span>;
  if (c.expiring > 0) return <span className="chip chip-amber">{c.expiring} 人即将到期</span>;
  if (rate >= 0.95) return <span className="chip chip-green">合规 {Math.round(rate * 100)}%</span>;
  return <span className="chip chip-amber">完成 {Math.round(rate * 100)}%</span>;
}

function PersonStatusChip({ s }) {
  if (s === '合规') return <span className="chip chip-green">合规</span>;
  if (s === '即将到期') return <span className="chip chip-amber">即将到期</span>;
  if (s === '已过期') return <span className="chip chip-red">已过期</span>;
  return <span className="chip chip-gray">{s}</span>;
}

/* ===== KPI ===== */
function TrainingKPI({ overall, expiringPeople, expiredPeople, newCount }) {
  return (
    <div className="kpi-row">
      <div className="kpi">
        <div className="kpi-label">全员合规率</div>
        <div className="kpi-value" style={{ color: 'var(--green)' }}>{Math.round(overall * 100)}<span style={{ fontSize: 18, color: 'var(--ink-3)' }}> %</span></div>
        <div className="kpi-meta">应训 142 · 已合规 {Math.round(overall * 142)}</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">即将到期 (30 天内)</div>
        <div className="kpi-value" style={{ color: 'var(--amber)' }}>{expiringPeople}</div>
        <div className="kpi-meta">需提前推送补训</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">已过期 · 需重训</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{expiredPeople}</div>
        <div className="kpi-meta">超期未训 · 已暂停门禁</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">本月新发布</div>
        <div className="kpi-value">{newCount}</div>
        <div className="kpi-meta">课程 / 题库更新</div>
      </div>
    </div>
  );
}

/* ===== Course tab ===== */
function CoursesTab({ onOpen }) {
  const [filter, setFilter] = React.useState('all');
  const courses = TRAINING_COURSES.filter(c => {
    if (filter === 'required') return c.type === 'required';
    if (filter === 'elective') return c.type === 'elective';
    if (filter === 'attention') return c.expired > 0 || c.expiring > 0;
    if (filter === 'new') return c.isNew;
    return true;
  });
  const counts = {
    all: TRAINING_COURSES.length,
    required: TRAINING_COURSES.filter(c => c.type === 'required').length,
    elective: TRAINING_COURSES.filter(c => c.type === 'elective').length,
    attention: TRAINING_COURSES.filter(c => c.expired > 0 || c.expiring > 0).length,
    new: TRAINING_COURSES.filter(c => c.isNew).length,
  };

  return (
    <>
      <div className="filters">
        {[
          { k: 'all', l: '全部', n: counts.all },
          { k: 'required', l: '必修', n: counts.required },
          { k: 'elective', l: '选修', n: counts.elective },
          { k: 'attention', l: '🟡 需关注', n: counts.attention },
          { k: 'new', l: '✨ 本月新发布', n: counts.new },
        ].map(x => (
          <button key={x.k} className={'pill ' + (filter === x.k ? 'active' : '')} onClick={() => setFilter(x.k)}>
            {x.l} · {x.n}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-2)' }}>共 {courses.length} 门</span>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 80 }}>编号</th>
              <th>课程</th>
              <th>类型</th>
              <th>对象</th>
              <th>完成进度</th>
              <th>状态</th>
              <th style={{ width: 80 }}>更新</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => {
              const rate = c.completed / c.enrolled;
              return (
                <tr key={c.id} onClick={() => onOpen(c)}>
                  <td className="mono"><strong>{c.code}</strong></td>
                  <td>
                    <strong>{c.name}</strong>
                    {c.isNew && <span className="chip chip-green" style={{ marginLeft: 6 }}>NEW</span>}
                    <div className="meta">{c.desc}</div>
                  </td>
                  <td>
                    {c.type === 'required'
                      ? <span className="chip chip-brand">必修</span>
                      : <span className="chip chip-gray">选修</span>}
                    <div className="meta" style={{ marginTop: 4, fontSize: 11 }}>{c.duration} · 周期 {c.renew}</div>
                  </td>
                  <td>
                    <span className={'chip ' + CAT_TONE[c.cat]}>{CAT_LABEL[c.cat]}</span>
                    <div className="meta" style={{ marginTop: 4 }}>{c.audience}</div>
                  </td>
                  <td style={{ minWidth: 160 }}>
                    <div className="row" style={{ gap: 10 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--line-2)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: rate * 100 + '%', background: rate >= 0.95 ? 'var(--green)' : rate >= 0.7 ? 'var(--amber)' : 'var(--red)', borderRadius: 3 }} />
                      </div>
                      <span className="num" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{c.completed} / {c.enrolled}</span>
                    </div>
                  </td>
                  <td><CourseStatusChip c={c} /></td>
                  <td className="meta mono" style={{ fontSize: 11 }}>{c.updatedAt.slice(5)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ===== People tab ===== */
function PeopleTab({ onOpen }) {
  const [filter, setFilter] = React.useState('all');
  const people = buildPeopleCompliance();
  const list = people.filter(p => {
    if (filter === 'attention') return p.status !== '合规';
    if (filter === 'expired') return p.status === '已过期';
    if (filter === 'expiring') return p.status === '即将到期';
    return true;
  });

  return (
    <>
      <div className="filters">
        {[
          { k: 'all', l: '全部', n: people.length },
          { k: 'attention', l: '🟡 需关注', n: people.filter(p => p.status !== '合规').length },
          { k: 'expiring', l: '即将到期', n: people.filter(p => p.status === '即将到期').length },
          { k: 'expired', l: '🔴 已过期', n: people.filter(p => p.status === '已过期').length },
        ].map(x => (
          <button key={x.k} className={'pill ' + (filter === x.k ? 'active' : '')} onClick={() => setFilter(x.k)}>
            {x.l} · {x.n}
          </button>
        ))}
        <button className="btn btn-sm btn-primary" style={{ marginLeft: 'auto' }}>批量推送补训提醒</button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>姓名</th>
              <th>角色 / 院系</th>
              <th>合规课程</th>
              <th>培训进度</th>
              <th>状态</th>
              <th style={{ width: 100 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => {
              const rate = p.coursesDone / p.coursesRequired;
              return (
                <tr key={p.id} onClick={() => onOpen(p)}>
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
                  <td><span className="num" style={{ fontWeight: 600 }}>{p.coursesDone}</span><span className="meta"> / {p.coursesRequired}</span></td>
                  <td style={{ minWidth: 140 }}>
                    <div className="row" style={{ gap: 10 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--line-2)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: rate * 100 + '%', background: rate >= 0.95 ? 'var(--green)' : rate >= 0.7 ? 'var(--amber)' : 'var(--red)', borderRadius: 3 }} />
                      </div>
                      <span className="num" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{Math.round(rate * 100)}%</span>
                    </div>
                  </td>
                  <td><PersonStatusChip s={p.status} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="btn btn-sm btn-ghost">推送提醒</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ===== Notices tab ===== */
function NoticesTab() {
  const TAG = {
    NEW:    { color: 'var(--green)', bg: 'var(--green-soft)', l: '新课' },
    UPDATE: { color: 'var(--brand)', bg: 'var(--brand-soft)', l: '更新' },
    ALERT:  { color: 'var(--red)',   bg: 'var(--red-soft)',   l: '通知' },
  };
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {NOTICES.map((n, i) => {
        const t = TAG[n.tag] || TAG.UPDATE;
        return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '90px 70px 1fr 100px',
            gap: 14, padding: '14px 16px', borderBottom: i < NOTICES.length - 1 ? '1px solid var(--line-2)' : 'none',
            alignItems: 'center',
          }}>
            <span className="meta mono">{n.t}</span>
            <span style={{
              display: 'inline-block', padding: '2px 10px', borderRadius: 4,
              fontSize: 11, fontWeight: 600, color: t.color, background: t.bg, textAlign: 'center',
            }}>{t.l}</span>
            <span>{n.text}</span>
            <span className="meta" style={{ fontSize: 12 }}>{n.who}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ===== Course detail panel ===== */
function CoursePanel({ course, onClose }) {
  if (!course) return null;
  const rate = course.completed / course.enrolled;
  return (
    <>
      <div className="panel-ov" onClick={onClose}></div>
      <div className="panel">
        <div className="panel-h">
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>
              <span className="mono">{course.code}</span> · {course.duration} · 周期 {course.renew}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>{course.name}</div>
            <div className="row" style={{ marginTop: 8, gap: 6 }}>
              {course.type === 'required'
                ? <span className="chip chip-brand">必修</span>
                : <span className="chip chip-gray">选修</span>}
              <span className={'chip ' + CAT_TONE[course.cat]}>{CAT_LABEL[course.cat]}</span>
              <span className="chip chip-gray">{course.audience}</span>
              {course.isNew && <span className="chip chip-green">本月新发布</span>}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ fontSize: 18 }}>✕</button>
        </div>

        <div style={{ padding: '18px 24px' }} className="stack-l">
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>课程介绍</div>
            <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>{course.desc}</div>
          </div>

          {/* 学员分布 */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>学员分布 · {course.enrolled} 人</div>
            <div className="grid-3" style={{ gap: 10 }}>
              <div style={{ padding: 12, background: 'var(--green-soft)', borderRadius: 6 }}>
                <div className="meta" style={{ fontSize: 11 }}>已合规</div>
                <div className="num" style={{ fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>{course.completed - course.expiring - course.expired}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--amber-soft)', borderRadius: 6 }}>
                <div className="meta" style={{ fontSize: 11 }}>即将到期</div>
                <div className="num" style={{ fontSize: 22, fontWeight: 700, color: 'var(--amber)' }}>{course.expiring}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--red-soft)', borderRadius: 6 }}>
                <div className="meta" style={{ fontSize: 11 }}>过期/未完成</div>
                <div className="num" style={{ fontSize: 22, fontWeight: 700, color: 'var(--red)' }}>{course.expired + (course.enrolled - course.completed)}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--bg)', borderRadius: 4, fontSize: 12, color: 'var(--ink-2)' }}>
              整体完成率 <strong style={{ color: rate >= 0.95 ? 'var(--green)' : 'var(--amber)' }}>{Math.round(rate * 100)}%</strong> · 发布于 {course.publishedAt} · 最后更新 {course.updatedAt}
            </div>
          </div>

          {/* 教学内容接入位 — 占位 */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>教学内容</div>
            <div style={{
              padding: 24, border: '1px dashed var(--line)', borderRadius: 8, background: 'repeating-linear-gradient(45deg, #fff, #fff 8px, #fafbfd 8px, #fafbfd 16px)',
              textAlign: 'center', color: 'var(--ink-2)',
            }}>
              <div style={{ fontSize: 28, opacity: 0.4 }}>📚</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>教学内容 · 视频 · 题库 待接入</div>
              <div className="meta" style={{ fontSize: 11, marginTop: 4 }}>
                业务方提供后接入位：MP4 / PDF / 题库 JSON / 第三方课程链接
              </div>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 8 }}>
                <button className="btn btn-sm">上传课件</button>
                <button className="btn btn-sm">导入题库</button>
                <button className="btn btn-sm">链接外部课程</button>
              </div>
            </div>
          </div>

          {/* operations */}
          <div className="row" style={{ justifyContent: 'flex-end', gap: 8, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
            <button className="btn">导出学员名单</button>
            <button className="btn">推送补训提醒</button>
            <button className="btn btn-primary">编辑课程</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== Person training transcript panel ===== */
function PersonPanel({ person, onClose }) {
  if (!person) return null;
  // 假设的培训历史
  const history = [
    { t: '2026-04-08', course: '实验室安全通识 (C-101)', result: '通过 · 92 分', tone: 'ok' },
    { t: '2026-03-22', course: '危险化学品管理 (C-201)', result: '通过 · 88 分', tone: 'ok' },
    { t: '2026-02-15', course: '应急处置 / 急救 (C-501)', result: '通过 · 94 分', tone: 'ok' },
    { t: '2025-11-08', course: '废液与三废处置 (C-202)', result: '即将到期 (剩 28 天)', tone: 'warn' },
    { t: '2025-04-02', course: '辐射安全 (C-302)', result: '已过期', tone: 'err' },
  ];
  const toneColor = { ok: 'var(--green)', warn: 'var(--amber)', err: 'var(--red)' };
  return (
    <>
      <div className="panel-ov" onClick={onClose}></div>
      <div className="panel" style={{ width: 480 }}>
        <div className="panel-h">
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{person.role} · {person.dept}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>{person.name}</div>
            <div className="row" style={{ marginTop: 8, gap: 6 }}>
              <PersonStatusChip s={person.status} />
              <span className="chip chip-gray">{person.coursesDone} / {person.coursesRequired} 课</span>
              {person.violations > 0 && <span className="chip chip-amber">{person.violations} 次违规</span>}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ fontSize: 18 }}>✕</button>
        </div>

        <div style={{ padding: '18px 24px' }} className="stack-l">
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>培训档案 · 时间线</div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {history.map((h, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '90px 1fr auto',
                  gap: 12, padding: '12px 14px',
                  borderBottom: i < history.length - 1 ? '1px solid var(--line-2)' : 'none',
                  alignItems: 'center',
                }}>
                  <span className="meta mono" style={{ fontSize: 11 }}>{h.t}</span>
                  <span style={{ fontSize: 13 }}>{h.course}</span>
                  <span style={{ fontSize: 12, color: toneColor[h.tone], fontWeight: 600 }}>{h.result}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 12, background: 'var(--amber-soft)', border: '1px solid #fde68a', borderRadius: 6, fontSize: 12 }}>
            💡 <strong>提示：</strong>该学员有 1 门课即将到期 · 1 门已过期。系统已暂停其 C-302 相关实验室门禁，需先完成补训。
          </div>

          <div className="row" style={{ justifyContent: 'flex-end', gap: 8, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
            <button className="btn">导出培训证明</button>
            <button className="btn btn-primary">推送补训通知</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== Main page ===== */
function TrainingPage() {
  const [tab, setTab] = React.useState('courses');
  const [courseOpen, setCourseOpen] = React.useState(null);
  const [personOpen, setPersonOpen] = React.useState(null);

  // KPI 反算
  const people = buildPeopleCompliance();
  const compliantCount = people.filter(p => p.status === '合规').length;
  const overall = compliantCount / people.length;
  // 推算到 142 人规模 (扩到全院)
  const scaledOverall = 0.91; // 142 人 demo 数据
  const expiringPeople = TRAINING_COURSES.reduce((s, c) => s + c.expiring, 0);
  const expiredPeople  = TRAINING_COURSES.reduce((s, c) => s + c.expired, 0);
  const newCount = TRAINING_COURSES.filter(c => c.isNew).length + 4; // 新课 + 题库更新

  return (
    <div>
      <div className="page-h">
        <div>
          <div className="page-title">安全培训 · 合规监控</div>
          <div className="page-sub">
            HSE 管理员视角 · 盯合规率 · 抓到期 · 挂新课 · 学员考试与视频在小程序学生端
          </div>
        </div>
        <div className="row">
          <button className="btn">导出合规名单</button>
          <button className="btn btn-primary">+ 发布新课程</button>
        </div>
      </div>

      <TrainingKPI overall={scaledOverall} expiringPeople={expiringPeople} expiredPeople={expiredPeople} newCount={newCount} />

      <div className="filters" style={{ marginBottom: 12 }}>
        {[
          { k: 'courses', l: '📚 课程目录', n: TRAINING_COURSES.length },
          { k: 'people', l: '👥 人员合规', n: people.length },
          { k: 'notices', l: '📢 公告 / 历史', n: NOTICES.length },
        ].map(x => (
          <button key={x.k} className={'pill ' + (tab === x.k ? 'active' : '')} onClick={() => setTab(x.k)}>
            {x.l} · {x.n}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-2)' }}>
          {tab === 'courses' && '点击课程行查看学员分布与教学内容接入位'}
          {tab === 'people' && '点击姓名查看培训档案与到期清单'}
          {tab === 'notices' && '近期发布与题库更新'}
        </span>
      </div>

      {tab === 'courses' && <CoursesTab onOpen={setCourseOpen} />}
      {tab === 'people'  && <PeopleTab onOpen={setPersonOpen} />}
      {tab === 'notices' && <NoticesTab />}

      {courseOpen && <CoursePanel course={courseOpen} onClose={() => setCourseOpen(null)} />}
      {personOpen && <PersonPanel person={personOpen} onClose={() => setPersonOpen(null)} />}
    </div>
  );
}

window.TrainingPage = TrainingPage;

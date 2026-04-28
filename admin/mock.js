/* Mock data — kept minimal & realistic, inline so prototype is self-contained */

/* === Schema 同构 · admin / mp-demo / doorplate 三端共享语义 ==================
 * labs[i]:   { id, name, dept, lead, status, level, nextInspection,
 *              temp, humidity, score, inRoom, today, hazards, note?, deadline?,
 *              hazardSources[], vacationAuth?[] }
 *   status:  'normal' | 'warning' | 'rectifying'   （三档，仅此三档）
 *   level:   1 | 2                                  （一级周检 / 二级月检）
 *   vacationAuth[i]: { studentId, studentName, fromDate, toDate, dayOnly,
 *                      grantedBy, grantedAt }
 *     寒暑假白名单（反馈 11）· 仅日间 dayOnly=true 表示禁止夜间进入
 * events[i]: { id, kind, severity, lab, time, title, detail, status,
 *              actors?, counter?, progress? }
 *   kind:    见下方 EVENT_KIND_META（单一真相源）
 *   severity:'critical' | 'warning' | 'info'
 *   status:  'active' | 'pending' | 'rectifying' | 'handled' | 'done'
 * hazardSources[i]: { id, kind, name, location, severity, ppe[], emergency, lastCheck }
 *   kind:    见下方 HAZARD_KIND_META
 *   severity:'critical' | 'warning' | 'info'
 * projects[i]: { id, title, lab, applicant, advisor, riskLevel, status,
 *                currentStep, hazardSources[], sop, estimatedEnd, timeline[] }
 *   riskLevel: 见下方 PROJECT_RISK_META
 *   status:    见下方 PROJECT_STATUS_META
 *   timeline[]: { time, title, desc, done?, current? } — 与 violation.timeline 同 schema
 * ============================================================================ */

/* === EVENT_KIND_META · UI 展示元数据的唯一来源 ============================
 * 任何页面（inbox / events / bigscreen）都从此读 label/color/scoring，
 * 禁止在页面内重新写字典。新增 kind 时只改这一处。
 * scoring=true 表示该类事件触发扣分；false 仅留痕或告警。
 * ========================================================================== */
const EVENT_KIND_META = {
  alert:      { label: '🚨 实时告警', color: 'var(--red)',   scoring: false },
  violation:  { label: '⚖ 重大违规', color: 'var(--amber)', scoring: true  },
  rectify:    { label: '🔧 整改跟进', color: 'var(--brand)', scoring: false },
  inspection: { label: '📋 检查扣分', color: 'var(--amber)', scoring: true  },
  patrol:     { label: '🔍 巡查记录', color: 'var(--ink-2)', scoring: false },
  unattended: { label: '👤 无人值守', color: 'var(--red)',   scoring: false },
};
const EVENT_KINDS_ORDER = ['alert', 'violation', 'inspection', 'unattended', 'rectify', 'patrol'];

/* === HAZARD_KIND_META · 危险源类型字典（page-hazards 唯一来源） ============ */
const HAZARD_KIND_META = {
  chemical:   { label: '化学品', icon: '🧪', color: 'var(--red)' },
  physical:   { label: '物理',   icon: '🔥', color: 'var(--amber)' },
  biological: { label: '生物',   icon: '🧫', color: 'var(--green)' },
  radiation:  { label: '辐射',   icon: '☢',  color: 'var(--purple, #8b5cf6)' },
  mechanical: { label: '机械',   icon: '⚙',  color: 'var(--brand)' },
  electrical: { label: '电气',   icon: '⚡', color: 'var(--amber)' },
  gas:        { label: '气体',   icon: '💨', color: 'var(--ink-2)' },
};
const HAZARD_KINDS_ORDER = ['chemical', 'physical', 'biological', 'radiation', 'mechanical', 'electrical', 'gas'];

/* === PROJECT_STATUS_META / PROJECT_RISK_META · 实验项目元数据 ============== */
const PROJECT_STATUS_META = {
  draft:           { label: '草稿',     color: 'var(--ink-3)', chipCls: 'chip-gray' },
  'advisor-review':{ label: '导师审核', color: 'var(--amber)', chipCls: 'chip-amber' },
  'center-review': { label: '实验中心', color: 'var(--amber)', chipCls: 'chip-amber' },
  'dean-review':   { label: '学院终审', color: 'var(--amber)', chipCls: 'chip-amber' },
  active:          { label: '进行中',   color: 'var(--brand)', chipCls: 'chip-brand' },
  closed:          { label: '已结案',   color: 'var(--green)', chipCls: 'chip-green' },
  rejected:        { label: '已驳回',   color: 'var(--red)',   chipCls: 'chip-red' },
};
const PROJECT_STATUS_ORDER = ['advisor-review', 'center-review', 'dean-review', 'active', 'closed', 'rejected'];
const PROJECT_RISK_META = {
  high:   { label: '高风险', color: 'var(--red)' },
  medium: { label: '中风险', color: 'var(--amber)' },
  low:    { label: '低风险', color: 'var(--green)' },
};

const MOCK = {
  today: '2026-04-21',
  me: { name: '李雪茹', role: '管理员 · 学院 HSE', dept: '材料科学与工程学院', avatar: '李' },
  labs: [
    {
      id: '302', name: '电化学与储能材料实验室', dept: '材料化学系', lead: '赵振华',
      status: 'normal', level: 1, nextInspection: '2026-04-28',
      temp: 22.2, humidity: 59, score: 92, inRoom: 3, today: 14,
      hazards: ['腐蚀','火灾','爆炸','中毒','高压'], note: '',
      hazardSources: [
        { id: 'hs-302-01', kind: 'chemical', name: '浓硫酸 1 L', location: '302 · 危化柜 #1',
          severity: 'critical', ppe: ['丁腈手套', '防护面屏', '耐酸围裙'],
          emergency: '大量清水冲洗 ≥ 15min · 立即就医（一级洗眼器在门口右侧）', lastCheck: '2026-04-15' },
        { id: 'hs-302-02', kind: 'chemical', name: '锂金属箔 50 g', location: '302 · 手套箱配套柜',
          severity: 'critical', ppe: ['丁腈手套', '防护眼镜', '阻燃实验服'],
          emergency: '严禁遇水 · D 类金属火灾用石墨粉扑灭，禁用水/CO₂', lastCheck: '2026-04-12' },
        { id: 'hs-302-03', kind: 'electrical', name: '电化学工作站 CHI760E', location: '302 · 工位 3',
          severity: 'warning', ppe: ['绝缘鞋'],
          emergency: '断电 → 隔离 · 切勿触碰输出端子（最高 ±10V / 1A）', lastCheck: '2026-04-10' },
      ],
      vacationAuth: [
        { studentId: 'p02', studentName: '王语嫣', fromDate: '2026-07-15', toDate: '2026-08-31',
          dayOnly: true, grantedBy: '赵振华', grantedAt: '2026-04-25' },
      ],
    },
    {
      id: '410', name: '功能材料合成实验室', dept: '材料物理系', lead: '周景明',
      status: 'rectifying', level: 1, nextInspection: '2026-04-28',
      temp: 24.1, humidity: 52, score: 48, inRoom: 0, today: 2,
      hazards: ['火灾','爆炸','高温','中毒'],
      note: '违规积分触发关闭门禁，整改至 04-28', deadline: '2026-04-28',
      hazardSources: [
        { id: 'hs-410-01', kind: 'physical', name: '管式炉 GSL-1700X', location: '410 · 工位 1',
          severity: 'critical', ppe: ['耐高温手套', '防护面屏', '阻燃实验服'],
          emergency: '断电 + 自然降温 · 严禁开炉 < 200°C · 烫伤涂烧伤膏并就医', lastCheck: '2026-04-08' },
        { id: 'hs-410-02', kind: 'gas', name: '氢气钢瓶 40 L', location: '410 · 室外气瓶柜',
          severity: 'critical', ppe: ['静电手环', '防护面屏'],
          emergency: '关阀断气 · 通风 · 拨打 119（爆炸下限 4%）', lastCheck: '2026-04-15' },
        { id: 'hs-410-03', kind: 'chemical', name: '三氯化磷 500 mL', location: '410 · 危化柜 #2',
          severity: 'critical', ppe: ['丁腈手套', '全面型防毒面具', '通风柜操作'],
          emergency: '剧毒挥发 · 防毒面具 + 撤离至上风口 · 立即就医', lastCheck: '2026-04-15' },
      ],
    },
    {
      id: 'A208', name: '色质联用与有机分析室', dept: '测试中心', lead: '钱雨桐',
      status: 'warning', level: 2, nextInspection: '2026-05-21',
      temp: 26.8, humidity: 65.4, score: 78, inRoom: 2, today: 6,
      hazards: ['火灾','中毒','高温'],
      note: '挥发性气体浓度偏高，通风已加强',
      hazardSources: [
        { id: 'hs-A208-01', kind: 'chemical', name: '氢氟酸 500 mL', location: 'A208 · 剧毒柜（双锁）',
          severity: 'critical', ppe: ['HF 专用手套', '全面型防毒面具', '耐酸围裙'],
          emergency: '皮肤接触 → 葡萄糖酸钙凝胶覆盖 + 立即就医（必须告知 HF）', lastCheck: '2026-04-19' },
        { id: 'hs-A208-02', kind: 'chemical', name: '乙腈 4 L', location: 'A208 · 易燃柜 #1',
          severity: 'warning', ppe: ['丁腈手套', '防护眼镜'],
          emergency: '远离明火 · 通风操作 · 吸入大量空气 + 就医', lastCheck: '2026-04-12' },
        { id: 'hs-A208-03', kind: 'physical', name: 'GC-MS 离子源 250°C', location: 'A208 · GC 仪器舱',
          severity: 'warning', ppe: ['耐高温手套'],
          emergency: '禁打开舱门 < 50°C · 烫伤就医', lastCheck: '2026-04-10' },
      ],
    },
    {
      id: '105', name: 'X 射线衍射分析室', dept: '测试中心', lead: '孙学明',
      status: 'warning', level: 2, nextInspection: '2026-05-21',
      temp: 21.5, humidity: 48, score: 80, inRoom: 1, today: 3,
      hazards: ['辐射','高压'],
      note: '单人操作告警 · 已通知',
      hazardSources: [
        { id: 'hs-105-01', kind: 'radiation', name: 'X 射线源 (Cu Kα)', location: '105 · XRD 主仓',
          severity: 'critical', ppe: ['辐射剂量计', '铅围裙（备用）'],
          emergency: '严禁手动开舱门 · 异常时立即关电源 → 联系辐射安全员', lastCheck: '2026-04-15' },
        { id: 'hs-105-02', kind: 'electrical', name: '高压发生器 60 kV', location: '105 · XRD 控制柜',
          severity: 'critical', ppe: ['绝缘鞋', '禁带金属饰品'],
          emergency: '断电后等 15min 放电 · 禁触摸高压端子', lastCheck: '2026-04-10' },
      ],
    },
    {
      id: '207', name: '扫描电镜测试室', dept: '测试中心', lead: '李雪茹',
      status: 'normal', level: 2, nextInspection: '2026-05-21',
      temp: 22.0, humidity: 45, score: 96, inRoom: 1, today: 2,
      hazards: ['高压','辐射'],
      hazardSources: [
        { id: 'hs-207-01', kind: 'electrical', name: 'SEM 加速电压 30 kV', location: '207 · 主机',
          severity: 'warning', ppe: ['绝缘鞋'],
          emergency: '断电 · 等 5min 放电 → 联系工程师', lastCheck: '2026-04-12' },
        { id: 'hs-207-02', kind: 'radiation', name: '二次电子 / 背散射探测器', location: '207 · 样品舱',
          severity: 'info', ppe: ['辐射剂量计（年检）'],
          emergency: '低剂量 · 正常使用即可', lastCheck: '2026-04-12' },
      ],
    },
    {
      id: '312', name: '手套箱与惰性气氛实验室', dept: '材料化学系', lead: '赵振华',
      status: 'normal', level: 2, nextInspection: '2026-05-21',
      temp: 23.5, humidity: 30, score: 94, inRoom: 2, today: 8,
      hazards: ['爆炸','低温','缺氧'],
      hazardSources: [
        { id: 'hs-312-01', kind: 'chemical', name: '锂金属（手套箱内）', location: '312 · 手套箱 A',
          severity: 'critical', ppe: ['丁腈手套（手套箱）', '防护眼镜'],
          emergency: '严禁取出手套箱 · D 类金属火灾用石墨粉', lastCheck: '2026-04-18' },
        { id: 'hs-312-02', kind: 'physical', name: '液氮杜瓦瓶 50 L', location: '312 · 制冷区',
          severity: 'warning', ppe: ['低温手套', '防护面屏'],
          emergency: '冻伤 → 温水缓慢复温（禁热水）+ 就医', lastCheck: '2026-04-10' },
        { id: 'hs-312-03', kind: 'gas', name: '氩气惰性气氛', location: '312 · 室内整体',
          severity: 'info', ppe: ['氧浓度报警器'],
          emergency: '氧 < 19.5% 立即撤离 · 通风', lastCheck: '2026-04-15' },
      ],
      vacationAuth: [
        { studentId: 'p02', studentName: '王语嫣', fromDate: '2026-07-15', toDate: '2026-07-30',
          dayOnly: true, grantedBy: '赵振华', grantedAt: '2026-04-25' },
        { studentId: 'p04', studentName: '孙静怡', fromDate: '2026-08-01', toDate: '2026-08-25',
          dayOnly: true, grantedBy: '赵振华', grantedAt: '2026-04-26' },
      ],
    },
    {
      id: '216', name: '材料力学性能测试室', dept: '材料工程系', lead: '黄志刚',
      status: 'normal', level: 2, nextInspection: '2026-05-21',
      temp: 24.0, humidity: 50, score: 90, inRoom: 1, today: 4,
      hazards: ['机械','噪声','高压'],
      hazardSources: [
        { id: 'hs-216-01', kind: 'mechanical', name: '万能试验机 100 kN', location: '216 · 工位 1',
          severity: 'warning', ppe: ['防护眼镜', '安全鞋'],
          emergency: '紧急停机按钮（红色蘑菇头）· 远离运动夹具', lastCheck: '2026-04-08' },
        { id: 'hs-216-02', kind: 'mechanical', name: '液压伺服系统 25 MPa', location: '216 · 工位 2',
          severity: 'critical', ppe: ['防护眼镜', '安全鞋'],
          emergency: '泄压 + 断电 · 严禁带压拆装管路', lastCheck: '2026-04-08' },
      ],
    },
    {
      id: 'B105', name: '生物材料细胞培养室', dept: '材料化学系', lead: '周明',
      status: 'normal', level: 2, nextInspection: '2026-05-21',
      temp: 25.0, humidity: 55, score: 88, inRoom: 2, today: 5,
      hazards: ['生物','腐蚀'],
      hazardSources: [
        { id: 'hs-B105-01', kind: 'biological', name: '大肠杆菌 K-12（BSL-1）', location: 'B105 · 生物安全柜',
          severity: 'warning', ppe: ['一次性手套', '实验服', '口罩'],
          emergency: '泄漏 → 含氯消毒液覆盖 30min · 高压灭菌 121°C 20min', lastCheck: '2026-04-19' },
        { id: 'hs-B105-02', kind: 'chemical', name: '戊二醛 25% 500 mL', location: 'B105 · 危化柜',
          severity: 'warning', ppe: ['丁腈手套', '防护眼镜', '通风柜操作'],
          emergency: '皮肤接触 → 大量清水冲洗 · 吸入 → 通风 + 就医', lastCheck: '2026-04-15' },
      ],
    },
  ],
  events: [
    { id: 'ev-01', kind: 'alert',      severity: 'critical', lab: 'A208', time: '今日 14:32', title: '长时驻留 10 小时', detail: '孙静怡 · 进入时间 04:30 · 单人连续工作', actors: ['已通知 导师', '未通知 HSE'], status: 'active', counter: '升级倒计时 07:12' },
    { id: 'ev-02', kind: 'inspection', severity: 'warning',  lab: '410',  time: '今日 10:23', title: '管式炉周围堆放可燃试剂 · 周检扣 5 分', detail: '违规者 李浩然（累计 -12 分 黄牌）· 检查人 王玉鸿（一级周检发现）', status: 'pending', counter: '申诉期剩 59h' },
    { id: 'ev-03', kind: 'rectify',    severity: 'info',     lab: '410',  time: '04-19',     title: '整改期 · 剩 3 天', detail: '周景明已提交整改报告（8 张照片）· 待你现场签字', progress: 80, status: 'pending', counter: '04-28 截止' },
    { id: 'ev-04', kind: 'inspection', severity: 'warning',  lab: '302',  time: '昨日 16:08', title: '未戴护目镜操作酸液 · 季检扣 3 分', detail: '违规者 王语嫣 · 检查人 王玉鸿（学校季度检查发现）', status: 'rectifying' },
    { id: 'ev-05', kind: 'alert',      severity: 'warning',  lab: '105',  time: '昨日 22:15', title: '单人夜间操作（禁止独自）', detail: '孙学明 · 已远程语音提醒', status: 'handled' },
    { id: 'ev-06', kind: 'alert',      severity: 'info',     lab: '207',  time: '04-19 12:05', title: '烟感报警（焊接作业误报）', detail: '3 分钟内确认处置', status: 'handled' },
    { id: 'ev-07', kind: 'patrol',     severity: 'info',     lab: 'A208', time: '04-18',     title: '废液桶未分类 · 巡查记录', detail: '钱雨桐已现场重新分类 · 不扣分（日常巡查仅留痕）', status: 'done' },
    { id: 'ev-08', kind: 'rectify',    severity: 'info',     lab: '302',  time: '04-10',     title: '电化学工作站接地线松动 整改完成', detail: '赵振华签字 · 复检合格', status: 'done' },
    { id: 'ev-09', kind: 'unattended', severity: 'critical', lab: '410',  time: '今日 13:42', title: '反应炉运行中 · 0 人在室', detail: '李浩然 13:24 离开 · 实验「催化合成 #3」未停止 · 已 18 分钟', actors: ['已通知 周景明', '已通知 王玉鸿'], status: 'active', counter: '升级倒计时 02:00' },
    { id: 'ev-10', kind: 'inspection', severity: 'info',     lab: '302',  time: '04-28',     title: '一级实验室 · 周检即将到达（剩 7 天）', detail: '检查人 王玉鸿 · 重点：危化柜双锁 / 管式炉周边 / 通风柜负载', status: 'pending', counter: '04-28 09:00 截止' },
    { id: 'ev-11', kind: 'patrol',     severity: 'info',     lab: 'A208', time: '昨日 11:20', title: '试剂瓶标签褪色 · 巡查记录', detail: '已现场提醒钱雨桐重新标注 · 不扣分', status: 'handled' },
  ],
  projects: [
    {
      id: 'proj-2026-01', title: '钠离子电池正极材料 · 高温烧结合成',
      lab: '302', applicant: '张一凡', advisor: '赵振华',
      riskLevel: 'high', status: 'active', currentStep: 4,
      hazardSources: ['hs-302-01', 'hs-302-02', 'hs-410-01'],
      sop: '高温炉 800°C 烧结 6h · 真空环境 · 单批次 ≤ 5 g · 必须双人在场',
      estimatedEnd: '2026-04-28 16:30',
      timeline: [
        { time: '03-15 09:00', title: '学生申请',     desc: '张一凡 提交项目申请书 + SOP v3.2', done: true },
        { time: '03-16 11:20', title: '导师审核',     desc: '赵振华 已签字 · 危险源核实通过', done: true },
        { time: '03-18 14:30', title: '实验中心审核', desc: '王玉鸿 现场核对危化品库存与 PPE 配置', done: true },
        { time: '03-20 10:00', title: '学院终审',     desc: '安全副院长签字 · 准予立项', done: true },
        { time: '04-21 14:00', title: '项目进行中',   desc: '当前在 302 · 实验阶段 4/6 · 双人在场', current: true },
        { time: '—',           title: '项目结束 · 归档', desc: '关闭门禁高风险标识 · 三废清单交接' },
      ],
    },
    {
      id: 'proj-2026-02', title: '锂电池电解液配方筛选',
      lab: '312', applicant: '王语嫣', advisor: '赵振华',
      riskLevel: 'medium', status: 'advisor-review', currentStep: 1,
      hazardSources: ['hs-312-01', 'hs-312-03'],
      sop: '手套箱内配制 · 单次 < 100 mL · 含氟添加剂占比 ≤ 3%',
      estimatedEnd: '2026-05-30',
      timeline: [
        { time: '04-19 16:00', title: '学生申请', desc: '王语嫣 提交申请书 + SOP v1.0', done: true },
        { time: '—',           title: '导师审核', desc: '赵振华 待签字（剩 22h）', current: true },
        { time: '—',           title: '实验中心备案', desc: '中风险项目 · 仅备案不需现场核验' },
        { time: '—',           title: '准予立项',   desc: '导师审核通过即生效' },
      ],
    },
    {
      id: 'proj-2026-03', title: 'SEM 样品形貌表征 · 镍基合金断口分析',
      lab: '207', applicant: '孙静怡', advisor: '李雪茹',
      riskLevel: 'low', status: 'closed', currentStep: 3,
      hazardSources: ['hs-207-01'],
      sop: 'SEM 标准操作 · 加速电压 ≤ 20 kV · 单次 ≤ 4h',
      estimatedEnd: '2026-04-10',
      timeline: [
        { time: '03-25 10:00', title: '学生申请', desc: '孙静怡 提交常规测试申请', done: true },
        { time: '03-25 11:30', title: '导师审核', desc: '李雪茹 当日签字（低风险走快速通道）', done: true },
        { time: '04-08 09:00', title: '项目进行中', desc: '完成 12 个样品测试', done: true },
        { time: '04-10 17:00', title: '结案归档',   desc: '数据已提交 · 项目关闭', done: true },
      ],
    },
  ],
  people: [
    { id: 'p01', name: '李浩然', role: '学生',   dept: '材料研24',  labs: ['410'],       score: 78,  status: '黄牌', violations: 2, training: 'valid' },
    { id: 'p02', name: '王语嫣', role: '学生',   dept: '材料研24',  labs: ['302'],       score: 89,  status: '正常', violations: 1, training: 'valid' },
    { id: 'p03', name: '赵梓豪', role: '学生',   dept: '材料研23',  labs: ['410'],       score: 72,  status: '黄牌', violations: 3, training: 'expiring' },
    { id: 'p04', name: '孙静怡', role: '学生',   dept: '测试中心',  labs: ['A208'],      score: 95,  status: '正常', violations: 0, training: 'valid' },
    { id: 'p05', name: '钱雨桐', role: '学生',   dept: '测试中心',  labs: ['A208'],      score: 72,  status: '黄牌', violations: 3, training: 'valid' },
    { id: 'p06', name: '赵振华', role: '导师',   dept: '材料化学系', labs: ['302','312'], score: 100, status: '正常', violations: 0, training: 'valid' },
    { id: 'p07', name: '周景明', role: '导师',   dept: '材料物理系', labs: ['410'],       score: 88,  status: '正常', violations: 1, training: 'valid' },
    { id: 'p08', name: '王玉鸿', role: '巡查员', dept: '学院 HSE',   labs: ['*'],         score: 100, status: '正常', violations: 0, training: 'valid' },
  ],
  accessFlow: [
    { t: '14:45', who: '赵振华', action: '进入', lab: '302', via: '人脸' },
    { t: '14:32', who: '孙静怡', action: '⚠ 长时驻留告警', lab: 'A208', via: '系统' },
    { t: '14:28', who: '王语嫣', action: '进入', lab: '302', via: '人脸' },
    { t: '14:10', who: '李浩然', action: '拒绝进入（整改期）', lab: '410', via: '人脸' },
    { t: '13:55', who: '钱雨桐', action: '离开', lab: 'A208', via: '人脸' },
    { t: '13:40', who: '黄志刚', action: '进入', lab: '216', via: '人脸' },
  ],
  trend7d: [22, 28, 31, 27, 35, 18, 24],
};

window.MOCK = MOCK;
window.EVENT_KIND_META = EVENT_KIND_META;
window.EVENT_KINDS_ORDER = EVENT_KINDS_ORDER;
window.HAZARD_KIND_META = HAZARD_KIND_META;
window.HAZARD_KINDS_ORDER = HAZARD_KINDS_ORDER;
window.PROJECT_STATUS_META = PROJECT_STATUS_META;
window.PROJECT_STATUS_ORDER = PROJECT_STATUS_ORDER;
window.PROJECT_RISK_META = PROJECT_RISK_META;

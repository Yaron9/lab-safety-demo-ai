// ============================================================
// 微信小程序 demo · 模拟数据
// 围绕主线故事：张一凡 · 材料楼 303 · 单人超时违规
//
// === Schema 同构 · mp-demo 与 admin 共用语义 ===
// violation.timeline[i]: { time, title, desc, done?, current? }
//   靠 done / current 标识完成 / 进行中（互斥）；array index 即步序
// TEA_PENDING[i]: { id, kind, title, sub, time, tag, tagCls, urgent }
//   kind: 'appeal' | 'booking' | 'chem' | 'rectify' | 'project'
//   注：本 Step 2 加入 'project'；其他收窄推到 Step 3
// labs[i]:    精简版（id/name/dept/lead/hazards/hazardSources），仅学生只读视图需要的字段
//             hazardSources 字段名与 admin 一致，但 mp 端只取 ppe/severity/kind/name 子集
// projects[i]:核心字段（id/title/lab/applicant/advisor/riskLevel/status/currentStep/timeline/sop/estimatedEnd）与 admin 一致；
//             但「涉及危险源」用 `hazardSourcesEmbed: [{name,kind,severity}]` 嵌入式对象数组（避免跨 admin/mp 解引用 hs-id）；
//             admin 端用 `hazardSources: ['hs-id']` id 引用 + lab.hazardSources.find(id)。两端命名故意不同以表明语义差异。
// wasteReports[i]: 学生废液固废报备（反馈 13）
//   { id, kind, vol, lab, source, note?, photos[], status, submittedBy, submittedAt, timeline[] }
//   status: 'pending' | 'accepted' | 'collecting' | 'closed'
// purchaseRequests[i]: 学生危化品采购申请（反馈 12 · 学生→导师→学院 三级审批）
//   { id, title, applicant, advisor, lab, items[], purpose, status, currentStep, timeline[] }
//   status: 'advisor-review' | 'college-review' | 'approved' | 'rejected' | 'delivered'
// nightExperiments[i]: 学生过夜实验申请（反馈 10 · 工作日 4 级 / 周末节假日 3 级）
//   { id, title, applicant, advisor, lab, dateRange, timeRange, mode,
//     scope, sop, accompanies[], emergency, status, currentStep, timeline[] }
//   mode: 'weekday' (4 级：学生→导师→实验中心→副院长) | 'weekend' (3 级：学生→导师→实验中心)
//   status: 'advisor-review' | 'center-review' | 'dean-review' | 'approved' |
//           'rejected' | 'in-progress' | 'closed'
// labs[i] += { contacts?: [{role, name, phone}] }
//   反馈 4 · 实时看板的「呼叫」按钮目标，role: 'lead' | 'inspector'
// ============================================================

window.MP = {
  // 当前用户（学生视角）
  student: {
    id: 'S2021013',
    name: '张一凡',
    avatar: '张',
    role: '学生',
    dept: '材料学院',
    grade: '研究生 · 材料工程',
    advisor: '李建国',
    score: 78,
    scoreTrend: -2,
    yellowCard: true, // 挂黄牌中
    permLimited: true,
    trainingPending: 1,
    pendingSteps: [
      { id: 'study', label: '完成安全培训', done: false },
      { id: 'quiz', label: '通过考试', done: false },
      { id: 'rectify', label: '整改拍照上传', done: false },
    ],
  },

  teacher: {
    id: 'T2018001',
    name: '李建国',
    avatar: '李',
    role: '教师',
    dept: '材料学院',
    title: '副教授 · 博士生导师',
    labs: 3,
    myLabIds: ['302', '312', '410'],   // 反馈 4 · 教师 home 实时看板列表
    students: 12,
    score: 92,
    pending: 1,
  },

  patrol: {
    id: 'P2020007',
    name: '王玉鸿',
    avatar: '王',
    role: '巡查员',
    dept: '材料学院 · 安全办',
    months: 18,
    totalLogs: 142,
    thisMonth: 12,
    rank: 2,
  },

  // 今日预约 / 课表
  todayBookings: [
    {
      id: 'BK20250310-001',
      start: '14:00',
      end: '17:00',
      lab: '材料楼 303 · 高温烧结实验室',
      topic: '陶瓷基复合材料烧结',
      status: 'approved',
      canEnter: false, // 因为挂黄牌，不能进入
    },
  ],

  // 通知 / 消息
  messages: [
    {
      id: 'MSG001',
      type: 'violation',
      title: '违规通知',
      preview: '您于 3月7日 22:40 在材料楼 303 被登记违规，扣 2 分。请查看详情并根据指引完成整改。',
      time: '3月8日 09:12',
      unread: true,
      icon: 'warn',
      iconColor: '#d4453a',
      iconBg: '#fbe9e7',
    },
    {
      id: 'MSG002',
      type: 'training',
      title: '安全培训提醒',
      preview: '您的账号已触发培训要求：请在 3 天内完成《实验室基础安全》课程并通过考试，未完成将持续暂停门禁权限。',
      time: '3月8日 09:13',
      unread: true,
      icon: 'book',
      iconColor: '#c9a961',
      iconBg: '#fbf4e0',
    },
    {
      id: 'MSG003',
      type: 'system',
      title: '系统通知',
      preview: '您的门禁权限已暂停。完成培训 + 考试 + 整改拍照后自动恢复。',
      time: '3月8日 09:13',
      unread: false,
      icon: 'info',
      iconColor: '#4a6fa5',
      iconBg: '#e5ecf5',
    },
    {
      id: 'MSG004',
      type: 'lab',
      title: '李建国 老师',
      preview: '[预约审核] 你的 3月10日 高温烧结实验预约已通过审核，请按时到达。',
      time: '3月6日 16:40',
      unread: false,
      icon: 'mentor',
      iconColor: '#003f88',
      iconBg: '#e5ecf5',
    },
  ],

  // 当前违规详情
  // timeline 是动态切片：当前是「学生已申诉 · 导师待补充事实」
  // 实际生产中 current 由后端按节点推进，本 demo 静态展示
  violation: {
    id: 'V20250307-018',
    title: '夜间单人作业超时 · 未报备',
    type: '人员行为',
    severity: '中',
    lab: '材料楼 303 · 高温烧结实验室',
    time: '2025-03-07 22:40',
    inspector: '王玉鸿',
    deducted: 2,
    description:
      '2025-03-07 22:40，管道内人脸识别超出 20:00 单人作业上限，且未提交夜间加班报备。现场照片显示 1 人独自操作烧结炉，违反《实验室夜间作业管理规定》第 4.2 条。',
    photos: [
      { label: '现场 · 单人作业' },
      { label: '门禁日志截图' },
      { label: '设备状态照片' },
    ],
    studentAppeal: '当晚 22:00 后实验已基本结束，仅在等待样品冷却期间取出过一次。同组同学 21:55 离开前已确认设备状态，未感觉存在风险，未及时申报夜间作业。',
    advisorClarify: '李建国 · 经核实学生当晚确为单人作业，但实验性质（烧结炉冷却阶段）并非高温危险，建议综合考虑情节从轻处理。',
    timeline: [
      { time: '03-07 22:40', title: '系统告警',     desc: '门禁识别：单人作业超时 2h40min', done: true },
      { time: '03-07 22:55', title: '巡查员到场',   desc: '王玉鸿 现场核实、拍照取证', done: true },
      { time: '03-08 09:12', title: '违规登记',     desc: '评定扣 2 分 · 挂黄牌 · 暂停门禁权限', done: true },
      { time: '03-08 10:05', title: '学生申诉',     desc: '张一凡 已提交申诉理由及证据（48h 内）', done: true },
      { time: '—',           title: '导师事实补充', desc: '李建国 老师 · 仅核实事实 / 补充情况，不判决', current: true },
      { time: '—',           title: '巡查员复核',   desc: '实验中心王玉鸿 · 终审：支持申诉 / 驳回申诉' },
      { time: '—',           title: '终审结论',     desc: '支持 → 撤销违规；驳回 → 进入整改' },
      { time: '—',           title: '完成整改 + 培训', desc: '触发权限恢复' },
    ],
  },

  // 培训课程
  courses: [
    {
      id: 'C101',
      title: '实验室基础安全',
      desc: '面向所有进入实验室的师生 · 必修',
      duration: 42,
      lessons: 6,
      progress: 33,
      required: true,
      badge: '强制',
      thumb: 'purple',
      icon: 'shield',
    },
    {
      id: 'C102',
      title: '危化品安全操作',
      desc: '涉及试剂使用、废液处置',
      duration: 35,
      lessons: 5,
      progress: 0,
      required: true,
      badge: '强制',
      thumb: 'orange',
      icon: 'flask',
    },
    {
      id: 'C103',
      title: '高压气瓶与高温设备',
      desc: '适合材料 / 化工类实验室',
      duration: 28,
      lessons: 4,
      progress: 100,
      thumb: 'blue',
      icon: 'fire',
    },
    {
      id: 'C104',
      title: '用电与应急处置',
      desc: '触电、火灾、人员伤害处置',
      duration: 22,
      lessons: 4,
      progress: 0,
      thumb: 'green',
      icon: 'bolt',
    },
    {
      id: 'C105',
      title: '生物与辐射安全',
      desc: '生物样本、放射源管理',
      duration: 30,
      lessons: 4,
      progress: 0,
      thumb: 'red',
      icon: 'bio',
    },
  ],

  // 当前课程章节
  currentCourse: {
    id: 'C101',
    title: '实验室基础安全',
    totalLessons: 6,
    completed: 2,
    lessons: [
      { n: 1, title: '走进实验室 · 你必须知道的 5 件事', duration: '6:24', done: true },
      { n: 2, title: '个人防护装备（PPE）正确使用', duration: '8:12', done: true },
      { n: 3, title: '夜间与节假日作业规范', duration: '7:05', current: true },
      { n: 4, title: '事故现场应急处置流程', duration: '9:38' },
      { n: 5, title: '危险废液与固体废弃物', duration: '5:47' },
      { n: 6, title: '课程总结与 10 题测验', duration: '测验', quiz: true },
    ],
  },

  // 考试题
  quiz: [
    {
      q: '发现同学在实验室独自进行高温实验且未报备，应如何处理？',
      options: [
        '不管，让他自己处理',
        '立即劝阻并报告导师或巡查员',
        '帮他一起做，避免出事',
        '等他做完再私下提醒',
      ],
      correct: 1,
    },
  ],

  // 巡查员 · 今日任务
  patrolTasks: [
    {
      id: 'T20250310-001',
      type: 'urgent',
      title: '材料楼 303 · 温湿度异常告警',
      lab: '材料楼 303',
      desc: '温度 38.2°C 超阈值，需现场核查烧结炉工况',
      time: '14:20',
      tags: ['紧急', '设备'],
    },
    {
      id: 'T20250310-002',
      type: 'routine',
      title: '材料楼 2 层 · 月度合规巡查',
      lab: '材料楼 201 / 203 / 205 / 207',
      desc: '共 4 间实验室 · 按 12 项检查清单逐项核验',
      time: '全天',
      tags: ['例行'],
    },
    {
      id: 'T20250310-003',
      type: 'normal',
      title: '危化品柜 · 抽查 A-12 柜',
      lab: '材料楼 305',
      desc: '核对台账与实物；重点检查冰醋酸余量',
      time: '16:00',
      tags: ['危化品'],
    },
    {
      id: 'T20250310-004',
      type: 'normal',
      title: '整改复检 · 王磊案',
      lab: '材料楼 402',
      desc: '复核 3月5日 登记的废液标签缺失整改结果',
      time: '17:30',
      tags: ['复检'],
    },
  ],

  // 巡查员历史记录
  patrolHistory: [
    { id: 'V20250307-018', title: '夜间单人作业超时', who: '张一凡', lab: '材料楼 303', time: '3月7日', score: -2, status: 'appealed' },
    { id: 'V20250305-014', title: '废液标签缺失', who: '王磊', lab: '材料楼 402', time: '3月5日', score: -1, status: 'rectifying' },
    { id: 'V20250303-009', title: '未佩戴护目镜', who: '刘梓萱', lab: '材料楼 207', time: '3月3日', score: -1, status: 'closed' },
    { id: 'V20250301-005', title: '危化品柜未落锁', who: '—', lab: '材料楼 305', time: '3月1日', score: -3, status: 'rectifying' },
  ],

  // 常见违规类型（登记时多选）
  violationTypes: [
    { id: 'late-alone', label: '夜间单人作业' },
    { id: 'no-ppe', label: '未佩戴 PPE' },
    { id: 'unreported', label: '未报备操作' },
    { id: 'chem-open', label: '试剂瓶敞开' },
    { id: 'chem-nolock', label: '危化柜未落锁' },
    { id: 'waste-label', label: '废液标签缺失' },
    { id: 'eat-drink', label: '实验区饮食' },
    { id: 'gas-unfixed', label: '气瓶未固定' },
    { id: 'hot-unattended', label: '加热设备无人值守' },
    { id: 'messy', label: '台面凌乱' },
    { id: 'door-open', label: '安全门长开' },
    { id: 'other', label: '其他' },
  ],

  // 实验室精简版（仅学生只读视图字段；与 admin/labs 字段子集一致）
  // 反馈 4 · 实时看板：inRoom / temp / contacts / camHue（视频缩略图色相）
  labs: [
    { id: '302', name: '电化学与储能材料实验室', dept: '材料化学系', lead: '赵振华',
      inRoom: 3, temp: 22.2, camHue: 210,
      contacts: [
        { role: 'lead', name: '赵振华', phone: '135-1206-6602' },
        { role: 'inspector', name: '王玉鸿', phone: '135-1206-6688' },
      ],
      hazards: ['腐蚀','火灾','爆炸','中毒','高压'],
      hazardSources: [
        { id: 'hs-302-01', kind: 'chemical', name: '浓硫酸 1 L', severity: 'critical', ppe: ['丁腈手套','防护面屏'] },
        { id: 'hs-302-02', kind: 'chemical', name: '锂金属箔 50 g', severity: 'critical', ppe: ['防护眼镜','阻燃实验服'] },
        { id: 'hs-302-03', kind: 'electrical', name: '电化学工作站 CHI760E', severity: 'warning', ppe: ['绝缘鞋'] },
      ] },
    { id: '410', name: '功能材料合成实验室', dept: '材料物理系', lead: '周景明',
      inRoom: 0, temp: 24.1, camHue: 0,
      contacts: [
        { role: 'lead', name: '周景明', phone: '135-1206-7301' },
        { role: 'inspector', name: '王玉鸿', phone: '135-1206-6688' },
      ],
      hazards: ['火灾','爆炸','高温','中毒'],
      hazardSources: [
        { id: 'hs-410-01', kind: 'physical', name: '管式炉 GSL-1700X', severity: 'critical', ppe: ['耐高温手套','防护面屏'] },
        { id: 'hs-410-02', kind: 'gas', name: '氢气钢瓶 40 L', severity: 'critical', ppe: ['静电手环'] },
        { id: 'hs-410-03', kind: 'chemical', name: '三氯化磷 500 mL', severity: 'critical', ppe: ['全面型防毒面具'] },
      ] },
    { id: 'A208', name: '色质联用与有机分析室', dept: '测试中心', lead: '钱雨桐',
      inRoom: 2, temp: 26.8, camHue: 25,
      contacts: [
        { role: 'lead', name: '钱雨桐', phone: '135-1206-8403' },
        { role: 'inspector', name: '王玉鸿', phone: '135-1206-6688' },
      ],
      hazards: ['火灾','中毒','高温'],
      hazardSources: [
        { id: 'hs-A208-01', kind: 'chemical', name: '氢氟酸 500 mL', severity: 'critical', ppe: ['HF 专用手套','全面型防毒面具'] },
        { id: 'hs-A208-02', kind: 'chemical', name: '乙腈 4 L', severity: 'warning', ppe: ['丁腈手套'] },
      ] },
    { id: '105', name: 'X 射线衍射分析室', dept: '测试中心', lead: '孙学明',
      hazards: ['辐射','高压'],
      hazardSources: [
        { id: 'hs-105-01', kind: 'radiation', name: 'X 射线源 (Cu Kα)', severity: 'critical', ppe: ['辐射剂量计'] },
      ] },
    { id: '207', name: '扫描电镜测试室', dept: '测试中心', lead: '李雪茹',
      hazards: ['高压','辐射'],
      hazardSources: [
        { id: 'hs-207-01', kind: 'electrical', name: 'SEM 加速电压 30 kV', severity: 'warning', ppe: ['绝缘鞋'] },
      ] },
    { id: '312', name: '手套箱与惰性气氛实验室', dept: '材料化学系', lead: '赵振华',
      inRoom: 2, temp: 23.5, camHue: 270,
      contacts: [
        { role: 'lead', name: '赵振华', phone: '135-1206-6602' },
        { role: 'inspector', name: '王玉鸿', phone: '135-1206-6688' },
      ],
      hazards: ['爆炸','低温','缺氧'],
      hazardSources: [
        { id: 'hs-312-01', kind: 'chemical', name: '锂金属（手套箱内）', severity: 'critical', ppe: ['丁腈手套'] },
        { id: 'hs-312-02', kind: 'physical', name: '液氮杜瓦瓶 50 L', severity: 'warning', ppe: ['低温手套','防护面屏'] },
      ] },
    { id: '216', name: '材料力学性能测试室', dept: '材料工程系', lead: '黄志刚',
      hazards: ['机械','噪声','高压'],
      hazardSources: [
        { id: 'hs-216-01', kind: 'mechanical', name: '万能试验机 100 kN', severity: 'warning', ppe: ['防护眼镜','安全鞋'] },
      ] },
    { id: 'B105', name: '生物材料细胞培养室', dept: '材料化学系', lead: '周明',
      hazards: ['生物','腐蚀'],
      hazardSources: [
        { id: 'hs-B105-01', kind: 'biological', name: '大肠杆菌 K-12（BSL-1）', severity: 'warning', ppe: ['一次性手套','实验服','口罩'] },
      ] },
  ],

  // 学生废液固废报备（反馈 13 · timeline 与 violation 同 schema）
  wasteReports: [
    {
      id: 'wr-2026-01', kind: '酸性废液', vol: '5 L', lab: '302',
      source: '电化学合成实验 · 项目 proj-2026-01', note: '已用专用 PE 瓶密封 · 双层标签',
      photos: ['现场照片 1', '密封容器'],
      status: 'collecting', submittedBy: '张一凡', submittedAt: '2026-04-19 16:30',
      timeline: [
        { time: '04-19 16:30', title: '学生报备',     desc: '张一凡 提交报备 + 2 张现场照片', done: true },
        { time: '04-20 09:15', title: 'HSE 接收',     desc: '王玉鸿 已接收 · 安排北京京环回收', done: true },
        { time: '04-25 14:00', title: '第三方上门',   desc: '北京京环 计划上门回收', current: true },
        { time: '—',           title: '完成回收 · 归档', desc: '凭证扫描入档' },
      ],
    },
    {
      id: 'wr-2026-02', kind: '剧毒废液 (含氟)', vol: '0.5 L', lab: 'A208',
      source: '硅基底刻蚀剩余 HF', note: '剧毒 · 双锁柜 · 需安全员现场签字交接',
      photos: ['密封容器照片'],
      status: 'pending', submittedBy: '张一凡', submittedAt: '2026-04-21 11:20',
      timeline: [
        { time: '04-21 11:20', title: '学生报备', desc: '张一凡 提交报备 + 1 张现场照片', done: true },
        { time: '—',           title: 'HSE 接收', desc: '王玉鸿 待安排回收（剧毒须双人交接）', current: true },
        { time: '—',           title: '第三方上门', desc: '环保部直派' },
        { time: '—',           title: '完成回收 · 归档', desc: '凭证扫描入档' },
      ],
    },
  ],

  // 学生危化品采购申请（反馈 12 · 学生→导师→学院 三级）
  purchaseRequests: [
    {
      id: 'pr-2026-01', title: '无水乙醇 4 L × 2 瓶 · 浓硫酸 1 L × 1 瓶',
      applicant: '张一凡', advisor: '赵振华', lab: '302',
      items: [
        { name: '无水乙醇', cas: '64-17-5', qty: 8, unit: 'L' },
        { name: '浓硫酸',   cas: '7664-93-9', qty: 1, unit: 'L' },
      ],
      purpose: '钠离子电池正极合成 · 项目 proj-2026-01 后续批次',
      status: 'college-review', currentStep: 2,
      timeline: [
        { time: '04-22 10:00', title: '学生申请', desc: '张一凡 提交采购清单 + 用途说明', done: true },
        { time: '04-22 14:30', title: '导师审核', desc: '赵振华 审核通过 · 备注「分批领用」', done: true },
        { time: '—',           title: '学院安全负责人终审', desc: '李雪茹 待审核 · 浓硫酸 ≥ 1 L 须学院签字', current: true },
        { time: '—',           title: '采购下单',     desc: '通过后 24h 内挂学院招采系统' },
        { time: '—',           title: '到货入库',     desc: 'HSE 验收 + 双锁柜入账' },
      ],
    },
    {
      id: 'pr-2026-02', title: '丙酮 4 L × 1 瓶',
      applicant: '张一凡', advisor: '赵振华', lab: '302',
      items: [{ name: '丙酮', cas: '67-64-1', qty: 4, unit: 'L' }],
      purpose: 'SEM 样品脱模 · 常规耗材',
      status: 'approved', currentStep: 4,
      timeline: [
        { time: '04-15 09:30', title: '学生申请',   desc: '张一凡 提交采购清单', done: true },
        { time: '04-15 11:00', title: '导师审核',   desc: '赵振华 审核通过', done: true },
        { time: '04-15 16:00', title: '学院终审',   desc: '常规耗材免学院审 · 自动通过', done: true },
        { time: '04-16 10:00', title: '采购下单',   desc: '已对接学院招采系统', done: true },
        { time: '04-19 14:00', title: '到货入库',   desc: 'HSE 验收 · A208 易燃柜入账', done: true },
      ],
    },
  ],

  // 学生过夜实验申请（反馈 10 · 工作日 4 级 / 周末节假日 3 级）
  nightExperiments: [
    {
      id: 'ne-2026-01', title: '钠离子电池 800°C 烧结过夜降温',
      applicant: '张一凡', advisor: '赵振华', lab: '302',
      dateRange: '2026-04-29 19:00 → 04-30 07:30', timeRange: '过夜 12.5 小时',
      mode: 'weekday',
      scope: '高温烧结后样品需在 800°C 下持续 6h 后自然降温至 50°C 以下方可取出',
      sop: '工艺已通过项目 proj-2026-01 学院终审 · 此次仅延长无人值守时段 · 现场配双人值班',
      accompanies: ['李思远（同组博三）', '陈延松（夜班巡查员）'],
      emergency: '炉温异常报警 → 联系赵振华（135-1206-6602）+ 王玉鸿（135-1206-6688）',
      status: 'dean-review', currentStep: 3,
      timeline: [
        { time: '04-25 14:00', title: '学生申请',         desc: '张一凡 提交过夜申请 + SOP + 应急预案', done: true },
        { time: '04-25 16:30', title: '导师审核',         desc: '赵振华 已签字 · 双人值班已落实', done: true },
        { time: '04-26 10:00', title: '实验中心复核',     desc: '王玉鸿 现场核对消防器材 + 通风', done: true },
        { time: '—',           title: '学院安全副院长终审', desc: '李雪茹 待审 · 高风险过夜须院级签字', current: true },
        { time: '—',           title: '准予立项 · 自动同步门禁', desc: '门牌切「高风险作业」状态' },
      ],
    },
    {
      id: 'ne-2026-02', title: '周六生物样品 18 小时连续培养',
      applicant: '张一凡', advisor: '赵振华', lab: 'B105',
      dateRange: '2026-05-02 (周六) 09:00 → 05-03 03:00', timeRange: '跨夜 18 小时',
      mode: 'weekend',
      scope: '细胞培养连续观察 · 周末节假日 3 级审批',
      sop: '与 BSL-1 操作规程相符 · 每 4h 现场记录 1 次',
      accompanies: ['赵雪（同组研三）'],
      emergency: 'CO₂ 培养箱报警 → 联系周明（135-xxxx-7702）+ 王玉鸿',
      status: 'advisor-review', currentStep: 1,
      timeline: [
        { time: '04-27 11:00', title: '学生申请',     desc: '张一凡 提交周末过夜 + SOP', done: true },
        { time: '—',           title: '导师审核',     desc: '赵振华 待签字（剩 36h）', current: true },
        { time: '—',           title: '实验中心复核', desc: '周末节假日仅 3 级 · 中风险通常自动通过' },
        { time: '—',           title: '准予立项',     desc: '通过后自动同步门禁' },
      ],
    },
  ],

  // 学生「我的项目」（与 admin MOCK.projects 同 schema · timeline 字段对齐）
  projects: [
    {
      id: 'proj-2026-01', title: '钠离子电池正极材料 · 高温烧结合成',
      lab: '302', applicant: '张一凡', advisor: '赵振华',
      riskLevel: 'high', status: 'active', currentStep: 4,
      hazardSourcesEmbed: [
        { name: '浓硫酸 1 L', kind: 'chemical', severity: 'critical' },
        { name: '锂金属箔 50 g', kind: 'chemical', severity: 'critical' },
        { name: '管式炉 GSL-1700X', kind: 'physical', severity: 'critical' },
      ],
      sop: '高温炉 800°C 烧结 6h · 真空环境 · 单批次 ≤ 5 g · 必须双人在场',
      estimatedEnd: '2026-04-28 16:30',
      timeline: [
        { time: '03-15 09:00', title: '学生申请',     desc: '已提交项目申请书 + SOP v3.2', done: true },
        { time: '03-16 11:20', title: '导师审核',     desc: '赵振华 已签字 · 危险源核实通过', done: true },
        { time: '03-18 14:30', title: '实验中心审核', desc: '王玉鸿 现场核对危化品库存与 PPE', done: true },
        { time: '03-20 10:00', title: '学院终审',     desc: '安全副院长签字 · 准予立项', done: true },
        { time: '04-21 14:00', title: '项目进行中',   desc: '当前在 302 · 实验阶段 4/6', current: true },
        { time: '—',           title: '项目结束 · 归档', desc: '关闭门禁高风险标识 · 三废清单交接' },
      ],
    },
    {
      id: 'proj-2026-04', title: '聚合物固态电解质制备',
      lab: '312', applicant: '张一凡', advisor: '赵振华',
      riskLevel: 'medium', status: 'rejected', currentStep: 1,
      hazardSourcesEmbed: [
        { name: '锂金属（手套箱内）', kind: 'chemical', severity: 'critical' },
      ],
      sop: '手套箱内合成 · 单次 < 30 g · 含氟添加剂 ≤ 5%',
      estimatedEnd: '2026-06-15',
      rejectReason: 'SOP 中未说明氟系添加剂应急处置流程，请补充后重新提交。',
      timeline: [
        { time: '04-10 14:30', title: '学生申请',     desc: '提交申请书 v0.9', done: true },
        { time: '04-11 09:00', title: '导师审核 · 驳回', desc: '赵振华 · SOP 缺少氟系应急处置', done: true },
        { time: '—',           title: '修订重提',     desc: '请补充 SOP 后重新发起', current: true },
      ],
    },
  ],
};

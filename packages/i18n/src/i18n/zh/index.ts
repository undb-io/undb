import type { BaseTranslation } from "../i18n-types.js"

const ops = {
  eq: "等于",
  neq: "不等于",
  contains: "包含",
  does_not_contain: "不包含",
  starts_with: "开头是",
  ends_with: "结尾是",
  is_empty: "为空",
  is_not_empty: "不为空",
  min: "最小值",
  max: "最大值",
  gt: "大于",
  gte: "大于等于",
  lt: "小于",
  lte: "小于等于",
  in: "在列表中",
  nin: "不在列表中",
  any_of: "任意一个",
  not_any_of: "都不是",
  is_same_day: "同一天",
  is_not_same_day: "不是同一天",
  is_tody: "是今天",
  is_not_today: "不是今天",
  is_after_today: "在今天之后",
  is_before_today: "在今天之前",
  is_tomorrow: "是明天",
  is_not_tomorrow: "不是明天",
  is_after_tomorrow: "在明天之后",
  is_before_tommorow: "在明天之前",
  is_yesterday: "是昨天",
  is_not_yesterday: "不是昨天",
  is_after_yesterday: "在昨天之后",
  is_before_yesterday: "在昨天之前",
  is_before: "在之前",
  is_not_before: "不在之前",
  is_after: "在之后",
  is_not_after: "不在之后",
  is_true: "为真",
  is_false: "为假"
}

const fieldTypes = {
  string: "文本",
  longText: "长文本",
  number: "数字",
  date: "日期",
  dateRange: "日期范围",
  id: "ID",
  createdAt: "创建时间",
  autoIncrement: "自增",
  updatedAt: "更新时间",
  createdBy: "创建人",
  updatedBy: "更新人",
  reference: "引用",
  rollup: "汇总",
  select: "选择",
  rating: "评分",
  email: "邮箱",
  url: "网址",
  attachment: "附件",
  json: "JSON",
  checkbox: "复选框",
  user: "用户",
  currency: "货币",
  duration: "时长",
  button: "按钮",
  percentage: "百分比",
  formula: "公式"
}

const rollupFns = {
  min: "最小值",
  max: "最大值",
  sum: "求和",
  average: "平均值",
  count: "计数",
  lookup: "查找"
}

const aggregateFns = {
  min: "最小值",
  max: "最大值",
  sum: "求和",
  count: "计数",
  count_empty: "空值数",
  count_uniq: "唯一值数",
  count_not_empty: "非空值数",
  percent_empty: "空值百分比",
  percent_not_empty: "非空值百分比",
  percent_uniq: "唯一值百分比",
  avg: "平均值",
  count_true: "真值数",
  count_false: "假值数",
  percent_true: "真值百分比",
  percent_false: "假值百分比",
  start_max: "开始日期最大值",
  end_max: "结束日期最大值",
  start_min: "开始日期最小值",
  end_min: "结束日期最小值"
}


const macros = {
  "@me": "当前用户",
  "@now": "现在",
  "@today": "今天",
  "@yesterday": "昨天",
  "@tomorrow": "明天"
}

const viewTypes = {
  grid: "表格",
  kanban: "看板",
  gallery: "画廊",
  list: "列表",
  calendar: "日历",
  pivot: "数据透视"
}

const widgetTypes = {
  aggregate: "汇总",
  chart: "图表",
  table: "表格"
}

const timeScales = {
  month: "月",
  week: "周",
  day: "日"
}

const record = {
  label: '记录',
  labels: '记录',
	search: '搜索记录...',
  openMenu: '打开菜单',
  create: '创建记录',
  update: '更新记录',
  delete: '删除记录',
  bulkDuplicated: '记录已复制！',
  viewRecordDetail: '查看记录详情',
  copyRecordId: '复制记录ID',
  createByForm: '通过表单创建',
  duplicateRecord: '复制记录',
  includeData: "包含数据",
  detail: '记录详情',
  duplicate: '复制 {n|number} 条记录',
  updateRecords: '更新 {n|number} 条记录',
  bulkUpdateRecords: '批量更新 {n|number} 条记录',
  deleteRecords: '删除 {n|number} 条记录',
  confirmDeleteRecord: '确定要删除记录吗？',
  confirmDeleteRecordDescription: '此操作无法撤消。这将永久删除记录，并从我们的服务器中删除您的数据。',
  confirmDeleteRecords: '确定要删除 {n|number} 条记录吗？',
  confirmDeleteRecordsDescription: '此操作无法撤消。这将永久删除记录，并从我们的服务器中删除您的数据。',
  confirmDuplicateRecords: '复制 {n|number} 条记录？',
  confirmDuplicateRecordsDescription: '此操作将复制 {n|number} 条记录，并从我们的服务器中复制您的数据。',
  confirmDuplicateRecord: '复制记录？',
  confirmDuplicateRecordDescription: '将创建一个具有新ID的记录。',
  failedToDuplicateRecord: '复制记录失败',
  failedToDeleteRecord: '删除记录失败',
  copiedRecordId: '已复制记录ID到剪贴板',
  createdRecord: '记录已创建！',
  bulkUpdate: {
    title: '更新记录？',
    description: '所有选中的字段将被更新',
    updateWithCondition: '使用以下条件更新记录',
    addField: '添加更新字段',
    selectColumns: '选择要编辑的列',
    updated: '已更新',
    selectAll: '全选',
    removeAll: '取消全选',
    continue: '继续',
    noRecordsUpdated: '没有记录更新',
    recordsUpdated: '{count} 条记录更新成功',
    button: '批量更新',
    noFilterAlert: '没有筛选条件, 将会更新所有记录，请谨慎操作！'
  },
  reference: {
    link: '关联记录',
    linked: '{n|number} 条关联记录'
  },
  button: {
    confirmToUpdate: '确定更新',
    confirmToUpdateDescription: '以下字段将在您点击按钮时更新',
  },
  noRecord: '没有记录',
  showHiddenFields: '显示 {n|number} 个隐藏字段',
  hideHiddenFields: '隐藏 {n|number} 个隐藏字段',
}

const form = {
  label: '表单',
  create: '创建表单',
  noForms: '{tableName} 没有表单',
  noFormsDescription: '你可以在表单中收集数据。',
  addDescription: '添加描述',
  condition: '条件',
  invalidCondition: '无效的条件',
  setDefaultValue: '为 {field} 设置默认值',
  formField: '表单字段',
  fieldsSelected: '{n} 个字段被选中',
  searchFormField: '搜索表单字段...',
  selectAllFields: '全选字段',
  hideFields: '隐藏字段',
  showFields: '显示字段',
  noFieldsFound: '没有找到标题为 `{q}` 的字段',
  formSetting: '表单设置',
  duplicateForm: '复制表单',
  deleteForm: '删除表单',
  duplicateSuccess: '复制表单成功',
  backgroundColor: '背景颜色',
  autoAddNewField: '创建字段时自动添加到表单',
  autoAddNewFieldDescription: '当创建字段时，它将自动设置为显示。',
  deleteFormConfirm: '删除表单: {name}?',
  deleteFormDescription: '表单将被永久删除。',
  duplicateFormDialog: '复制表单: {name}?',
  duplicateFormDialogDescription: '表单将被复制。',
  setName: '设置表单名称',
  enableCondition: '启用条件'
}

const common = {
  tables: '表',
  table: '表',
  filters: '筛选',
  color: '颜色',
  select: '选择一个表...',
  search: '搜索表...',
  noTablesFound: '没有表',
  sorts: {
    sort: '排序',
    add: '添加排序',
    empty: '没有排序',
    direction: {
      asc: '升序',
      desc: '降序'
    }
  },
  fields: '字段',
  filter: {
    empty: '没有筛选条件'
	},
  condition: {
    add: '添加条件',
    addGroup: '添加条件组'
  },
  submit: '提交',
  where: '当',
  searchOp: '搜索操作...',
  colorEmpty: '没有颜色',
  updateName: '更新表名称',
  duplicateTable: '复制表',
  deleteTable: '删除表',
  create: '创建表',
  import: '导入表'
}

  const field = {
    typeChanged: '您已更改字段类型，数据将转换为新类型，但可能会被清除',
    field: '字段',
    fields: '字段列表',
    create: '创建字段',
		created: '字段已创建！',
    update: '更新字段',
    updated: '字段已更新！',
    delete: '删除字段',
    deleted: '字段已删除！',
    deleteFailed: '删除字段失败',
    deleteConfirm: '确定要删除字段吗？',
    duplicate: '复制字段',
    duplicateDescription: '确定要复制以下字段吗？',
    hidden: '{n|number} 个字段隐藏',
    searchTableFields: '搜索 {table} 字段...',
    selectField: '选择字段...',
		empty: '没有字段',
		min: '最小值',
		max: '最大值',
		searchType: '搜索字段类型...',
		defaultValue: {
			label: '默认值',
			placeholder: '默认值...',
			invalid: '无效的默认值',
			invalidDescription: '您的默认值无效。默认值将不会被保存。',
			markAsRequired: '标记为必填字段。'
		},
		display: {
			label: '显示字段',
			markAsDisplay: '标记为显示字段。'
		},
		id: {
			placeholder: '留空自动生成...'
		},
		string: {
			min: '最小长度',
			max: '最大长度'
		},
		longText: {
			allowRichText: '允许富文本。'
		},
    duration: {
      min: "最小值",
      max: "最大值",
      minPlaceholder: "最小值...",
      maxPlaceholder: "最大值..."
    },
		number: {
			min: '最小值',
			max: '最大值',
			minPlaceholder: '最小值...',
			maxPlaceholder: '最大值...'
		},
		currency: {
			symbol: '符号',
			min: '最小值',
			max: '最大值',
			minPlaceholder: '最小值...',
			maxPlaceholder: '最大值...'
		},
    percentage: {
      min: '最小值',
      max: '最大值',
      minPlaceholder: '最小值...',
      maxPlaceholder: '最大值...'
    },
    date: {
      format: '日期格式',
      includeTime: '包含时间',
      timeFormat: '时间格式',
			selectMacro: '选择宏...'
    },
    dateRange: {
      format: '日期格式',
      includeTime: '包含时间',
      timeFormat: '时间格式'
    },
    formula: {
      label: '公式',
      placeholder: '公式...',
      syntax: '语法',
      examples: '示例'
    },
    select: {
      option: {
        label: '选项',
        add: '添加选项',
        selectDefault: '选择默认选项...',
        search: '搜索选项...',
        noOptionFound: '没有选项',
        update: '更新选项',
        delete: '删除选项',
        createRecord: '在该选项下创建记录',
				create: '创建选项'
      },
      allowAddMultiple: '允许添加多个选项',
      changeFromMultipleToSingle: '从多个选项更改为单个选项！',
      changeFromMultipleToSingleDescription: '只有第一个选项将被保留。',
      min: '最小项数',
      max: '最大项数',
      minPlaceholder: '最小项数...',
      maxPlaceholder: '最大项数...'
    },
    attachment: {
      min: '最小项数',
      max: '最大项数',
      minPlaceholder: '最小项数...',
      maxPlaceholder: '最大项数...'
    },
    user: {
      allowAddMultiple: '允许添加多个用户',
      changeFromMultipleToSingle: '从多个选项更改为单个选项！',
      changeFromMultipleToSingleDescription: '只有第一个选项将被保留。',
      min: '最小项数',
      max: '最大项数',
      minPlaceholder: '最小项数...',
      maxPlaceholder: '最大项数...'
    },
    reference: {
      foreignTable: '外部表',
      createSymmetricField: '创建对称字段',
      limitRecordSelectionToCondition: '限制记录选择到条件。',
      min: '最小项数',
      max: '最大项数',
      minPlaceholder: '最小项数...',
      maxPlaceholder: '最大项数...'
    },
    rollup: {
      referenceField: '引用字段',
      selectReferenceField: '选择引用字段...',
      foreignRollupField: '外部汇总字段',
      aggregateFunction: '汇总函数'
    },
    button: {
      label: '标签',
      disabledWhen: '当...时禁用按钮',
      updateValueWhenClickButton: '点击按钮时更新值',
      confirmBeforeUpdate: '更新前确认',
      addAnotherFieldToUpdate: '添加另一个更新字段',
      valueToUpdate: '更新值...'
    }
  }

const view = {
  field: {
    showAllFields: '显示所有字段',
    hideAllFields: '隐藏所有字段',
    showSystemFields: '显示系统字段',
    hideSystemFields: '隐藏系统字段'
  },
	widget: {
		title: '视图部件',
		empty: '没有部件',
		add: '添加部件'
	},
  kanban: {
    kanban: '看板',
    update: '更新看板视图',
    view: '看板视图',
    field: '看板字段',
    groupBy: '通过选择类型字段分组',
    noSelectField: '没有选择类型字段',
    noOption: '没有选项',
    collapseLane: '折叠'
  },
  gallery: {
    gallery: '画廊',
    update: '更新画廊视图',
    view: '画廊视图',
    field: '画廊字段',
    groupBy: '通过附件类型字段分组',
    noAttachmentField: '没有附件类型字段'
  },
  calendar: {
    calendar: '日历',
    update: '更新日历视图',
    view: '日历视图',
    field: '日历字段',
    groupBy: '通过日期字段分组',
    select: '选择一个选择类型字段来分组日历',
    selectField: '选择日历字段',
    noDateField: '没有日期字段',
    scope: {
      selectedDate: '在选定日期',
      withoutDate: '没有日期',
      thisMonth: '在这个月',
      allRecords: '所有记录',
      thisWeek: '在这个周',
    }
  },
  pivot: {
    pivot: '数据透视',
    update: '更新数据透视视图',
    view: '数据透视视图',
    columnLabel: '列标签',
    rowLabel: '行标签',
    swap: '与列标签交换',
    aggregate: '汇总',
    aggregateFn: {
      sum: '求和',
      count: '计数',
      average: '平均值',
      max: '最大值',
      min: '最小值'
    },
    value: '值',
    selectField: '选择一个字段进行数据透视...'
  },
  type: '视图类型',
  create: '创建视图',
  created: '视图已创建',
  updateName: '更新视图名称',
  updated: '视图已更新',
  duplicateView: '复制视图',
  deleteView: '删除视图',
  downloadView: '下载视图',
  downloadAsExcel: '下载为 Excel',
  downloadAsCSV: '下载为 CSV',
  downloadAsJSON: '下载为 JSON',
  setAsDefaultView: '设置为默认视图',
}

const aggregate = {
  searchType: '搜索汇总类型...',
  selectField: '选择一个字段进行汇总...'
}

const dashboard = {
  dashboards: '仪表板',
  create: '创建仪表板',
  nameDescription: '仪表板的公共显示名称。',
  updateName: '更新仪表板名称',
  duplicateDashboard: '复制仪表板',
  deleteDashboard: '删除仪表板',
  confirmDeleteDashboard: '确定要删除仪表板吗？',
  confirmDeleteDashboardDescription: '此操作无法撤消。这将永久删除您的仪表板，并从我们的服务器中删除您的数据。',
  duplicateDashboardDescription: '确定要复制仪表板吗？',
  duplicateDashboardConfirm: '复制仪表板',
  updateDashboard: '更新仪表板',
}

const base = {
  name: 'Base 名称',
  noBases: '没有 Base',
  created: 'Base 已创建',
  displayName: 'Base 显示名称',
  importFromTemplate: '从模板导入',
  createBase: '创建 Base',
  baseSettings: 'Base 设置',
  updateBase: '更新 Base',
  deleteBase: '删除 Base',
  updateBaseName: '更新 Base 名称',
  deleteBaseConfirm: '确定要删除 Base 吗？',
  duplicateBase: '复制 Base {name}',
  includeData: '包含数据',
  nameDescription: 'Base 的显示名称。',
  includeDataDescription: '在新的 Base 中包含数据。',
  duplicateBaseDescription: '创建一个包含 Base 中所有表的新 Base。',
  systemFieldsUpdated: '系统字段将更新为当前用户和时间戳。'
}

const space = {
  space: '空间',
  spaces: '空间',
  name: '空间名称',
  setDisplayName: '设置显示名称',
  searchMembers: '搜索成员...',
  cannotInviteMemberToPersonalSpace: '你不能邀请成员到个人空间。',
  createSpace: '创建空间',
  createSpaceDescription: '创建新空间以组织您的数据并与其他团队成员协作。',
  spaceName: '空间名称',
  spaceNameDescription: '空间显示名称。',
  personalSpace: '你不能删除你的个人空间。',
  deleteSpace: '删除空间',
  deleteSpaceConfirm: '确定要删除空间吗？',
  deleteSpaceDescription: '此操作无法撤消。这将永久删除您的数据库状态，并从我们的服务器中删除您的数据。',
  memberList: '你的工作区成员列表。',
  inviteMember: '邀请成员',
  invitations: '邀请',
  invite: '邀请',
  pendingInvitations: '待处理的邀请列表。',
  invitedAt: '邀请时间',
  deleteInvitation: '删除邀请'
}

const schema = {
  label: '字段结构',
  systemFields: '系统字段',
  required: '必填',
  display: '显示',
  fieldName: '字段名称',
  addField: '添加字段'
}

const account = {
  logout: '登出',
  accountSettings: '账户设置',
  apiToken: 'Api Token',
  undbTemplates: 'Undb 模板',
  undbWebsite: 'Undb 官网'
}

const setting = {
  setting: '设置',
  members: '成员',
  settingAndMembers: '设置和成员',
}

const roles = {
  owner: '所有者',
  admin: '管理员',
  member: '成员',
  viewer: '查看者'
}

const webhook = {
  label: 'Webhook',
  create: '创建 Webhook',
  delete: '删除 Webhook',
  update: '更新 Webhook',
  duplicate: '复制 Webhook',
  noWebhooks: '{table} 没有 Webhook',
  noWebhooksDescription: '点击按钮创建您的第一个 Webhook',
}

const authz = {
  noRecordLevelSecurity: '{table} 没有记录级权限',
  noRecordLevelSecurityDescription: '点击按钮创建您的第一个记录级权限策略',
  create: '创建记录级权限',
  created: '记录级权限已创建',
  failed: '创建记录级权限失败',
  rlsName: '记录级权限名称',
  giveYourRLSName: '给您的记录级权限命名',
  actions: {
    read: '读取',
    create: '创建',
    update: '更新',
    delete: '删除'
  },
  subjectName: '主体',
  subject: {
    any: '任何用户',
    user: '指定用户',
    group: '指定用户组'
  },
  action: '操作',
  allow: '允许',
  deny: '拒绝',
  matchesConditions: '匹配条件...',
  updateCondition: '更新条件',
  notAllow: '不允许',
  updateRLS: '更新记录级权限',
  policy: {
    update: '更新策略',
    delete: '删除策略',

  }
}

const events = {
  record: {
    created: '记录创建',
    updated: '记录更新',
    deleted: '记录删除'
  }
}

const template= {
  template: '模板',
  useThisTemplate: '使用此模板',
  previewTemplate: '预览模板',
  getStarted: '从模板开始',
  whichSpace: '在哪个空间？',
  whichSpaceDescription: "您可以在选定的空间中创建一个新的 Base 或一个新的表。",
  createBase: '从模板创建 Base',
  selectATemplateToCreateABase: '选择一个模板来创建一个 Base',
  includeDataDescription: '将模板的数据包含到新的 Base 或表中。',
  loginToCreateNewBaseOrTable: '登录以创建新的 Base 或表'
}

const auth = {
  login: '登录',
  loginFailed: '登录失败',
  gotoSpace: '前往空间',
  forgotPassword: '忘记密码？',
  emailPlaceholder: '输入您的电子邮件地址...',
  password: '密码',
  register: '注册',
  noAccount: '没有账户？',
  registerDisabled: '注册已禁用',
  loginWithEmailDescription: '输入您的电子邮件地址和密码登录。',
  registerDisabledDescription: '请联系管理员启用注册。',
  loginWith: '使用 {provider} 登录',
  invalidEmailOrPassword: '无效的电子邮件或密码。',
  loginToYourAccountAndAcceptTheInvitation: '登录到您的账户并接受邀请',
  resetPassword: '重置密码',
  enterYourEmailBelowToResetYourPassword: '输入您的电子邮件地址以重置您的密码。',
  emailSent: '电子邮件已发送！',
  youCanCheckYourEmailAddressAndFollowTheStepsToResetYourPassword: '您可以检查您的电子邮件地址并按照步骤重置您的密码。',
  registerFailed: '注册失败',
  passwordDoesNotMatch: '密码不匹配',
  enterYourDisplayUsername: '输入您的显示用户名',
  username: '用户名',
  invited: '已邀请',
  confirmPassword: '确认密码',
  createAnAccount: '创建一个账户',
  alreadyHaveAnAccount: '已经有账户？',
  signIn: '登录',
  createAccountAndAcceptInvitation: '创建账户并接受邀请',
  enterYourInformationToCreateAnAccount: '输入您的信息以创建一个账户。',
  enterYourWorkEmail: '输入您的工作电子邮件...',
  sendOtpCode: '发送验证码',
  verifyOtp: '验证验证码'
}

const playground = {
  playgroundMode: '沙盒模式',
  playgroundModeDescription: '您处于沙盒模式，所有更改将在您关闭或刷新页面后丢失。'
}

const zh = {
  playground,
  auth,
  template,
  roles,
  setting,
  base,
  space,
  account,
  table: {
    ops,
    fieldTypes,
    rollupFns,
    aggregateFns,
    macros,
    viewTypes,
    widgetTypes,
    timeScales,
    record,
    form,
    common,
		field,
		view,
		aggregate,
    schema,
  authz,
  events,
    import: {
      importFile: '导入文件...',
      firstRowAsHeader: '第一行作为标题',
      importData: '导入数据',
      fieldsSelected: '{count} 字段选择',
      configField: '配置字段',
      nextStep: '下一步',
    },
  },
  webhook,
	common: {
    back: '返回',
    error: '错误',
		continue: '继续',
    description: '描述',
		cancel: '取消',
		create: '创建',
    search: '搜索',
		creating: '创建中',
		confirm: '确认',
		update: '更新',
    select: '选择',
    event: '事件',
		submit: '提交',
		duplicate: '复制',
		delete: '删除',
		settings: '设置',
		save: '保存',
		language: '语言',
		data: '数据',
    auth: '权限',
    developer: '开发者',
    name: '名称',
    dangerZone: '危险区域',
    remove: '移除',
    accountAndSpaceSettings: '账户和空间设置',
    email: '邮箱',
    role: '角色',
    action: '操作',
    status: '状态',
    required: '必填',
    enabled: '启用',
    enableCondition: '启用条件',
    type: '类型',
    loadMore: '加载更多',
    today: '今天',
    clear: '清除',
    updated: '已更新',
    now: '现在',
    import: '导入',
	},
 share: {
	title: '分享',
	shareUrl: '分享链接',
	iframeUrl: '嵌入链接',
	shareId: '分享ID',
	enable: '启用分享',
	copied: '已复制到剪贴板',
	button: '分享'
},
widget: {
  title: '部件',
  button: "部件",
	name: '名称',
	add: '添加部件',
	editName: '编辑名称',
	duplicate: '复制部件 {name}',
	delete: '删除部件 {name}',
	deleteConfirm: {
		title: '删除部件 {name}？',
		description: '此操作无法撤消。这将永久删除此部件，并从我们的服务器中删除您的数据。'
	},
	count: '计数',
	aggregate: '汇总',
	filters: '筛选',
},
dashboard

} satisfies BaseTranslation

export default zh
import type { BaseTranslation } from "../i18n-types.js"

const ops = {
  eq: "等しい",
  neq: "等しくない",
  contains: "含む",
  does_not_contain: "含まない",
  starts_with: "で始まる",
  ends_with: "で終わる",
  is_empty: "空である",
  is_not_empty: "空でない",
  min: "最小値",
  max: "最大値",
  gt: "より大きい",
  gte: "以上",
  lt: "より小さい",
  lte: "以下",
  in: "リスト内",
  nin: "リスト外",
  any_of: "いずれか",
  not_any_of: "いずれでもない",
  is_same_day: "同じ日",
  is_not_same_day: "異なる日",
  is_tody: "今日",
  is_not_today: "今日ではない",
  is_after_today: "今日より後",
  is_before_today: "今日より前",
  is_tomorrow: "明日",
  is_not_tomorrow: "明日ではない",
  is_after_tomorrow: "明日より後",
  is_before_tommorow: "明日より前",
  is_yesterday: "昨日",
  is_not_yesterday: "昨日ではない",
  is_after_yesterday: "昨日より後",
  is_before_yesterday: "昨日より前",
  is_before: "以前",
  is_not_before: "以前ではない",
  is_after: "後",
  is_not_after: "後ではない",
  is_true: "真",
  is_false: "偽"
}

const fieldTypes = {
  string: "テキスト",
  longText: "長文テキスト",
  number: "数値",
  date: "日付",
  dateRange: "日付範囲",
  id: "ID",
  createdAt: "作成日時",
  autoIncrement: "自動採番",
  updatedAt: "更新日時",
  createdBy: "作成者",
  updatedBy: "更新者",
  reference: "参照",
  rollup: "ロールアップ",
  select: "選択",
  rating: "評価",
  email: "メール",
  url: "URL",
  attachment: "添付ファイル",
  json: "JSON",
  checkbox: "チェックボックス",
  user: "ユーザー",
  currency: "通貨",
  duration: "期間",
  button: "ボタン",
  percentage: "パーセント",
  formula: "数式"
}

const rollupFns = {
  min: "最小値",
  max: "最大値",
  sum: "合計",
  average: "平均値",
  count: "カウント",
  lookup: "検索"
}

const aggregateFns = {
  min: "最小値",
  max: "最大値",
  sum: "合計",
  count: "カウント",
  count_empty: "空値数",
  count_uniq: "唯一値数",
  count_not_empty: "非空値数",
  percent_empty: "空値百分比",
  percent_not_empty: "非空値百分比",
  percent_uniq: "唯一値百分比",
  avg: "平均値",
  count_true: "真値数",
  count_false: "偽値数",
  percent_true: "真値百分比",
  percent_false: "偽値百分比",
  start_max: "開始日最大値",
  end_max: "終了日最大値",
  start_min: "開始日最小値",
  end_min: "終了日最小値"
}


const macros = {
  "@me": "現在のユーザー",
  "@now": "今",
  "@today": "今日",
  "@yesterday": "昨日",
  "@tomorrow": "明日"
}

const viewTypes = {
  grid: "グリッド",
  kanban: "カンバン",
  gallery: "ギャラリー",
  list: "リスト",
  calendar: "カレンダー",
  pivot: "ピボット"
}

const widgetTypes = {
  aggregate: "集計",
  chart: "チャート",
  table: "テーブル"
}

const timeScales = {
  month: "月",
  week: "週",
  day: "日"
}

const record = {
  label: 'レコード',
	labels: 'レコード',
	search: 'レコードを検索...',
  openMenu: 'メニューを開く',
  create: 'レコード作成',
  update: 'レコード更新',
  delete: 'レコード削除',
  bulkDuplicated: 'レコードが複製されました！',
  viewRecordDetail: 'レコード詳細を表示',
  copyRecordId: 'レコードIDをコピー',
  createByForm: 'フォームから作成',
  duplicateRecord: 'レコードを複製',
  includeData: "データを含む",
  records: '{n|number} 件のレコード',
  detail: 'レコード詳細',
  duplicate: 'レコードを複製 {n|number} 件',
  updateRecords: 'レコードを更新 {n|number} 件',
  bulkUpdateRecords: 'レコードを一括更新 {n|number} 件',
  deleteRecords: 'レコードを削除 {n|number} 件',
  confirmDeleteRecord: 'レコードを削除してもよろしいですか？',
  confirmDeleteRecordDescription: 'この操作は取り消せません。この操作を行うとレコードが永久に削除され、データがサーバーから削除されます。',
  confirmDeleteRecords: 'レコードを削除してもよろしいですか？',
  confirmDeleteRecordsDescription: 'この操作は取り消せません。この操作を行うとレコードが永久に削除され、データがサーバーから削除されます。',
  confirmDuplicateRecords: 'レコードを複製してもよろしいですか？',
  confirmDuplicateRecordsDescription: 'この操作を行うとレコードが複製され、データがサーバーに複製されます。',
  confirmDuplicateRecord: 'レコードを複製してもよろしいですか？',
  confirmDuplicateRecordDescription: '新しいIDを持つレコードが作成されます。',
  failedToDuplicateRecord: 'レコードの複製に失敗しました',
  failedToDeleteRecord: 'レコードの削除に失敗しました',
  copiedRecordId: 'レコードIDがクリップボードにコピーされました',
  createdRecord: 'レコードが作成されました！',
  bulkUpdate: {
    title: 'レコードを更新してもよろしいですか？',
    description: '選択されたすべてのフィールドが更新されます',
    updateWithCondition: 'レコードを以下の条件で更新',
    addField: '更新フィールドを追加',
    selectColumns: '編集する列を選択',
    updated: '更新済み',
    selectAll: 'すべて選択',
    removeAll: 'すべて選択解除',
    continue: '続行',
    noRecordsUpdated: 'レコードが更新されません',
    recordsUpdated: '{count} 件のレコードが更新に成功しました',
    button: '一括更新',
    noFilterAlert: 'フィルターがないため、すべてのレコードが更新されます。慎重に操作してください！'
  },
  noRecord: 'レコードがありません',
  reference: {
    link: '関連レコード',
    linked: '{n|number} 件の関連レコード'
  },
  button: {
    confirmToUpdate: '更新を確認',
    confirmToUpdateDescription: '以下のフィールドがボタンをクリックしたときに更新されます',
  },
  showHiddenFields: '表示 {n|number} 個の非表示フィールド',
  hideHiddenFields: '非表示 {n|number} 個の非表示フィールド',
}

const form = {
  label: 'フォーム',
  create: 'フォーム作成',
  noForms: '{tableName} にフォームがありません',
  noFormsDescription: 'フォームでデータを収集できます。',
  addDescription: '説明を追加',
  condition: '条件',
  invalidCondition: '無効な条件',
  setDefaultValue: '{field} のデフォルト値を設定',
  formField: 'フォームフィールド',
  fieldsSelected: '{n} 個のフィールドが選択されました',
  searchFormField: 'フォームフィールドを検索...',
  selectAllFields: 'すべてのフィールドを選択',
  hideFields: 'フィールドを隠す',
  showFields: 'フィールドを表示',
  noFieldsFound: '「{q}」というタイトルのフィールドが見つかりません',
  formSetting: 'フォーム設定',
  duplicateForm: 'フォームを複製',
  deleteForm: 'フォームを削除',
  duplicateSuccess: 'フォームが複製されました',
  backgroundColor: '背景色',
  autoAddNewField: 'フィールドを作成すると自動的にフォームに追加',
  autoAddNewFieldDescription: 'フィールドを作成すると、表示されます。',
  deleteFormConfirm: 'フォームを削除: {name}?',
  deleteFormDescription: 'フォームが永久に削除されます。',
  duplicateFormDialog: 'フォームを複製: {name}?',
  duplicateFormDialogDescription: 'フォームが複製されます。',
  setName: 'フォーム名を設定',
  enableCondition: '条件を有効にする'
}

const common = {
  tables: 'テーブル',
  table: 'テーブル',
  filters: 'フィルター',
  color: '色',
  select: 'テーブルを選択...',
  search: 'テーブルを検索...',
  noTablesFound: 'テーブルが見つかりません',
  sorts: {
    sort: 'ソート',
    add: 'ソートを追加',
    empty: 'ソートがありません',
    direction: {
      asc: '昇順',
      desc: '降順'
    }
  },
  fields: 'フィールド',
  filter: {
    empty: 'フィルター条件がありません'
	},
  condition: {
    add: '条件を追加',
    addGroup: '条件グループを追加'
  },
  submit: '送信',
  where: '当',
  searchOp: '検索操作...',
  colorEmpty: '色がありません',
  updateName: 'テーブル名を更新',
  duplicateTable: 'テーブルを複製',
  deleteTable: 'テーブルを削除',
  create: 'テーブルを作成',
  import: 'テーブルをインポート'
}

  const field = {
    typeChanged: 'フィールドタイプを変更しました。データは新しいタイプに変換される場合がありますが、クリアされる可能性があります。',
    field: 'フィールド',
    fields: 'フィールドリスト',
    create: 'フィールドを作成',
		created: 'フィールドが作成されました！',
    update: 'フィールドを更新',
    updated: 'フィールドが更新されました！',
    delete: 'フィールドを削除',
    deleted: 'フィールドが削除されました！',
    deleteFailed: 'フィールドの削除に失敗しました',
    deleteConfirm: 'フィールドを削除してもよろしいですか？',
    duplicate: 'フィールドを複製',
    duplicateDescription: '以下のフィールドを複製してもよろしいですか？',
    hidden: '{n|number} 個のフィールドが隠されました',
    searchTableFields: 'テーブル {table} のフィールドを検索...',
    selectField: 'フィールドを選択...',
		empty: 'フィールドがありません',
		min: '最小値',
		max: '最大値',
		searchType: 'フィールドタイプを検索...',
		defaultValue: {
			label: 'デフォルト値',
			placeholder: 'デフォルト値...',
			invalid: '無効なデフォルト値',
			invalidDescription: 'デフォルト値は保存されません。',
			markAsRequired: 'このフィールドを必須としてマークします。'
		},
		display: {
			label: 'フィールドを表示',
			markAsDisplay: 'このフィールドを表示としてマークします。'
		},
		id: {
			placeholder: '空のまま自動生成...'
		},
		string: {
			min: '最小長',
			max: '最大長'
		},
		longText: {
			allowRichText: 'リッチテキストを許可します。'
		},
    duration: {
      min: "最小値",
      max: "最大値",
      minPlaceholder: "最小値...",
      maxPlaceholder: "最大値..."
    },
		number: {
			min: '最小値',
			max: '最大値',
			minPlaceholder: '最小値...',
			maxPlaceholder: '最大値...'
		},
		currency: {
			symbol: '記号',
			min: '最小値',
			max: '最大値',
			minPlaceholder: '最小値...',
			maxPlaceholder: '最大値...'
		},
    percentage: {
      min: '最小値',
      max: '最大値',
      minPlaceholder: '最小値...',
      maxPlaceholder: '最大値...'
    },
    date: {
      format: '日付形式',
      includeTime: '時間を含む',
      timeFormat: '時間形式',
			selectMacro: 'マクロを選択...'
    },
    dateRange: {
      format: '日付形式',
      includeTime: '時間を含む',
      timeFormat: '時間形式'
    },
    formula: {
      label: '数式',
      placeholder: '数式...',
      syntax: '構文',
      examples: '例'
    },
    select: {
      option: {
        label: 'オプション',
        add: 'オプションを追加',
        selectDefault: 'デフォルトオプションを選択...',
        search: 'オプションを検索...',
        noOptionFound: 'オプションが見つかりません',
        update: 'オプションを更新',
        delete: 'オプションを削除',
        createRecord: 'このオプションの下にレコードを作成',
				create: 'オプションを作成'
      },
      allowAddMultiple: '複数のオプションを追加できます',
      changeFromMultipleToSingle: '複数のオプションを単一のオプションに変更！',
      changeFromMultipleToSingleDescription: '最初のオプションのみが保持されます。',
      min: '最小項数',
      max: '最大項数',
      minPlaceholder: '最小項数...',
      maxPlaceholder: '最大項数...'
    },
    attachment: {
      min: '最小項数',
      max: '最大項数',
      minPlaceholder: '最小項数...',
      maxPlaceholder: '最大項数...'
    },
    user: {
      allowAddMultiple: '複数のユーザーを追加できます',
      changeFromMultipleToSingle: '複数のオプションを単一のオプションに変更！',
      changeFromMultipleToSingleDescription: '最初のオプションのみが保持されます。',
      min: '最小項数',
      max: '最大項数',
      minPlaceholder: '最小項数...',
      maxPlaceholder: '最大項数...'
    },
    reference: {
      foreignTable: '外部テーブル',
      createSymmetricField: '対称フィールドを作成',
      limitRecordSelectionToCondition: 'レコード選択を条件に制限します。',
      min: '最小項数',
      max: '最大項数',
      minPlaceholder: '最小項数...',
      maxPlaceholder: '最大項数...'
    },
    rollup: {
      referenceField: '参照フィールド',
      selectReferenceField: '参照フィールドを選択...',
      foreignRollupField: '外部集計フィールド',
      aggregateFunction: '集計関数'
    },
    button: {
      label: 'ラベル',
      disabledWhen: 'ボタンを無効にする条件',
      updateValueWhenClickButton: 'ボタンをクリックしたときに値を更新',
      confirmBeforeUpdate: '更新前に確認',
      addAnotherFieldToUpdate: '別の更新フィールドを追加',
      valueToUpdate: '更新値...'
    }
  }

const view = {
  field: {
    showAllFields: 'すべてのフィールドを表示',
    hideAllFields: 'すべてのフィールドを隠す',
    showSystemFields: 'システムフィールドを表示',
    hideSystemFields: 'システムフィールドを隠す'
  },
	widget: {
		title: 'ビジュアルウィジェット',
		empty: 'ウィジェットがありません',
		add: 'ウィジェットを追加'
	},
  kanban: {
    kanban: 'カンバン',
    update: 'カンバンビジュアルを更新',
    view: 'カンバンビジュアル',
    field: 'カンバンフィールド',
    groupBy: 'タイプフィールドに基づいてグループ化',
    noSelectField: 'タイプフィールドが選択されていません',
    noOption: 'オプションがありません',
		collapseLane: '折りたたみ'
  },
  gallery: {
    gallery: 'ギャラリー',
    update: 'ギャラリービジュアルを更新',
    view: 'ギャラリービジュアル',
    field: 'ギャラリーフィールド',
    groupBy: '添付ファイルタイプフィールドに基づいてグループ化',
    noAttachmentField: '添付ファイルタイプフィールドがありません'
  },
  calendar: {
    calendar: 'カレンダー',
    update: 'カレンダービジュアルを更新',
    view: 'カレンダービジュアル',
    field: 'カレンダーフィールド',
    groupBy: '日付フィールドに基づいてグループ化',
    select: 'カレンダービジュアルを作成するための選択タイプフィールドを選択',
    selectField: 'カレンダーフィールドを選択',
    noDateField: '日付フィールドがありません',
    scope: {
      selectedDate: '選択した日付',
      withoutDate: '日付なし',
      thisMonth: 'この月',
      allRecords: 'すべてのレコード',
      thisWeek: 'この週',
    }
  },
  pivot: {
    pivot: 'ピボット',
    update: 'ピボットビジュアルを更新',
    view: 'ピボットビジュアル',
    columnLabel: '列ラベル',
    rowLabel: '行ラベル',
    swap: '列ラベルと交換',
    aggregate: '集計',
    aggregateFn: {
      sum: '合計',
      count: 'カウント',
      average: '平均値',
      max: '最大値',
      min: '最小値'
    },
    value: '値',
    selectField: 'フィールドを選択してピボットビジュアルを作成...'
  },
  type: 'ビジュアルタイプ',
  create: 'ビジュアルを作成',
  created: 'ビジュアルが作成されました',
  updateName: 'ビジュアル名を更新',
  updated: 'ビジュアルが更新されました',
  duplicateView: 'ビジュアルを複製',
  deleteView: 'ビジュアルを削除',
  downloadView: 'ビジュアルをダウンロード',
  downloadAsExcel: 'Excelとしてダウンロード',
  downloadAsCSV: 'CSVとしてダウンロード',
  downloadAsJSON: 'JSONとしてダウンロード',
  setAsDefaultView: 'デフォルトビジュアルに設定'
}

const aggregate = {
  searchType: '集計タイプを検索...',
  selectField: '集計するフィールドを選択...'
}

const dashboard = {
  dashboards: 'ダッシュボード',
  create: 'ダッシュボードを作成',
  nameDescription: 'ダッシュボードの公開表示名。',
  updateName: 'ダッシュボード名を更新',
  duplicateDashboard: 'ダッシュボードを複製',
  deleteDashboard: 'ダッシュボードを削除',
  confirmDeleteDashboard: 'ダッシュボードを削除してもよろしいですか？',
  confirmDeleteDashboardDescription: 'この操作は取り消せません。この操作を行うとダッシュボードが永久に削除され、データがサーバーから削除されます。',
  duplicateDashboardDescription: 'ダッシュボードを複製してもよろしいですか？',
  duplicateDashboardConfirm: 'ダッシュボードを複製',
  updateDashboard: 'ダッシュボードを更新'
}

const base = {
  name: 'Base 名',
  noBases: 'Base がありません',
  created: 'Base が作成されました',
  displayName: 'Base 表示名',
  importFromTemplate: 'テンプレートからインポート',
  createBase: 'Base を作成',
  baseSettings: 'Base 設定',
  updateBase: 'Base を更新',
  deleteBase: 'Base を削除',
  updateBaseName: 'Base 名を更新',
  deleteBaseConfirm: 'Base を削除してもよろしいですか？',
  duplicateBase: 'Base を複製 {name}',
  includeData: 'データを含む',
  nameDescription: 'Base の表示名。',
  includeDataDescription: '新しい Base にデータを含めます。',
  duplicateBaseDescription: '新しい Base を作成し、Base 内のすべてのテーブルを含む新しい Base を作成します。',
  systemFieldsUpdated: 'システムフィールドが現在のユーザーとタイムスタンプに更新されます。'
}

const space = {
  space: 'スペース',
  spaces: 'スペース',
  name: 'スペース名',
  setDisplayName: '表示名を設定',
  searchMembers: 'メンバーを検索...',
  cannotInviteMemberToPersonalSpace: 'メンバーを個人スペースに招待することはできません。',
  createSpace: 'スペースを作成',
  createSpaceDescription: '新しいスペースを作成してデータを整理し、他のチームメンバーとのコラボレーションを可能にします。',
  spaceName: 'スペース名',
  spaceNameDescription: 'スペースの表示名。',
  personalSpace: '個人スペースを削除することはできません。',
  deleteSpace: 'スペースを削除',
  deleteSpaceConfirm: 'スペースを削除してもよろしいですか？',
  deleteSpaceDescription: 'この操作は取り消せません。この操作を行うとデータベースの状態が永久に削除され、データがサーバーから削除されます。',
  memberList: 'ワークスペースのメンバーリスト。',
  inviteMember: 'メンバーを招待',
  invitations: '招待',
  invite: '招待',
  pendingInvitations: '処理中の招待リスト。',
  invitedAt: '招待時間',
  deleteInvitation: '招待を削除'
}

const schema = {
  label: 'フィールド構造',
  systemFields: 'システムフィールド',
  required: '必須',
  display: '表示',
  fieldName: 'フィールド名',
  addField: 'フィールドを追加'
}

const account = {
  logout: 'ログアウト',
  accountSettings: 'アカウント設定',
  apiToken: 'API トークン',
  undbTemplates: 'Undb テンプレート',
  undbWebsite: 'Undb 公式サイト'
}

const setting = {
  setting: '設定',
  members: 'メンバー',
  settingAndMembers: '設定とメンバー'
}

const roles = {
  owner: '所有者',
  admin: '管理者',
  member: 'メンバー',
  viewer: '閲覧者'
}

const webhook = {
  label: 'Webhook',
  create: 'Webhook を作成',
  delete: 'Webhook を削除',
  update: 'Webhook を更新',
	duplicate: 'Webhook を複製',
  noWebhooks: '{table} に Webhook がありません',
  noWebhooksDescription: 'ボタンをクリックして最初の Webhook を作成します'
}

const authz = {
  noRecordLevelSecurity: '{table} にレコードレベルの権限がありません',
  noRecordLevelSecurityDescription: 'ボタンをクリックして最初のレコードレベルの権限ポリシーを作成します',
  create: 'レコードレベルの権限を作成',
  created: 'レコードレベルの権限が作成されました',
  failed: 'レコードレベルの権限の作成に失敗しました',
  rlsName: 'レコードレベルの権限名',
  giveYourRLSName: 'レコードレベルの権限に名前を付けます',
  actions: {
    read: '読み取り',
    create: '作成',
    update: '更新',
    delete: '削除'
  },
  subjectName: '主体',
  subject: {
    any: '任意のユーザー',
    user: '指定ユーザー',
    group: '指定グループ'
  },
  action: 'アクション',
  allow: '許可',
  deny: '拒否',
  matchesConditions: '条件に一致...',
  updateCondition: '条件を更新',
  notAllow: '許可しない',
  updateRLS: 'レコードレベルの権限を更新',
  policy: {
    update: '更新ポリシー',
    delete: '削除ポリシー'
  }
}

const events = {
  record: {
    created: 'レコード作成',
    updated: 'レコード更新',
    deleted: 'レコード削除'
  }
}

const template = {
  template: 'テンプレート',
  useThisTemplate: 'このテンプレートを使用',
  previewTemplate: 'テンプレートのプレビュー',
  getStarted: 'このテンプレートを使用して開始',
  whichSpace: "このテンプレートを作成するスペースはどれですか？",
  whichSpaceDescription: "新しい Base または新しいテーブルを選択したスペースに作成できます。",
  createBase: 'Base を作成',
  selectATemplateToCreateABase: 'テンプレートを選択して Base を作成します',
  includeDataDescription: 'テンプレートのデータを新しい Base またはテーブルに含めます。',
  loginToCreateNewBaseOrTable: 'ログインして新しい Base またはテーブルを作成します'
}

const auth = {
  login: 'ログイン',
  loginFailed: 'ログインに失敗しました',
  gotoSpace: 'スペースに移動',
  forgotPassword: 'パスワードを忘れましたか？',
  emailPlaceholder: 'メールアドレスを入力してください...',
  password: 'パスワード',
  register: '登録',
  noAccount: 'アカウントがありませんか？',
  registerDisabled: '登録が無効になっています。',
  loginWith: 'ログイン {provider}',
  invalidEmailOrPassword: '無効なメールアドレスまたはパスワードです。',
  loginToYourAccountAndAcceptTheInvitation: 'ログインして招待を受け入れます',
  loginWithEmailDescription: 'メールアドレスとパスワードを入力してログインします。',
  resetPassword: 'パスワードをリセット',
  enterYourEmailBelowToResetYourPassword: 'パスワードをリセットするためにメールアドレスを入力してください。',
  emailSent: 'メールが送信されました！',
  youCanCheckYourEmailAddressAndFollowTheStepsToResetYourPassword: 'メールアドレスを確認して、パスワードをリセットする手順を実行してください。',
  registerFailed: '登録に失敗しました',
  passwordDoesNotMatch: 'パスワードが一致しません',
  enterYourDisplayUsername: '表示ユーザー名を入力してください',
  username: 'ユーザー名',
  invited: '招待済み',
  confirmPassword: 'パスワードを確認',
  createAnAccount: 'アカウントを作成',
  alreadyHaveAnAccount: 'アカウントがありますか？',
  signIn: 'ログイン',
  createAccountAndAcceptInvitation: 'アカウントを作成して招待を受け入れる',
  enterYourInformationToCreateAnAccount: 'アカウントを作成するための情報を入力してください。',
  enterYourWorkEmail: '作業用メールアドレスを入力してください...',
  sendOtpCode: 'コードを送信',
  verifyOtp: 'コードを検証'
}

const playground = {
  playgroundMode: 'プレイグラウンドモード',
  playgroundModeDescription: 'プレイグラウンドモードです。ページを閉じるかリフレッシュするとすべての変更が失われます。'
}

const ja = {
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
      importFile: 'インポートファイル...',
      firstRowAsHeader: '最初の行をヘッダーとして',
      importData: 'データをインポート',
      fieldsSelected: '{count} フィールド選択',
      configField: 'フィールドを設定',
      nextStep: '次のステップ',
    },
  },
  webhook,
	common: {
    back: '戻る',
		error: 'エラー',
		continue: '続行',
    description: '説明',
		cancel: 'キャンセル',
		create: '作成',
    search: '検索',
		creating: '作成中',
		confirm: '確認',
		update: '更新',
    select: '選択',
    event: 'イベント',
		submit: '送信',
		duplicate: '複製',
		delete: '削除',
		settings: '設定',
		save: '保存',
		language: '言語',
		data: 'データ',
    auth: '権限',
    developer: '開発者',
    name: '名前',
    dangerZone: '危険区域',
    remove: '削除',
    accountAndSpaceSettings: 'アカウントとスペース設定',
    email: 'メール',
    role: 'ロール',
    action: 'アクション',
    status: 'ステータス',
    required: '必須',
    enabled: '有効',
    enableCondition: '有効条件',
    type: 'タイプ',
		loadMore: 'もっと読み込む',
    today: '今日',
    clear: 'クリア',
    updated: '更新済み',
    now: '現在',
    import: 'インポート'
	},
 share: {
	title: '共有',
	shareUrl: '共有リンク',
	iframeUrl: '埋め込みリンク',
	shareId: '共有ID',
	enable: '共有を有効にする',
	copied: 'クリップボードにコピーされました',
	button: '共有'
},
widget: {
  title: 'ウィジェット',
  button: "ウィジェット",
	name: '名前',
	add: 'ウィジェットを追加',
	editName: '名前を編集',
	duplicate: 'ウィジェットを複製 {name}',
	delete: 'ウィジェットを削除 {name}',
	deleteConfirm: {
		title: 'ウィジェットを削除 {name}?',
		description: 'この操作は取り消せません。この操作を行うとウィジェットが永久に削除され、データがサーバーから削除されます。'
	},
	count: 'カウント',
	aggregate: '集計',
	filters: 'フィルター',
},
dashboard

} satisfies BaseTranslation

export default ja
import type { BaseTranslation } from "../i18n-types.js"

const ops = {
  eq: "같음",
  neq: "같지 않음",
  contains: "포함",
  does_not_contain: "포함하지 않음",
  starts_with: "시작하는",
  ends_with: "끝나는",
  is_empty: "비어 있음",
  is_not_empty: "비어 있지 않음",
  min: "최소값",
  max: "최대값",
  gt: "보다 큼",
  gte: "보다 크거나 같음",
  lt: "보다 작음",
  lte: "보다 작거나 같음",
  in: "목록에 있음",
  nin: "목록에 없음",
  any_of: "다음 중 하나",
  not_any_of: "다음 중 어느 것도 아님",
  is_same_day: "같은 날",
  is_not_same_day: "같은 날이 아님",
  is_tody: "오늘",
  is_not_today: "오늘이 아님",
  is_after_today: "오늘 이후",
  is_before_today: "오늘 이전",
  is_tomorrow: "내일",
  is_not_tomorrow: "내일이 아님",
  is_after_tomorrow: "내일 이후",
  is_before_tommorow: "내일 이전",
  is_yesterday: "어제",
  is_not_yesterday: "어제가 아님",
  is_after_yesterday: "어제 이후",
  is_before_yesterday: "어제 이전",
  is_before: "이전",
  is_not_before: "이전이 아님",
  is_after: "이후",
  is_not_after: "이후가 아님",
  is_true: "참",
  is_false: "거짓"
}

const fieldTypes = {
  string: "텍스트",
  longText: "긴 텍스트",
  number: "숫자",
  date: "날짜",
  dateRange: "날짜 범위",
  id: "ID",
  createdAt: "생성일",
  autoIncrement: "자동 증가",
  updatedAt: "수정일",
  createdBy: "생성자",
  updatedBy: "수정자",
  reference: "참조",
  rollup: "롤업",
  select: "선택",
  rating: "평가",
  email: "이메일",
  url: "URL",
  attachment: "첨부파일",
  json: "JSON",
  checkbox: "체크박스",
  user: "사용자",
  currency: "통화",
  duration: "기간",
  button: "버튼",
  percentage: "백분율",
  formula: "수식"
}

const rollupFns = {
  min: "최소값",
  max: "최대값",
  sum: "합계",
  average: "평균",
  count: "개수",
  lookup: "조회"
}

const aggregateFns = {
  min: "최소값",
  max: "최대값",
  sum: "합계",
  count: "개수",
  count_empty: "빈 값 수",
  count_uniq: "유일 값 수",
  count_not_empty: "비어 있지 않은 값 수",
  percent_empty: "빈 값 비율",
  percent_not_empty: "비어 있지 않은 값 비율",
  percent_uniq: "유일 값 비율",
  avg: "평균",
  count_true: "참 값 수",
  count_false: "거짓 값 수",
  percent_true: "참 값 비율",
  percent_false: "거짓 값 비율",
  start_max: "시작 날짜 최대값",
  end_max: "종료 날짜 최대값",
  start_min: "시작 날짜 최소값",
  end_min: "종료 날짜 최소값"
}


const macros = {
  "@me": "현재 사용자",
  "@now": "지금",
  "@today": "오늘",
  "@yesterday": "어제",
  "@tomorrow": "내일"
}

const viewTypes = {
  grid: "그리드",
  kanban: "칸반",
  gallery: "갤러리",
  list: "리스트",
  calendar: "달력",
  pivot: "피봇"
}

const widgetTypes = {
  aggregate: "집계",
  chart: "차트",
  table: "표"
}

const timeScales = {
  month: "월",
  week: "주",
  day: "일"
}

const record = {
  label: '레코드',
  labels: '레코드',
	search: '레코드 검색...',
  openMenu: '메뉴 열기',
  create: '레코드 생성',
  update: '레코드 수정',
  delete: '레코드 삭제',
  bulkDuplicated: '레코드가 복제되었습니다!',
  viewRecordDetail: '레코드 상세 보기',
  copyRecordId: '레코드 ID 복사',
  createByForm: '양식으로 생성',
  duplicateRecord: '레코드 복제',
  includeData: "데이터 포함",
  detail: '레코드 상세',
  duplicate: '복제 {n|number} 개의 레코드',
  updateRecords: '업데이트 {n|number} 개의 레코드',
  bulkUpdateRecords: '일괄 업데이트 {n|number} 개의 레코드',
  deleteRecords: '삭제 {n|number} 개의 레코드',
  confirmDeleteRecord: '레코드를 삭제하시겠습니까?',
  confirmDeleteRecordDescription: '이 작업은 취소할 수 없습니다. 이 작업은 영구적으로 레코드를 삭제하고 서버에서 데이터를 삭제합니다.',
  confirmDeleteRecords: '삭제 {n|number} 개의 레코드를 삭제하시겠습니까?',
  confirmDeleteRecordsDescription: '이 작업은 취소할 수 없습니다. 이 작업은 영구적으로 레코드를 삭제하고 서버에서 데이터를 삭제합니다.',
  confirmDuplicateRecords: '복제 {n|number} 개의 레코드?',
  confirmDuplicateRecordsDescription: '이 작업은 {n|number} 개의 레코드를 복제하고 서버에서 데이터를 복제합니다.',
  confirmDuplicateRecord: '레코드 복제?',
  confirmDuplicateRecordDescription: '새로운 ID를 가진 레코드를 생성합니다.',
  failedToDuplicateRecord: '레코드 복제 실패',
  failedToDeleteRecord: '레코드 삭제 실패',
  copiedRecordId: '레코드 ID를 클립보드에 복사했습니다',
  createdRecord: '레코드가 생성되었습니다!',
  bulkUpdate: {
    title: '레코드 업데이트?',
    description: '선택한 필드가 모두 업데이트됩니다',
    updateWithCondition: '레코드를 업데이트하는 조건 사용',
    addField: '업데이트 필드 추가',
    selectColumns: '업데이트할 열 선택',
    updated: '업데이트됨',
    selectAll: '모두 선택',
    removeAll: '모두 선택 취소',
    continue: '계속',
    noRecordsUpdated: '업데이트된 레코드가 없습니다',
    recordsUpdated: '{count} 개의 레코드가 성공적으로 업데이트되었습니다',
    button: '일괄 업데이트',
    noFilterAlert: '필터가 없습니다. 모든 레코드가 업데이트됩니다. 주의하세요!'
  },
  reference: {
    link: '연결 레코드',
    linked: '{n|number} 개의 연결 레코드'
  },
  button: {
    confirmToUpdate: '업데이트 확인',
    confirmToUpdateDescription: '버튼을 클릭할 때 업데이트될 필드',
  },
  noRecord: '레코드가 없습니다',
  showHiddenFields: '숨겨진 {n|number} 개의 필드 표시',
  hideHiddenFields: '숨겨진 {n|number} 개의 필드 숨기기',
}

const form = {
  label: '양식',
  create: '양식 생성',
  noForms: '{tableName} 양식이 없습니다',
  noFormsDescription: '양식에서 데이터를 수집할 수 있습니다.',
  addDescription: '설명 추가',
  condition: '조건',
  invalidCondition: '잘못된 조건',
  setDefaultValue: '{field}의 기본값 설정',
  formField: '양식 필드',
  fieldsSelected: '{n} 개의 필드가 선택되었습니다',
  searchFormField: '양식 필드 검색...',
  selectAllFields: '모든 필드 선택',
  hideFields: '필드 숨기기',
  showFields: '필드 표시',
  noFieldsFound: '제목이 `{q}`인 필드를 찾을 수 없습니다',
  formSetting: '양식 설정',
  duplicateForm: '양식 복제',
  deleteForm: '양식 삭제',
  duplicateSuccess: '양식 복제 성공',
  backgroundColor: '배경색',
  autoAddNewField: '양식에 추가할 때 자동으로 추가',
  autoAddNewFieldDescription: '양식을 생성할 때 자동으로 표시됩니다.',
  deleteFormConfirm: '양식 삭제: {name}?',
  deleteFormDescription: '양식이 영구적으로 삭제됩니다.',
  duplicateFormDialog: '양식 복제: {name}?',
  duplicateFormDialogDescription: '양식이 복제됩니다.',
  setName: '양식 이름 설정',
  enableCondition: '조건 활성화'
}

const common = {
  tables: '표',
  table: '표',
  filters: '필터',
  color: '색상',
  select: '표 선택...',
  search: '표 검색...',
  noTablesFound: '표가 없습니다',
  sorts: {
    sort: '정렬',
    add: '정렬 추가',
    empty: '정렬이 없습니다',
    direction: {
      asc: '오름차순',
      desc: '내림차순'
    }
  },
  fields: '필드',
  filter: {
    empty: '필터 조건이 없습니다'
	},
  condition: {
    add: '조건 추가',
    addGroup: '조건 그룹 추가'
  },
  submit: '제출',
  where: '어',
  searchOp: '검색 작업...',
  colorEmpty: '색상이 없습니다',
  updateName: '표 이름 업데이트',
  duplicateTable: '표 복제',
  deleteTable: '표 삭제',
  create: '표 생성',
  import: '표 가져오기'
}

  const field = {
    typeChanged: '필드 유형을 변경했습니다. 데이터는 가능한 경우 새 유형으로 변환될 수 있지만 지울 수 있습니다.',
    field: '필드',
    fields: '필드 목록',
    create: '필드 생성',
		created: '필드가 생성되었습니다!',
    update: '필드 업데이트',
    updated: '필드가 업데이트되었습니다!',
    delete: '필드 삭제',
    deleted: '필드가 삭제되었습니다!',
    deleteFailed: '필드 삭제 실패',
    deleteConfirm: '필드를 삭제하시겠습니까?',
    duplicate: '필드 복제',
    duplicateDescription: '다음 필드를 복제하시겠습니까?',
    hidden: '{n|number} 개의 필드 숨겨짐',
    searchTableFields: '표 {table} 필드 검색...',
    selectField: '필드 선택...',
		empty: '필드가 없습니다',
		min: '최소값',
		max: '최대값',
		searchType: '필드 유형 검색...',
		defaultValue: {
			label: '기본값',
			placeholder: '기본값...',
			invalid: '잘못된 기본값',
			invalidDescription: '기본값이 잘못되었습니다. 기본값이 저장되지 않습니다.',
			markAsRequired: '필수 필드로 표시합니다.'
		},
		display: {
			label: '필드 표시',
			markAsDisplay: '필드를 표시 필드로 표시합니다.'
		},
		id: {
			placeholder: '자동으로 생성...'
		},
		string: {
			min: '최소 길이',
			max: '최대 길이'
		},
		longText: {
			allowRichText: '유효한 리치 텍스트를 허용합니다.'
		},
    duration: {
      min: "최소값",
      max: "최대값",
      minPlaceholder: "최소값...",
      maxPlaceholder: "최대값..."
    },
		number: {
			min: '최소값',
			max: '최대값',
			minPlaceholder: '최소값...',
			maxPlaceholder: '최대값...'
		},
		currency: {
			symbol: '기호',
			min: '최소값',
			max: '최대값',
			minPlaceholder: '최소값...',
			maxPlaceholder: '최대값...'
		},
    percentage: {
      min: '최소값',
      max: '최대값',
      minPlaceholder: '최소값...',
      maxPlaceholder: '최대값...'
    },
    date: {
      format: '날짜 형식',
      includeTime: '시간 포함',
      timeFormat: '시간 형식',
			selectMacro: '매크로 선택...'
    },
    dateRange: {
      format: '날짜 형식',
      includeTime: '시간 포함',
      timeFormat: '시간 형식'
    },
    formula: {
      label: '수식',
      placeholder: '수식...',
      syntax: '구문',
      examples: '예시'
    },
    select: {
      option: {
        label: '옵션',
        add: '옵션 추가',
        selectDefault: '기본 옵션 선택...',
        search: '옵션 검색...',
        noOptionFound: '옵션이 없습니다',
        update: '옵션 업데이트',
        delete: '옵션 삭제',
        createRecord: '해당 옵션에서 레코드 생성',
				create: '옵션 생성'
      },
      allowAddMultiple: '여러 옵션 추가 허용',
      changeFromMultipleToSingle: '여러 옵션을 단일 옵션으로 변경!',
      changeFromMultipleToSingleDescription: '첫 번째 옵션만 유지됩니다.',
      min: '최소 항목 수',
      max: '최대 항목 수',
      minPlaceholder: '최소 항목 수...',
      maxPlaceholder: '최대 항목 수...'
    },
    attachment: {
      min: '최소 항목 수',
      max: '최대 항목 수',
      minPlaceholder: '최소 항목 수...',
      maxPlaceholder: '최대 항목 수...'
    },
    user: {
      allowAddMultiple: '여러 사용자 추가 허용',
      changeFromMultipleToSingle: '여러 옵션을 단일 옵션으로 변경!',
      changeFromMultipleToSingleDescription: '첫 번째 옵션만 유지됩니다.',
      min: '최소 항목 수',
      max: '최대 항목 수',
      minPlaceholder: '최소 항목 수...',
      maxPlaceholder: '최대 항목 수...'
    },
    reference: {
      foreignTable: '외부 표',
      createSymmetricField: '대칭 필드 생성',
      limitRecordSelectionToCondition: '레코드 선택을 조건으로 제한합니다.',
      min: '최소 항목 수',
      max: '최대 항목 수',
      minPlaceholder: '최소 항목 수...',
      maxPlaceholder: '최대 항목 수...'
    },
    rollup: {
      referenceField: '참조 필드',
      selectReferenceField: '참조 필드 선택...',
      foreignRollupField: '외부 집계 필드',
      aggregateFunction: '집계 함수'
    },
    button: {
      label: '라벨',
      disabledWhen: '버튼 비활성화 조건',
      updateValueWhenClickButton: '버튼을 클릭할 때 값 업데이트',
      confirmBeforeUpdate: '업데이트 전 확인',
      addAnotherFieldToUpdate: '다른 업데이트 필드 추가',
      valueToUpdate: '업데이트 값...'
    }
  }

const view = {
  field: {
    showAllFields: '모든 필드 표시',
    hideAllFields: '모든 필드 숨기기',
    showSystemFields: '시스템 필드 표시',
    hideSystemFields: '시스템 필드 숨기기'
  },
	widget: {
		title: '뷰 위젯',
		empty: '위젯이 없습니다',
		add: '위젯 추가'
	},
  kanban: {
    kanban: '칸반',
    update: '칸반 뷰 업데이트',
    view: '칸반 뷰',
    field: '칸반 필드',
    groupBy: '유형 필드를 기준으로 그룹화',
    noSelectField: '유형 필드를 선택하지 않음',
    noOption: '옵션이 없음',
    collapseLane: '접기'
  },
  gallery: {
    gallery: '갤러리',
    update: '갤러리 뷰 업데이트',
    view: '갤러리 뷰',
    field: '갤러리 필드',
    groupBy: '첨부 유형 필드를 기준으로 그룹화',
    noAttachmentField: '첨부 유형 필드가 없음'
  },
  calendar: {
    calendar: '달력',
    update: '달력 뷰 업데이트',
    view: '달력 뷰',
    field: '달력 필드',
    groupBy: '날짜 필드를 기준으로 그룹화',
    select: '달력 선택 유형 필드를 선택하여 달력 그룹화',
    selectField: '달력 필드 선택',
    noDateField: '날짜 필드가 없음',
    scope: {
      selectedDate: '선택한 날짜',
      withoutDate: '날짜 없음',
      thisMonth: '이번 달',
      allRecords: '모든 레코드',
      thisWeek: '이번 주',
    }
  },
  pivot: {
    pivot: '피봇',
    update: '피봇 뷰 업데이트',
    view: '피봇 뷰',
    columnLabel: '열 라벨',
    rowLabel: '행 라벨',
    swap: '열 라벨과 교환',
    aggregate: '집계',
    aggregateFn: {
      sum: '합계',
      count: '개수',
      average: '평균',
      max: '최대값',
      min: '최소값'
    },
    value: '값',
    selectField: '피봇 데이터 집계를 위한 필드 선택...'
  },
  type: '뷰 유형',
  create: '뷰 생성',
  created: '뷰가 생성되었습니다',
  updateName: '뷰 이름 업데이트',
  updated: '뷰가 업데이트되었습니다',
  duplicateView: '뷰 복제',
  deleteView: '뷰 삭제',
  downloadView: '뷰 다운로드',
  downloadAsExcel: 'Excel로 다운로드',
  downloadAsCSV: 'CSV로 다운로드',
  downloadAsJSON: 'JSON으로 다운로드',
  setAsDefaultView: '기본 뷰로 설정',
}

const aggregate = {
  searchType: '집계 유형 검색...',
  selectField: '집계를 위한 필드 선택...'
}

const dashboard = {
  dashboards: '대시보드',
  create: '대시보드 생성',
  nameDescription: '대시보드의 공용 표시 이름입니다.',
  updateName: '대시보드 이름 업데이트',
  duplicateDashboard: '대시보드 복제',
  deleteDashboard: '대시보드 삭제',
  confirmDeleteDashboard: '대시보드를 삭제하시겠습니까?',
  confirmDeleteDashboardDescription: '이 작업은 취소할 수 없습니다. 이 작업은 영구적으로 대시보드를 삭제하고 서버에서 데이터를 삭제합니다.',
  duplicateDashboardDescription: '대시보드를 복제하시겠습니까?',
  duplicateDashboardConfirm: '대시보드 복제',
  updateDashboard: '대시보드 업데이트',
}

const base = {
  name: 'Base 이름',
  noBases: 'Base가 없습니다',
  created: 'Base가 생성되었습니다',
  displayName: 'Base 표시 이름',
  importFromTemplate: '템플릿에서 가져오기',
  createBase: 'Base 생성',
  baseSettings: 'Base 설정',
  updateBase: 'Base 업데이트',
  deleteBase: 'Base 삭제',
  updateBaseName: 'Base 이름 업데이트',
  deleteBaseConfirm: 'Base를 삭제하시겠습니까?',
  duplicateBase: 'Base 복제 {name}',
  includeData: '데이터 포함',
  nameDescription: 'Base의 표시 이름입니다.',
  includeDataDescription: '새로운 Base에 데이터를 포함합니다.',
  duplicateBaseDescription: '새로운 Base를 생성하여 Base의 모든 표를 포함합니다.',
  systemFieldsUpdated: '시스템 필드가 현재 사용자와 시간 스탬프로 업데이트됩니다.'
}

const space = {
  space: '공간',
  spaces: '공간',
  name: '공간 이름',
  setDisplayName: '표시 이름 설정',
  searchMembers: '멤버 검색...',
  cannotInviteMemberToPersonalSpace: '개인 공간에 멤버를 초대할 수 없습니다.',
  createSpace: '공간 생성',
  createSpaceDescription: '새로운 공간을 생성하여 데이터를 조직하고 다른 팀원과 협업할 수 있습니다.',
  spaceName: '공간 이름',
  spaceNameDescription: '공간의 표시 이름입니다.',
  personalSpace: '개인 공간을 삭제할 수 없습니다.',
  deleteSpace: '공간 삭제',
  deleteSpaceConfirm: '공간을 삭제하시겠습니까?',
  deleteSpaceDescription: '이 작업은 취소할 수 없습니다. 이 작업은 영구적으로 데이터베이스 상태를 삭제하고 서버에서 데이터를 삭제합니다.',
  memberList: '작업 영역 멤버 목록입니다.',
  inviteMember: '멤버 초대',
  invitations: '초대',
  invite: '초대',
  pendingInvitations: '대기 중인 초대 목록입니다.',
  invitedAt: '초대 시간',
  deleteInvitation: '초대 삭제'
}

const schema = {
  label: '필드 구조',
  systemFields: '시스템 필드',
  required: '필수',
  display: '표시',
  fieldName: '필드 이름',
  addField: '필드 추가'
}

const account = {
  logout: '로그아웃',
  accountSettings: '계정 설정',
  apiToken: 'Api Token',
  undbTemplates: 'Undb 템플릿',
  undbWebsite: 'Undb 웹사이트'
}

const setting = {
  setting: '설정',
  members: '멤버',
  settingAndMembers: '설정 및 멤버',
}

const roles = {
  owner: '소유자',
  admin: '관리자',
  member: '멤버',
  viewer: '뷰어'
}

const webhook = {
  label: 'Webhook',
  create: 'Webhook 생성',
  delete: 'Webhook 삭제',
  update: 'Webhook 업데이트',
	duplicate: 'Webhook 복제',
  noWebhooks: '{table} Webhook이 없습니다',
  noWebhooksDescription: '버튼을 클릭하여 첫 번째 Webhook을 생성하세요',
}

const authz = {
  noRecordLevelSecurity: '{table} 레코드 수준 권한이 없습니다',
  noRecordLevelSecurityDescription: '버튼을 클릭하여 첫 번째 레코드 수준 권한 전략을 생성하세요',
  create: '레코드 수준 권한 생성',
  created: '레코드 수준 권한이 생성되었습니다',
  failed: '레코드 수준 권한 생성 실패',
  rlsName: '레코드 수준 권한 이름',
  giveYourRLSName: '레코드 수준 권한 이름을 지어주세요',
  actions: {
    read: '읽기',
    create: '생성',
    update: '업데이트',
    delete: '삭제'
  },
  subjectName: '주체',
  subject: {
    any: '모든 사용자',
    user: '지정 사용자',
    group: '지정 사용자 그룹'
  },
  action: '작업',
  allow: '허용',
  deny: '거부',
  matchesConditions: '조건 일치...',
  updateCondition: '조건 업데이트',
  notAllow: '허용하지 않음',
  updateRLS: '레코드 수준 권한 업데이트',
  policy: {
    update: '업데이트 전략',
    delete: '삭제 전략',

  }
}

const events = {
  record: {
    created: '레코드 생성',
    updated: '레코드 업데이트',
    deleted: '레코드 삭제'
  }
}

const template = {
  template: '템플릿',
  useThisTemplate: '이 템플릿 사용',
  previewTemplate: '템플릿 미리보기',
  getStarted: '이 템플릿으로 시작',
  whichSpace: "이 템플릿을 생성할 공간은 어디인가요?",
  whichSpaceDescription: "새로운 Base 또는 선택한 공간에 새로운 테이블을 생성할 수 있습니다.",
  createBase: 'Base 생성',
  selectATemplateToCreateABase: '템플릿을 선택하여 Base를 생성하세요',
  includeDataDescription: '템플릿의 데이터를 새로운 Base 또는 테이블에 포함합니다.',
  loginToCreateNewBaseOrTable: '로그인하여 새로운 Base 또는 테이블을 생성하세요'
}

const auth = {
  login: '로그인',
  loginFailed: '로그인 실패',
  gotoSpace: '공간으로 이동',
  forgotPassword: '비밀번호를 까먹었나요?',
  emailPlaceholder: '이메일 주소를 입력하세요...',
  password: '비밀번호',
  register: '회원가입',
  noAccount: '계정이 없나요?',
  registerDisabled: '회원가입이 비활성화되었습니다.',
	registerDisabledDescription: '관리자에게 문의하여 회원가입을 요청하세요.',
  loginWith: '로그인 {provider}',
  invalidEmailOrPassword: '유효하지 않은 이메일 또는 비밀번호입니다.',
  loginToYourAccountAndAcceptTheInvitation: '로그인하여 초대를 수락하세요',
  loginWithEmailDescription: '이메일 주소와 비밀번호를 입력하여 로그인하세요.',
  enterYourEmailBelowToResetYourPassword: '비밀번호를 재설정하기 위해 이메일 주소를 입력하세요.',
  emailSent: '이메일이 전송되었습니다!',
  youCanCheckYourEmailAddressAndFollowTheStepsToResetYourPassword: '이메일 주소를 확인하고 비밀번호를 재설정하는 단계를 따르세요.',
  registerFailed: '회원가입 실패',
  passwordDoesNotMatch: '비밀번호가 일치하지 않습니다',
  enterYourDisplayUsername: '표시 사용자 이름을 입력하세요',
  username: '사용자 이름',
  invited: '초대됨',
  confirmPassword: '비밀번호 확인',
  createAnAccount: '계정 생성',
  alreadyHaveAnAccount: '계정이 있나요?',
  signIn: '로그인',
  createAccountAndAcceptInvitation: '계정 생성 및 초대 수락',
  enterYourInformationToCreateAnAccount: '계정을 생성하기 위한 정보를 입력하세요.',
  enterYourWorkEmail: '작업 이메일을 입력하세요...',
  sendOtpCode: '코드 전송',
  verifyOtp: '코드 검증'
}

const playground = {
  playgroundMode: '플레이그라운드 모드',
  playgroundModeDescription: '플레이그라운드 모드입니다. 페이지를 닫거나 새로고침하면 모든 변경 사항이 손실됩니다.'
}

const ko = {
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
      importFile: '파일 가져오기...',
      firstRowAsHeader: '첫 번째 행을 헤더로',
      importData: '데이터 가져오기',
      fieldsSelected: '{count} 필드 선택',
      configField: '필드 설정',
      nextStep: '다음 단계',
    },
  },
  webhook,
	common: {
    back: '뒤로',
		error: '오류',
		continue: '계속',
    description: '설명',
		cancel: '취소',
		create: '생성',
    search: '검색',
		creating: '생성 중',
		confirm: '확인',
		update: '수정',
    select: '선택',
    event: '이벤트',
		submit: '제출',
		duplicate: '복제',
		delete: '삭제',
		settings: '설정',
		save: '저장',
		language: '언어',
		data: '데이터',
    auth: '권한',
    developer: '개발자',
    name: '이름',
    dangerZone: '위험 영역',
    remove: '제거',
    accountAndSpaceSettings: '계정 및 공간 설정',
    email: '이메일',
    role: '역할',
    action: '작업',
    status: '상태',
    required: '필수',
    enabled: '활성화',
    enableCondition: '활성화 조건',
    type: '유형',
    loadMore: '더 로드',
    today: '오늘',
    clear: '지우기',
    updated: '업데이트됨',
    now: '지금',
    import: '가져오기'
	},
 share: {
	title: '공유',
	shareUrl: '공유 링크',
	iframeUrl: '삽입 링크',
	shareId: '공유 ID',
	enable: '공유 활성화',
	copied: '클립보드에 복사되었습니다',
	button: '공유'
},
widget: {
  title: '위젯',
  button: "위젯",
	name: '이름',
	add: '위젯 추가',
	editName: '이름 편집',
	duplicate: '위젯 복제 {name}',
	delete: '위젯 삭제 {name}',
	deleteConfirm: {
		title: '위젯 {name} 삭제?',
		description: '이 작업은 취소할 수 없습니다. 이 작업은 영구적으로 이 위젯을 삭제하고 서버에서 데이터를 삭제합니다.'
	},
	count: '개수',
	aggregate: '집계',
	filters: '필터',
},
dashboard

} satisfies BaseTranslation

export default ko
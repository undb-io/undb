import type { CalendarTimeScale,FieldType,IFieldAggregate,IFieldMacro,IOpType,IRollupFn,ViewType } from "@undb/table"
import type { BaseTranslation } from "../i18n-types.js"

const ops: Record<IOpType, string> = {
  eq: "같음",
  neq: "같지 않음",
  contains: "포함",
  does_not_contain: "포함하지 않음",
  starts_with: "시작",
  ends_with: "끝남",
  is_empty: "비어 있음",
  is_not_empty: "비어 있지 않음",
  min: "최소",
  max: "최대",
  gt: "보다 큼",
  gte: "보다 크거나 같음",
  lt: "보다 작음",
  lte: "보다 작거나 같음",
  in: "목록에 있음",
  nin: "목록에 없음",
  any_of: "다음 중 하나",
  not_any_of: "다음 중 하나가 아님",
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

const fieldTypes: Record<FieldType, string> = {
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
  attachment: "첨부",
  json: "JSON",
  checkbox: "체크박스",
  user: "사용자",
  currency: "통화",
  duration: "기간",
  button: "버튼",
  percentage: "백분율",
  formula: "수식"
}

const rollupFns: Record<IRollupFn, string> = {
  min: "최소",
  max: "최대",
  sum: "합계",
  average: "평균",
  count: "카운트",
  lookup: "조회"
}

const aggregateFns: Record<IFieldAggregate, string> = {
  min: "최소",
  max: "최대",
  sum: "합계",
  count: "카운트",
  count_empty: "빈 값 수",
  count_uniq: "고유 값 수",
  count_not_empty: "비어 있지 않은 값 수",
  percent_empty: "빈 값 비율",
  percent_not_empty: "비어 있지 않은 값 비율",
  percent_uniq: "고유 값 비율",
  avg: "평균",
  count_true: "참 값 수",
  count_false: "거짓 값 수",
  percent_true: "참 값 비율",
  percent_false: "거짓 값 비율",
  start_max: "시작일 최대",
  end_max: "종료일 최대",
  start_min: "시작일 최소",
  end_min: "종료일 최소"
}

const macros: Record<IFieldMacro, string> = {
  "@me": "현재 사용자",
  "@now": "현재",
  "@today": "오늘",
  "@yesterday": "어제",
  "@tomorrow": "내일"
}

const viewTypes: Record<ViewType, string> = {
  grid: "그리드",
  kanban: "칸반",
  gallery: "갤러리",
  list: "목록",
  calendar: "캘린더",
  pivot: "피벗"
}

const widgetTypes: Record<string, string> = {
  aggregate: "집계",
  chart: "차트",
  table: "테이블"
}

const timeScales: Record<CalendarTimeScale, string> = {
  month: "월",
  week: "주",
  day: "일"
}

const record = {
  label: '레코드',
  openMenu: '메뉴 열기',
  create: '레코드 생성',
  update: '레코드 수정',
  delete: '레코드 삭제',
  viewRecordDetail: '레코드 상세 보기',
  copyRecordId: '레코드 ID 복사',
  createByForm: '양식으로 생성',
  duplicateRecord: '레코드 복제',
  includeData: '데이터 포함',
  records: '{n|number}개 레코드',
  detail: '레코드 상세',
  duplicate: '{n|number}개 레코드 복제',
  updateRecords: '{n|number}개 레코드 수정',
  bulkUpdateRecords: '{n|number}개 레코드 일괄 수정',
  deleteRecords: '{n|number}개 레코드 삭제',
  confirmDeleteRecord: '이 레코드를 삭제하시겠습니까?',
  confirmDeleteRecordDescription: '이 작업은 취소할 수 없습니다. 이 레코드가 영구적으로 삭제되고 서버에서 데이터가 제거됩니다.',
  confirmDeleteRecords: '{n|number}개의 레코드를 삭제하시겠습니까?',
  confirmDeleteRecordsDescription: '이 작업은 취소할 수 없습니다. {table}의 레코드가 영구적으로 삭제됩니다.',
  confirmDuplicateRecords: '{n|number}개 레코드를 복제하시겠습니까?',
  confirmDuplicateRecordsDescription: '이 작업은 {table}의 {n|number}개 레코드를 복제합니다.',
  confirmDuplicateRecord: '레코드를 복제하시겠습니까?',
  confirmDuplicateRecordDescription: '새로운 ID로 레코드가 생성됩니다.',
  failedToDuplicateRecord: '레코드 복제 실패',
  failedToDeleteRecord: '레코드 삭제 실패',
  copiedRecordId: '레코드 ID가 클립보드에 복사되었습니다',
  createdRecord: '레코드가 생성되었습니다!',
  bulkUpdate: {
    title: '레코드 일괄 수정',
    description: '선택된 모든 필드가 수정됩니다',
    updateWithCondition: '다음 조건으로 레코드 수정',
    addField: '수정 필드 추가',
    selectColumns: '수정할 열 선택',
    updated: '수정됨',
    selectAll: '모두 선택',
    removeAll: '모두 제거',
    continue: '계속',
    noRecordsUpdated: '수정된 레코드 없음',
    recordsUpdated: '{count}개 레코드가 성공적으로 수정되었습니다',
    button: '일괄 수정'
  },
  reference: {
    link: '레코드 연결',
    linked: '{n|number}개 연결된 레코드'
  },
  button: {
    confirmToUpdate: '수정 확인',
    confirmToUpdateDescription: '버튼을 클릭하면 다음 필드가 수정됩니다.',
  }
}

const form = {
  label: '양식',
  create: '양식 생성',
  noForms: '{tableName}에 양식이 없습니다',
  noFormsDescription: '양식에서 데이터를 수집할 수 있습니다.',
  addDescription: '설명 추가',
  condition: '조건',
  invalidCondition: '유효하지 않은 조건',
  setDefaultValue: '{field}의 기본값 설정',
  formField: '양식 필드',
  fieldsSelected: '{n}개 필드 선택됨',
  searchFormField: '양식 필드 검색...',
  selectAllFields: '모든 필드 선택',
  hideFields: '필드 숨기기',
  showFields: '필드 표시',
  noFieldsFound: '제목이 `{q}`인 필드를 찾을 수 없습니다',
  formSetting: '양식 설정',
  duplicateForm: '양식 복제',
  deleteForm: '양식 삭제',
  duplicateSuccess: '양식이 성공적으로 복제되었습니다',
  backgroundColor: '배경색',
  autoAddNewField: '새 필드 생성 시 양식에 자동 추가',
  autoAddNewFieldDescription: '새 필드가 생성되면 자동으로 표시되도록 설정됩니다.',
  deleteFormConfirm: '양식 삭제: {name}?',
  deleteFormDescription: '양식이 영구적으로 삭제됩니다.',
  duplicateFormDialog: '양식 복제: {name}?',
  duplicateFormDialogDescription: '양식이 복제됩니다.',
  setName: '양식 이름 설정',
  enableCondition: '조건 활성화'
}

const common = {
  tables: '테이블',
  table: '테이블',
  filters: '필터',
  color: '색상',
  select: '테이블 선택...',
  search: '테이블 검색...',
  noTablesFound: '테이블을 찾을 수 없습니다.',
  sorts: {
    sort: '정렬',
    add: '정렬 추가',
    empty: '정렬 없음',
    direction: {
      asc: '오름차순',
      desc: '내림차순'
    }
  },
  fields: '필드',
  filter: {
    empty: '필터 없음'
  },
  condition: {
    add: '조건 추가',
    addGroup: '조건 그룹 추가'
  },
  submit: '제출',
  cancel: '취소',
  where: '조건',
  searchOp: '연산자 검색...',
  colorEmpty: '색상 없음',
  updateName: '테이블 이름 수정',
  duplicateTable: '테이블 복제',
  deleteTable: '테이블 삭제',
  create: '새 테이블 생성',
  import: '테이블 가져오기'
}

const field = {
  field: '필드',
  fields: '필드',
  create: '필드 생성',
  update: '필드 수정',
  delete: '필드 삭제',
  deleteConfirm: "다음 필드를 삭제하시겠습니까? 이 필드와 관련된 모든 데이터가 테이블에서 영구적으로 삭제됩니다.",
  duplicate: '필드 복제',
  duplicateDescription: '다음 필드를 복제하시겠습니까?',
  hidden: '{n|number}개 필드 숨김',
  searchTableFields: '{table} 필드 검색...',
  selectField: '필드 선택...',
  empty: '필드 없음',
  searchType: '필드 유형 검색...',
  defaultValue: {
    label: '기본값',
    placeholder: '기본값...',
    invalid: '유효하지 않은 기본값',
    invalidDescription: '기본값이 유효하지 않습니다. 기본값이 저장되지 않습니다.',
    markAsRequired: '필수 필드로 표시'
  },
  display: {
    label: '표시 필드',
    markAsDisplay: '표시 필드로 표시'
  },
  reference: {
    label: '참조',
    foreignTable: '참조 테이블',
    displayFields: '표시 필드',
    noDisplayFields: '표시 필드 없음',
    bidirectional: '양방향',
    symmetricReferenceField: '대칭 참조 필드',
    createSymmetricReferenceField: '대칭 참조 필드 생성',
    createSymmetricReferenceFieldDescription: '대칭 참조 필드가 참조 테이블에 생성됩니다.',
    symmetricReferenceFieldName: '대칭 참조 필드 이름',
    noFields: '필드 없음',
    addDisplayField: '표시 필드 추가',
    removeDisplayField: '표시 필드 제거',
    displayFieldsDescription: '참조된 레코드를 표시할 때 사용할 필드를 선택하세요.',
    noForeignTable: '참조할 테이블이 없습니다.',
    createForeignTable: '테이블 생성',
    selectForeignTable: '테이블 선택',
    unselectForeignTable: '테이블 선택 해제'
  },
  select: {
    label: '선택',
    options: '옵션',
    addOption: '옵션 추가',
    noOptions: '옵션 없음',
    option: {
      name: '옵션 이름',
      color: '옵션 색상'
    }
  },
  rating: {
    label: '평가',
    max: '최대값',
    icon: {
      label: '아이콘',
      star: '별',
      heart: '하트',
      fire: '불',
      smile: '웃는 얼굴',
      thumb: '엄지',
      sun: '태양',
      moon: '달',
      flag: '깃발',
      clock: '시계'
    }
  },
  formula: {
    label: '수식',
    inputPlaceholder: '수식 입력...',
    invalidFormula: '유효하지 않은 수식',
    variables: '변수',
    functions: '함수',
    operators: '연산자',
    today: '오늘',
    now: '현재',
    currentUser: '현재 사용자',
    error: '오류',
    documentation: '문서',
    returnType: '반환 유형',
    lastPosition: '마지막 위치',
    current: '현재',
    variableNotFound: '변수를 찾을 수 없음',
    functionNotFound: '함수를 찾을 수 없음'
  }
}

const view = {
  views: '뷰',
  create: '뷰 생성',
  createView: '새 뷰 생성',
  grid: {
    grid: '그리드',
    update: '그리드 뷰 수정',
    view: '그리드 뷰'
  },
  kanban: {
    kanban: '칸반',
    update: '칸반 뷰 수정',
    view: '칸반 뷰',
    field: '칸반 필드',
    groupBy: '선택 유형 필드로 그룹화',
    noSelectField: '선택 필드를 찾을 수 없습니다.'
  },
  gallery: {
    gallery: '갤러리',
    update: '갤러리 뷰 수정',
    view: '갤러리 뷰',
    field: '갤러리 필드',
    groupBy: '첨부 유형 필드로 그룹화',
    noAttachmentField: '첨부 필드를 찾을 수 없습니다.'
  },
  calendar: {
    calendar: '캘린더',
    update: '캘린더 뷰 수정',
    view: '캘린더 뷰',
    field: '캘린더 필드',
    groupBy: '날짜 필드로 그룹화',
    noDateField: '날짜 필드를 찾을 수 없습니다.',
    select: '캘린더 레인을 그룹화할 선택 유형 필드 선택',
    selectField: '캘린더 필드 선택'
  },
  pivot: {
    pivot: '피벗',
    update: '피벗 뷰 수정',
    view: '피벗 뷰',
    columnLabel: '열 레이블',
    rowLabel: '행 레이블',
    swap: '열 레이블과 교체',
    aggregate: '집계',
    aggregateFn: {
      sum: '합계',
      count: '카운트',
      average: '평균',
      max: '최대',
      min: '최소'
    },
    value: '값',
    selectField: '피벗할 필드 선택...'
  },
  type: '뷰 유형',
  updated: '뷰가 수정되었습니다',
  updateName: '뷰 이름 수정',
  duplicateView: '뷰 복제',
  deleteView: '뷰 삭제',
  downloadView: '뷰 다운로드',
  downloadAsExcel: 'Excel로 다운로드',
  downloadAsCSV: 'CSV로 다운로드',
  downloadAsJSON: 'JSON으로 다운로드',
  setAsDefaultView: '기본 뷰로 설정'
}

const aggregate = {
  searchType: '집계 유형 검색...',
  selectField: '집계할 필드 선택...'
}

const dashboard = {
  dashboards: '대시보드',
  create: '대시보드 생성',
  nameDescription: '대시보드의 공개 표시 이름입니다.',
  updateName: '대시보드 이름 수정',
  duplicateDashboard: '대시보드 복제',
  deleteDashboard: '대시보드 삭제',
  confirmDeleteDashboard: '대시보드를 삭제하시겠습니까?',
  confirmDeleteDashboardDescription: '이 작업은 취소할 수 없습니다. 대시보드가 영구적으로 삭제되고 서버에서 데이터가 제거됩니다.',
  duplicateDashboardDescription: '대시보드를 복제하시겠습니까?',
  duplicateDashboardConfirm: '대시보드 복제',
  updateDashboard: '대시보드 수정'
}

const base = {
  name: '베이스 이름',
  createBase: '새 베이스 생성',
  importFromTemplate: '템플릿에서 가져오기',
  displayName: '베이스 표시 이름',
  noBases: '베이스 없음',
  baseSettings: '베이스 설정',
  updateBase: '베이스 수정',
  updateBaseName: '베이스 이름 수정',
  deleteBase: '베이스 삭제',
  deleteBaseConfirm: '다음 베이스를 삭제하시겠습니까?',
  duplicateBase: '베이스 복제 {name}',
  nameDescription: '베이스의 표시 이름입니다.',
  includeData: '데이터 포함',
  includeDataDescription: '새 베이스에 데이터를 포함합니다.',
  duplicateBaseDescription: '베이스의 모든 테이블을 포함하는 새 베이스를 생성합니다.',
  systemFieldsUpdated: '시스템 필드가 현재 사용자와 타임스탬프로 업데이트됩니다.'
}

const space = {
  spaces: '스페이스',
  name: "스페이스 이름",
  setDisplayName: '표시 이름 설정',
  searchMembers: '멤버 검색...',
  cannotInviteMemberToPersonalSpace: '개인 스페이스에는 멤버를 초대할 수 없습니다.',
  createSpace: '스페이스 생성',
  personalSpace: '{username}의 개인 스페이스',
  createSpaceDescription: '데이터를 구성하고 팀과 협업하기 위한 새 스페이스를 생성합니다.',
  spaceName: '스페이스 이름',
  spaceNameDescription: '스페이스의 표시 이름입니다.',
  cannotDeletePersonalSpace: '개인 스페이스는 삭제할 수 없습니다.',
  deleteSpace: '스페이스 삭제',
  deleteSpaceConfirm: '다음 스페이스를 삭제하시겠습니까?',
  deleteSpaceDescription: '이 작업은 취소할 수 없습니다. 데이터베이스 상태가 영구적으로 삭제되고 서버에서 데이터가 제거됩니다.',
  memberList: '워크스페이스 멤버 목록입니다.',
  inviteMember: '멤버 초대',
  invitations: '초대',
  invite: '초대',
  pendingInvitations: '대기 중인 초대 목록입니다.',
  invitedAt: '초대 시간',
  deleteInvitation: '초대 삭제'
}

const schema = {
  label: '스키마',
  systemFields: '시스템 필드',
  required: '필수',
  display: '표시',
  fieldName: '필드 이름',
  addField: '필드 추가'
}

const account = {
  logout: '로그아웃',
  accountSettings: '계정 설정',
  apiToken: 'API 토큰',
  undbTemplates: 'Undb 템플릿',
  undbWebsite: 'Undb 웹사이트'
}

const setting = {
  setting: '설정',
  members: '멤버',
  settingAndMembers: '설정 및 멤버'
}

const roles = {
  owner: '소유자',
  admin: '관리자',
  member: '멤버',
  viewer: '뷰어'
}

const webhook = {
  label: '웹훅',
  create: '웹훅 생성',
  delete: '웹훅 삭제',
  update: '웹훅 수정',
  noWebhooks: '{table}에 웹훅이 없습니다',
  noWebhooksDescription: '버튼을 클릭하여 첫 번째 웹훅을 생성하세요'
}

const authz = {
  noRecordLevelSecurity: '{table}에 레코드 수준 보안이 없습니다',
  noRecordLevelSecurityDescription: '버튼을 클릭하여 첫 번째 레코드 수준 보안 정책을 생성하세요',
  create: '레코드 수준 보안 생성',
  created: '레코드 수준 보안이 생성되었습니다',
  failed: '레코드 수준 보안 생성 실패',
  rlsName: '레코드 수준 보안 이름',
  giveYourRLSName: '레코드 수준 보안 이름을 지정하세요',
  actions: {
    read: '읽기',
    create: '생성',
    update: '수정',
    delete: '삭제'
  },
  subjectName: '주체',
  subject: {
    any: '모든 사용자',
    user: '특정 사용자',
    group: '특정 사용자 그룹'
  },
  action: '작업',
  allow: '허용',
  deny: '거부',
  matchesConditions: '조건 일치...',
  updateCondition: '조건 수정',
  notAllow: '허용하지 않음',
  policy: {
    update: '정책 수정',
    delete: '정책 삭제'
  },
  updateRLS: '레코드 수준 보안 수정'
}

const events = {
  record: {
    created: '레코드 생성됨',
    updated: '레코드 수정됨',
    deleted: '레코드 삭제됨'
  }
}

const ko = {
  setting,
  base,
  space,
  account,
  roles,
  webhook,
  table: {
    authz,
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
    events,
  },
  common: {
    duplicate: '복제',
    description: '설명',
    cancel: '취소',
    create: '생성',
    select: '선택',
    event: '이벤트',
    creating: '생성 중',
    search: '검색',
    confirm: '확인',
    update: '수정',
    continue: '계속',
    submit: '제출',
    delete: '삭제',
    settings: '설정',
    save: '저장',
    language: '언어',
    data: '데이터',
    auth: '인증',
    developer: '개발자',
    name: '이름',
    dangerZone: '위험 구역',
    remove: '제거',
    accountAndSpaceSettings: '계정 및 스페이스 설정',
    email: '이메일',
    role: '역할',
    action: '작업',
    status: '상태',
    required: '필수',
    enabled: '활성화됨',
    enableCondition: '조건 활성화',
    type: '유형'
  },
  share: {
    title: '공유',
    shareUrl: '공유 URL',
    iframeUrl: 'IFrame URL',
    shareId: '공유 ID',
    enable: '공유 활성화',
    copied: '클립보드에 복사됨',
    button: '공유'
  },
  widget: {
    title: '위젯',
    button: "위젯",
    name: '이름',
    add: '위젯 추가',
    type: '유형',
    editName: '이름 수정',
    duplicate: '위젯 복제 {name}',
    delete: '위젯 삭제 {name}',
    deleteConfirm: {
      title: '위젯 삭제 {name}?',
      description: '이 작업은 취소할 수 없습니다. 이 위젯이 영구적으로 삭제되고 서버에서 데이터가 제거됩니다.'
    },
    count: '카운트',
    aggregate: '집계',
    filters: '필터'
  },
  dashboard
} satisfies BaseTranslation

export default ko
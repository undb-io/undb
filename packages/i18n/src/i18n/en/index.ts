import type { BaseTranslation } from "../i18n-types.js"

const ops = {
  eq: "=",
  neq: "!=",
  contains: "Contains",
  does_not_contain: "Not Contains",
  starts_with: "Starts With",
  ends_with: "Ends With",
  is_empty: "Is Empty",
  is_not_empty: "Is Not Empty",
  min: "Min",
  max: "Max",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  in: 'In',
  nin: 'Not In',
  any_of: 'Any Of',
  not_any_of: 'Not Any Of',
  is_same_day: "Is Same Day",
  is_not_same_day: "Is Not Same Day",
  is_tody: "Is Today",
  is_not_today: "Is Not Today",
  is_after_today: "Is After Today",
  is_before_today: "Is Before Today",
  is_tomorrow: "Is Tomorrow",
  is_not_tomorrow: "Is Not Tomorrow",
  is_after_tomorrow: "Is After Tomorrow",
  is_before_tommorow: "Is Before Tomorrow",
  is_yesterday: "Is Yesterday",
  is_not_yesterday: "Is Not Yesterday",
  is_after_yesterday: "Is After Yesterday",
  is_before_yesterday: "Is Before Yesterday",
  is_before: "Is Before",
  is_not_before: "Is Not Before",
  is_after: "Is After",
  is_not_after: "Is Not After",
  is_true: "Is True",
  is_false: "Is False",
}

const fieldTypes = {
  string: "String",
  longText: "Long Text",
  number: "Number",
  date: "Date",
  dateRange: "Date Range",
  id: "ID",
  createdAt: "Created At",
  autoIncrement: "Auto Increment",
  updatedAt: "Updated At",
  createdBy: "Created By",
  updatedBy: "Updated By",
  reference: "Reference",
  rollup: "Rollup",
  select: "Select",
  rating: "Rating",
  email: "Email",
  url: "URL",
  attachment: "Attachment",
  json: "JSON",
  checkbox: "Checkbox",
  user: "User",
  currency: "Currency",
  duration: "Duration",
  button: "Button",
  percentage: "Percentage",
  formula: "Formula",
}

const rollupFns = {
  min: "Min",
  max: "Max",
  sum: "Sum",
  average: "Average",
  count: "Count",
  lookup: "Lookup"
}

const aggregateFns = {
  min: "Min",
  max: "Max",
  sum: "Sum",
  count: "Count",
  count_empty: "Empty",
  count_uniq: "Unique",
  count_not_empty: "Filled",
  percent_empty: "Percent Empty",
  percent_not_empty: "Percent Filled",
  percent_uniq: "Percent Unique",
  avg: "Average",
  count_true: "True",
  count_false: "False",
  percent_true: "Percent True",
  percent_false: "Percent False",
  start_max: "Start Date Max",
  end_max: "End Date Max",
  start_min: "Start Date Min",
  end_min: "End Date Min",
}

const macros = {
  "@me": "Current User",
  "@now": "Now",
  "@today": "Today",
  "@yesterday": "Yesterday",
  "@tomorrow": "Tomorrow",
}

const viewTypes = {
  grid: "Grid",
  kanban: "Kanban",
  gallery: "Gallery",
  list: "List",
  calendar: "Calendar",
  pivot: "Pivot"
}

const widgetTypes = {
  aggregate: "Aggregate",
  chart: "Chart",
  table: "Table"
}


const timeScales = {
  month: "Month",
  week: "Week",
  day: "Day"
}

const record = {
  label: 'Record',
  labels: 'Records',
  search: 'Search Records...',
  openMenu: 'Open Menu',
  create: 'Create Record',
  update: 'Update Record',
  delete: 'Delete Record',
  viewRecordDetail: 'View Record Detail',
  copyRecordId: 'Copy Record ID',
  createByForm: 'Create By Form',
  duplicateRecord: 'Duplicate Record',
  bulkDuplicated: 'Records have been duplicated!',
  includeData: 'Include Data',
  records: '{n|number} Records',
  detail: 'Record Detail',
  duplicate: 'Duplicate {n|number} Records',
  updateRecords: 'Update {n|number} Records',
  bulkUpdateRecords: 'Bulk Update {n|number} Records',
  deleteRecords: 'Delete {n|number} Records',
  confirmDeleteRecord: 'Are you sure you want to delete this record?',
  confirmDeleteRecordDescription: 'This action cannot be undone. This will permanently delete this record and remove your data from our servers.',
  confirmDeleteRecords: 'Are you sure you want to delete {n|number} records?',
  confirmDeleteRecordsDescription: 'This action cannot be undone. This will permanently delete records from {table}.',
  confirmDuplicateRecords: 'Duplicate {n|number} Records?',
  confirmDuplicateRecordsDescription: 'This action will duplicate {n|number} records of table {table}.',
  confirmDuplicateRecord: 'Duplicate Record?',
  confirmDuplicateRecordDescription: 'A new record with new id will be created.',
  failedToDuplicateRecord: 'Failed to duplicate record',
  failedToDeleteRecord: 'Failed to delete record',
  copiedRecordId: 'Copied record ID to clipboard',
  createdRecord: 'Record has been created!',
  bulkUpdate: {
    title: 'Bulk Update Records',
    description: 'All selected fields will be updated',
    updateWithCondition: 'Update records with the following condition',
    addField: 'Add Update Field',
    selectColumns: 'SELECT COLUMNS TO EDIT',
    updated: 'updated',
    selectAll: 'Select All',
    removeAll: 'Remove All',
    continue: 'Continue',
    noRecordsUpdated: 'No records updated',
    recordsUpdated: '{count} records updated successfully',
    button: 'Bulk Update',
    noFilterAlert: 'No filter, will update all records, please be careful!'
  },
  reference: {
    link: 'Link Records',
    linked: '{n|number} Linked Records'
  },
  button: {
    confirmToUpdate: 'Confirm to update',
    confirmToUpdateDescription: 'The following fields will be updated when you click the button.',
  },
  noRecord: 'No record',
  showHiddenFields: 'Show {n|number} Hidden Fields',
  hideHiddenFields: 'Hide {n|number} Hidden Fields',
}

const form =  {
  label: 'Form',
  create: 'Create Form',
  noForms: '{tableName} have no forms',
  noFormsDescription: 'You can collect data in forms.',
  addDescription: 'Add description',
  condition: 'Condition',
  invalidCondition: 'Invalid condition',
  setDefaultValue: 'Set default value for {field}',
  formField: 'Form Field',
  fieldsSelected: '{n} Fields Selected',
  searchFormField: 'Search form field...',
  selectAllFields: 'Select all fields',
  hideFields: 'Hide Fields',
  showFields: 'Show Fields',
  noFieldsFound: 'No fields found with title `{q}`',
  formSetting: 'Form Setting',
  duplicateForm: 'Duplicate Form',
  deleteForm: 'Delete Form',
  duplicateSuccess: 'Duplicate form successfully',
  backgroundColor: 'Background Color',
  autoAddNewField: 'Auto add new field to form when create field',
  autoAddNewFieldDescription: 'When a new field is created, it will be automatically set to show.',
  deleteFormConfirm: 'Delete form: {name}?',
  deleteFormDescription: 'Form will be deleted permanently.',
  duplicateFormDialog: 'Duplicate form: {name}?',
  duplicateFormDialogDescription: 'Form will be duplicated.',
  setName: 'Set form name',
  enableCondition: 'Enable condition',
}

const common = {
  tables: 'Tables',
  table: 'Table',
  filters: 'Filter',
  color: 'Color',
  select: 'Select A Table...',
  search: 'Search Tables...',
  noTablesFound: 'No tables found.',
  sorts: {
    sort: 'Sort',
    add: 'Add Sort',
    empty: 'There\'s no sort',
    direction: {
      asc: 'Asc',
      desc: 'Desc'
    }
  },
  fields: 'Fields',
  filter: {
    empty: 'There\'s no filters'
	},
  condition: {
    add: 'Add Condition',
    addGroup: 'Add Condition Group'
  },
  submit: 'Submit',
  cancel: 'Cancel',
  where: 'Where',
  searchOp: 'Search Op...',
  colorEmpty: 'There\'s no color',
  updateName: 'Update Table Name',
  duplicateTable: 'Duplicate Table',
  deleteTable: 'Delete Table',
  create: 'Create New Table',
  import: 'Import Table'
}

const webhook = {
  label: 'Webhook',
  create: 'Create Webhook',
  delete: 'Delete Webhook',
  update: 'Update Webhook',
  duplicate: 'Duplicate Webhook',
  noWebhooks: '{table} have no webhooks',
  noWebhooksDescription: 'Click button to create your first webhook',

}

  const field = {
    typeChanged: 'You have changed the field type, data will be cast to new type when possible, but may be cleared',
    field: 'Field',
    fields: 'Fields',
    create: 'Create Field',
		created: 'Field has been created!',
    update: 'Update Field',
    updated: 'Field has been updated!',
    delete: 'Delete Field'  ,
    deleteConfirm: "Are you sure you want to delete the following field? All data associated with this field will be delete perminently from table.",
    deleted: 'Field has been deleted!',
    deleteFailed: 'Failed to delete field',
    duplicate: 'Duplicate Field',
    duplicateDescription: 'Are you sure to duplicate the following field?',
    hidden: '{n|number} Fields Hidden',
    searchTableFields: 'Search {table} fields...',
    selectField: 'Select field...',
    empty: 'No fields',
    searchType: 'Search field type...',
    defaultValue: {
      label: 'Default Value',
      placeholder: 'Default value...',
      invalid: 'Invalid default value',
      invalidDescription: 'Your default value is invalid. Default value will not be saved.',
      markAsRequired: 'Mark as required field.'
    },
    display: {
      label: 'Display FIeld',
      markAsDisplay: 'Mark as display field.'
    },
    id: {
      placeholder: 'Leave blank to auto generate...'
    },
    string: {
      min: 'Min Length',
      max: 'Max Length'
    },
    longText: {
      allowRichText: 'Allow rich text.'
    },
    number: {
      min: 'Min',
      max: 'Max',
      minPlaceholder: 'Min value...',
      maxPlaceholder: 'Max value...'
    },
    duration: {
      min: "Min",
      max: "Max",
      minPlaceholder: "Min value...",
      maxPlaceholder: "Max value..."
    },
    currency: {
      symbol: 'Symbol',
      min: 'Min',
      max: 'Max',
      minPlaceholder: 'Min value...',
      maxPlaceholder: 'Max value...'
    },
    percentage: {
      min: 'Min',
      max: 'Max',
      minPlaceholder: 'Min value...',
      maxPlaceholder: 'Max value...'
    },
    date: {
      format: 'Date Format',
      includeTime: 'Include Time',
      timeFormat: 'Time Format',
			selectMacro: 'Select Macro...'
    },
    dateRange: {
      format: 'Date Format',
      includeTime: 'Include Time',
      timeFormat: 'Time Format'
    },
    formula: {
      label: 'Formula',
      placeholder: 'Formula...',
      syntax: 'Syntax',
      examples: 'Examples'
    },
    select: {
      option: {
        label: 'Option',
        add: 'Add Option',
        selectDefault: 'Select default options...',
        search: 'Search option...',
        noOptionFound: 'No option found.',
        update: 'Update option',
        delete: 'Delete option',
        createRecord: 'Create record under this option',
				create: 'Create option'
      },
      allowAddMultiple: 'Allow add multiple options',
      changeFromMultipleToSingle: 'Change from multiple options to single option!',
      changeFromMultipleToSingleDescription: 'Only first option will be remained.',
      min: 'Min items',
      max: 'Max items',
      minPlaceholder: 'Min items...',
      maxPlaceholder: 'Max items...'
    },
    attachment: {
      min: 'Min items',
      max: 'Max items',
      minPlaceholder: 'Min items...',
      maxPlaceholder: 'Max items...'
    },
    user: {
      allowAddMultiple: 'Allow adding multiple users',
      changeFromMultipleToSingle: 'Change from multiple options to single option!',
      changeFromMultipleToSingleDescription: 'Only first option will be remained.',
      min: 'Min items',
      max: 'Max items',
      minPlaceholder: 'Min items...',
      maxPlaceholder: 'Max items...'
    },
    reference: {
      foreignTable: 'Foreign table',
      createSymmetricField: 'Create symmetric field',
      limitRecordSelectionToCondition: 'Limit record selection to condition.',
      min: 'Min items',
      max: 'Max items',
      minPlaceholder: 'Min items...',
      maxPlaceholder: 'Max items...'
    },
    rollup: {
      referenceField: 'Reference field',
      selectReferenceField: 'Select reference field...',
      foreignRollupField: 'Foreign rollup field',
      aggregateFunction: 'Aggregate function'
    },
    button: {
      label: 'Label',
      disabledWhen: 'Disabled when...',
      updateValueWhenClickButton: 'Update value when click button',
      confirmBeforeUpdate: 'Confirm before update',
      addAnotherFieldToUpdate: 'Add another field to update',
      valueToUpdate: 'Value to update...'
    }
  }

  const view = {
    field: {
      showAllFields: 'Show all fields',
      hideAllFields: 'Hide all fields',
      showSystemFields: 'Show system fields',
      hideSystemFields: 'Hide system fields'
    },
    widget: {
      title: 'View Widgets',
      empty: 'No widgets',
      add: 'Add Widget'
    },
    kanban: {
      kanban: 'Kanban',
      update: 'Update Kanban View',
      view: 'Kanban View',
      field: 'Kanban Field',
      groupBy: 'Group by select type field',
      noSelectField: 'No select field found.',
      noOption: 'No option',
			collapseLane: 'Collapse lane'
    },
    gallery: {
      gallery: 'Gallery',
      update: 'Update Gallery View',
      view: 'Gallery View',
      field: 'Gallery Field',
      groupBy: 'Group by attachment type field',
      noAttachmentField: 'No attachment type field found.'
    },
    calendar: {
      calendar: 'Calendar',
      update: 'Update Calendar View',
      view: 'Calendar View',
      field: 'Calendar Field',
      groupBy: 'Group by date field',
      noDateField: 'No date field found.',
      select: 'Select a select type field to group calendar lanes',
      selectField: 'Select calendar field',
      scope: {
        selectedDate: 'In selected date',
        withoutDate: 'Without date',
        thisMonth: 'In this month',
        allRecords: 'All records',
        thisWeek: 'In this week',
      }
    },
    pivot: {
      pivot: 'Pivot',
      update: 'Update Pivot View',
      view: 'Pivot View',
      columnLabel: 'Column Label',
      rowLabel: 'Row Label',
      swap: 'Swap with Column Label',
      aggregate: 'Aggregate',
      aggregateFn: {
        sum: 'Sum',
        count: 'Count',
        average: 'Average',
        max: 'Max',
        min: 'Min'
      },
      value: 'Value',
      selectField: 'Select a field to pivot...'
    },
    create: 'Create View',
    created: 'View created successfully',
    type: 'View Type',
    updated: 'View updated',
    updateName: 'Update View Name',
    duplicateView: 'Duplicate View',
    deleteView: 'Delete View',
    downloadView: 'Download View',
    downloadAsExcel: 'Download as Excel',
    downloadAsCSV: 'Download as CSV',
    downloadAsJSON: 'Download as JSON',
    setAsDefaultView: 'Set as Default View'
  }

  const aggregate = {
    searchType: 'Search aggregate type...',
    selectField: 'Select A Field to Aggregate...'
  }

  const dashboard = {
    dashboards: 'Dashboards',
    create: 'Create Dashboard',
    nameDescription: 'Dashboard\'s public display name.',
    updateName: 'Update Dashboard Name',
    duplicateDashboard: 'Duplicate Dashboard',
    deleteDashboard: 'Delete Dashboard',
    confirmDeleteDashboard: 'Confirm to delete dashboard?',
    confirmDeleteDashboardDescription: 'This action cannot be undone. This will permanently delete your dashboard and remove your data from our servers.',
    duplicateDashboardDescription: 'Confirm to duplicate dashboard?',
    duplicateDashboardConfirm: 'Duplicate Dashboard',
    updateDashboard: 'Update Dashboard',
  }

  const base = {
    name: 'Base Name',
    createBase: 'Create New Base',
    created: 'Base created successfully',
    importFromTemplate: 'Import From Template',
    displayName: 'Base Display Name',
    noBases: 'No Bases',
    baseSettings: 'Base Settings',
    updateBase: 'Update Base',
    updateBaseName: 'Update Base Name',
    deleteBase: 'Delete Base',
    deleteBaseConfirm: 'Are you sure you want to delete the following base?',
    duplicateBase: 'Duplicate Base {name}',
    nameDescription: 'Base\'s display name.',
    includeData: 'Include Data',
    includeDataDescription: 'Include data in the new base.',
    duplicateBaseDescription: 'Create a new base include all tables in base.',
    systemFieldsUpdated: 'System fields will be updated to the current user and timestamp.'
  }

  const space = {
    space: 'Space',
    spaces: 'Spaces',
    name: "Space Name",
    setDisplayName: 'Set Display Name',
    searchMembers: 'Search members...',
    cannotInviteMemberToPersonalSpace: 'You cannot invite member to a personal space.',
    createSpace: 'Create Space',
    personalSpace: '{username}\'s Personal Space',
    createSpaceDescription: 'Create new space to organize your data and collaborate with your team.',
    spaceName: 'Space Name',
    spaceNameDescription: 'Space\'s display name.',
    cannotDeletePersonalSpace: 'You can not delete your personal space.',
    deleteSpace: 'Delete Space',
    deleteSpaceConfirm: 'Are you sure you want to delete the following space?',
    deleteSpaceDescription: 'This action cannot be undone. This will permanently delete your database state and remove your data from our servers.',
    memberList: 'A list of your workspace members.',
    inviteMember: 'Invite Member',
    invitations: 'Invitations',
    invite: 'Invite',
    pendingInvitations: 'A list of pending invitations.',
    invitedAt: 'Invited At',
    deleteInvitation: 'Delete Invitation'
  }

  const schema = {
    label: 'Schema',
    systemFields: 'System Fields',
    required: 'Required',
    display: 'Display',
    fieldName: 'Field Name',
    addField: 'Add Field'
  }

  const account = {
    logout: 'Log Out',
    accountSettings: 'Account Settings',
    apiToken: 'Api Token',
    undbTemplates: 'Undb Templates',
    undbWebsite: 'Undb Website',
  }

  const setting = {
    setting: 'Settings',
    members: 'Members',
    settingAndMembers: 'Settings & Members',
  }

  const roles = {
    owner: 'Owner',
    admin: 'Admin',
    member: 'Member',
    viewer: 'Viewer'
  }

  const authz = {
    noRecordLevelSecurity: '{table} have no record level security',
    noRecordLevelSecurityDescription: 'Click button to create your first record level security policy',
    create: 'Create Record Level Security',
    created: 'Record level security created',
    failed: 'Failed to create record level security',
    rlsName: 'Record Level Security Name',
    giveYourRLSName: 'Give your record level security a name',
    actions: {
      read: 'Read',
      create: 'Create',
      update: 'Update',
      delete: 'Delete'
    },
    subjectName: 'Subject',
    subject: {
      any: 'Any user',
      user: 'Specific user',
      group: 'Specific user group'
    },
    action: "Action",
    allow: 'Allow',
    deny: 'Deny',
    matchesConditions: 'Matches conditions...',
    updateCondition: 'Update condition',
    notAllow: 'Not allow to',
    policy: {
      update: 'Update policy',
      delete: 'Delete policy'
    },
    updateRLS: 'Update Record Level Security'
  }

  const events = {
    record: {
      created: 'Record Created',
      updated: 'Record Updated',
      deleted: 'Record Deleted'
    }
  }

  const template = {
    template: 'Template',
    useThisTemplate: 'Use this template',
    previewTemplate: 'Preview Template',
    getStarted: 'Get Started with this template',
    whichSpace: "Which space do you want to create this template in?",
   whichSpaceDescription: "You can create a new base or a new table in the selected space.",
    createBase: 'Create New Base',
    selectATemplateToCreateABase: 'Select a template to create a new base',
    includeDataDescription: 'Include data from the template to the new base or table.',
    loginToCreateNewBaseOrTable: 'Login to create a new base or table'
  }

  const auth = {
    login: 'Login',
    loginFailed: 'Login failed',
    gotoSpace: 'Go to space',
    forgotPassword: 'Forgot your password?',
    emailPlaceholder: 'Enter your email to login',
    password: 'Password',
    register: 'Register',
    noAccount: 'Don\'t have an account?',
    registerDisabled: 'Registration is disabled.',
    registerDisabledDescription: 'Contact your administrator to request access.',
    loginWith: 'Login with {provider}',
    invalidEmailOrPassword: 'Invalid email or password.',
    loginToYourAccountAndAcceptTheInvitation: 'Login to your account and accept the invitation',
    loginWithEmailDescription: 'Enter your email and password to login.',
    enterYourEmailBelowToResetYourPassword: 'Enter your email below to reset your password.',
    emailSent: 'Email sent!',
    youCanCheckYourEmailAddressAndFollowTheStepsToResetYourPassword: 'You can check your email address and follow the steps to reset your password.',
    registerFailed: 'Register failed',
    passwordDoesNotMatch: 'Password does not match',
    enterYourDisplayUsername: 'Enter your display username',
    username: 'Username',
    invited: 'Invited',
    confirmPassword: 'Confirm password',
    createAnAccount: 'Create an account',
    alreadyHaveAnAccount: 'Already have an account?',
    signIn: 'Sign in',
    createAccountAndAcceptInvitation: 'Create account and accept invitation',
    enterYourInformationToCreateAnAccount: 'Enter your information to create an account.',
    enterYourWorkEmail: 'Enter your work email...',
    sendOtpCode: 'Send Code',
    verifyOtp: 'Verify Code'
  }

  const playground = {
    playgroundMode: 'Playground Mode',
    playgroundModeDescription: 'You are in playground mode, all changes will be lost after you close or refresh the page.'
  }

const en = {
  playground,
  auth,
  template,
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
    import: {
      importFile: 'Import File...',
      firstRowAsHeader: 'First row as header',
      importData: 'Import Data',
      fieldsSelected: '{count} fields selected',
      configField: 'Config Field',
      nextStep: 'Next step',
    },
  },
  common: {
    back: 'Back',
    error: 'Error',
    duplicate: 'Duplicate',
    description: 'Description',
    cancel: 'Cancel',
    create: 'Create',
    select: 'Select',
    event: 'Event',
    creating: 'Creating',
    search: 'Search',
    confirm: 'Confirm',
    update: 'Update',
    continue: 'Continue',
    submit: 'Submit',
    delete: 'Delete',
    settings: 'Settings',
    save: 'Save',
    language: 'Language',
    data: 'Data',
    auth: 'Auth',
    developer: 'Developer',
    name: 'Name',
    dangerZone: 'Danger Zone',
    remove: 'Remove',
    accountAndSpaceSettings: 'Account and Space Settings',
    email: 'Email',
    role: 'Role',
    action: 'Action',
    status: 'Status',
    required: 'Required',
    enabled: 'Enabled',
    enableCondition: 'Enable Condition',
    type: 'Type',
    loadMore: 'Load more',
      today: 'Today',
      clear: 'Clear',
      updated: 'Updated',
      now: 'Now',
      import: 'Import'
  },
  share: {
    title: 'Share',
    shareUrl: 'Share URL',
    iframeUrl: 'IFrame URL',
    shareId: 'Share ID',
    enable: 'Enable sharing',
    copied: 'Copied to clipboard',
    button: 'Share'
  },
  widget: {
    title: 'Widget',
    button: "Widgets",
    name: 'Name',
    add: 'Add Widget',
    type: 'Type',
    editName: 'Edit Name',
    duplicate: 'Duplicate Widget {name}',
    delete: 'Delete Widget {name}',
    deleteConfirm: {
      title: 'Delete Widget {name}?',
      description: 'This action cannot be undone. This will permanently delete this widget. and remove your data from our servers.'
    },
    count: 'Count',
    aggregate: 'Aggregate',
    filters: 'Filters',
  },
  dashboard

} satisfies BaseTranslation

export default en

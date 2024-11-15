import type { ISpaceMemberRole } from "@undb/authz"
import type { FieldType,IFieldAggregate,IFieldMacro,IOpType,IRollupFn,ViewType } from "@undb/table"
import type { BaseTranslation } from "../i18n-types.js"

const ops: Record<IOpType, string> = {
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

const fieldTypes: Record<FieldType, string> = {
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

const rollupFns: Record<IRollupFn, string> = {
  min: "Min",
  max: "Max",
  sum: "Sum",
  average: "Average",
  count: "Count",
  lookup: "Lookup"
}

const aggregateFns: Record<IFieldAggregate, string> = {
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

const workspaceRoles: Record<ISpaceMemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer"
}

const macros: Record<IFieldMacro, string> = {
  "@me": "Current User",
  "@now": "Now",
  "@today": "Today",
  "@yesterday": "Yesterday",
  "@tomorrow": "Tomorrow",
}

const viewTypes: Record<ViewType, string> = {
  grid: "Grid",
  kanban: "Kanban",
  gallery: "Gallery",
  list: "List",
  calendar: "Calendar",
  pivot: "Pivot"
}

const widgetTypes: Record<string, string> = {
  aggregate: "Aggregate",
  chart: "Chart",
  table: "Table"
}

const en = {
  table: {
    ops,
    fieldTypes,
    rollupFns,
    aggregateFns,
    workspaceRoles,
    macros,
    viewTypes,
    widgetTypes,
  },
} satisfies BaseTranslation

export default en

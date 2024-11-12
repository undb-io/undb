import type { ISpaceMemberRole } from "@undb/authz"
import type { FieldType,IFieldAggregate,IFieldMacro,IOpType,IRollupFn,ViewType } from "@undb/table"
import type { BaseTranslation } from "../i18n-types.js"

const ops: Record<IOpType, string> = {
  eq: "=",
  neq: "!=",
  contains: "contains",
  does_not_contain: "not contains",
  starts_with: "starts with",
  ends_with: "ends with",
  is_empty: "is empty",
  is_not_empty: "is not empty",
  min: "min",
  max: "max",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  in: 'in',
  nin: 'not in',
  any_of: 'any of',
  not_any_of: 'not any of',
  is_same_day: "is same day",
  is_not_same_day: "is not same day",
  is_tody: "is today",
  is_not_today: "is not today",
  is_after_today: "is after today",
  is_before_today: "is before today",
  is_tomorrow: "is tomorrow",
  is_not_tomorrow: "is not tomorrow",
  is_after_tomorrow: "is after tomorrow",
  is_before_tommorow: "is before tomorrow",
  is_yesterday: "is yesterday",
  is_not_yesterday: "is not yesterday",
  is_after_yesterday: "is after yesterday",
  is_before_yesterday: "is before yesterday",
  is_before: "is before",
  is_not_before: "is not before",
  is_after: "is after",
  is_not_after: "is not after",
  is_true: "is true",
  is_false: "is false",
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

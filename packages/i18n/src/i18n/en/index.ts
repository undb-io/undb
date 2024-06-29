import type { IOpType } from "@undb/table"
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

const en = {
  // TODO: your translations go here
  HI: "Hi {name:string}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n",
  table: {
    ops,
  },
} satisfies BaseTranslation

export default en

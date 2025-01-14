import type { DateRangeField, FieldType, IRollupFn } from "@undb/table"
import type { ColumnDataType } from "kysely"
import { match } from "ts-pattern"
import type { IDatabaseFnUtil } from "../utils/fn.util"

export function getRollupFn(fn: IRollupFn, dbFnUtil: IDatabaseFnUtil): string {
  return match(fn)
    .with("lookup", () => dbFnUtil.jsonGroupArray)
    .with("average", () => "avg")
    .with("sum", () => "sum")
    .with("count", () => "count")
    .with("max", () => "max")
    .with("min", () => "min")
    .exhaustive()
}

export const getDateRangeFieldName = (field: DateRangeField) => {
  return {
    start: `${field.id.value}_start`,
    end: `${field.id.value}_end`,
  } as const
}

export function getUnderlyingColumnType(type: FieldType): ColumnDataType {
  return match(type)
    .returnType<ColumnDataType>()
    .with("string", () => "text")
    .with("number", () => "real")
    .with("checkbox", "currency", () => "integer")
    .otherwise(() => "text")
}

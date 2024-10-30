import type { ReturnType } from "@undb/formula"
import type { ColumnDataType } from "kysely"
import { match } from "ts-pattern"

export const getUnderlyingFormulaType = (returnType: ReturnType): ColumnDataType => {
  return match(returnType)
    .returnType<ColumnDataType>()
    .with("number", () => "real")
    .with("boolean", () => "integer")
    .with("date", () => "timestamp")
    .otherwise(() => "text")
}

import { None, Option, Some, orOptions } from "@undb/domain"
import { match } from "ts-pattern"
import type { TableDo } from "../../../table.do"
import { StringContains } from "../../schema"
import type { RecordComositeSpecification } from "../record"

export const withQ = (table: TableDo, q: string) => {
  const fields = table.schema.searchableFields

  const specs = fields.map((field) => {
    return match(field)
      .with({ type: "string" }, () => Some(new StringContains(q, field.id)))
      .otherwise(() => None)
  })

  return orOptions(...specs) as Option<RecordComositeSpecification>
}

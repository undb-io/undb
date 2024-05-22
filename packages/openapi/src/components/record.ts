import type { TableDo } from "@undb/table"
import { z } from "@undb/zod"
import { objectify } from "radash"

export const RECORD_COMPONENT = "Record"

export const createRecordComponent = (table: TableDo) => {
  const fields = table.schema.fields

  const schema = objectify(
    fields,
    (f) => f.name.value,
    (f) => f.valueSchema,
  )

  return z.object(schema).openapi(RECORD_COMPONENT)
}

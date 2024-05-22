import type { RouteConfig } from "@asteasolutions/zod-to-openapi"
import { RecordDO, type TableDo } from "@undb/table"
import { z, type ZodTypeAny } from "@undb/zod"
import { objectify } from "radash"

export const RECORD_COMPONENT = "Record"

export const createRecordComponent = (table: TableDo, record?: RecordDO) => {
  const fields = table.schema.fields

  const schema = objectify(
    fields,
    (f) => f.name.value,
    (f) => f.valueSchema,
  )

  const example = objectify(
    fields,
    (f) => f.name.value,
    (f) => record?.getValue(f.id).into(undefined)?.value,
  )

  return z.object(schema).openapi(RECORD_COMPONENT, { example: { example } })
}

export const getRecords = (table: TableDo, recordSchema: ZodTypeAny): RouteConfig => {
  return {
    method: "get",
    path: `/tables/${table.id.value}/records`,
    description: `Get ${table.name.value} records`,
    summary: "Get records",
    responses: {
      200: {
        description: "record data",
        content: {
          "application/json": {
            schema: recordSchema,
          },
        },
      },
      204: {
        description: "No content - successful operation",
      },
    },
  }
}

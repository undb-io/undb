import type { RouteConfig } from "@asteasolutions/zod-to-openapi"
import { RecordDO, recordId, type TableDo } from "@undb/table"
import { z, type ZodTypeAny } from "@undb/zod"
import { objectify } from "radash"

export const RECORD_COMPONENT = "Record"

export const createRecordComponent = (table: TableDo, record?: RecordDO) => {
  const schema = table.schema.readableSchema

  const example = record
    ? objectify(
        table.schema.fields,
        (f) => f.name.value,
        (f) => record?.getValue(f.id).into(undefined)?.value,
      )
    : undefined
  return schema.openapi(RECORD_COMPONENT, { example })
}

export const getRecords = (table: TableDo, recordSchema: ZodTypeAny): RouteConfig => {
  return {
    method: "get",
    path: `/tables/${table.id.value}/records`,
    description: `Get ${table.name.value} records`,
    summary: `Get ${table.name.value} records`,
    tags: [RECORD_COMPONENT],
    responses: {
      200: {
        description: "record data",
        content: {
          "application/json": {
            schema: z.object({
              total: z.number().int().positive(),
              records: z.array(recordSchema),
            }),
          },
        },
      },
    },
  }
}

export const getRecordById = (table: TableDo, recordSchema: ZodTypeAny): RouteConfig => {
  return {
    method: "get",
    path: `/tables/${table.id.value}/records/{recordId}`,
    description: `Get ${table.name.value} record by id`,
    summary: `Get ${table.name.value} record by id`,
    tags: [RECORD_COMPONENT],
    request: {
      params: z.object({
        recordId: recordId,
      }),
    },
    responses: {
      200: {
        description: "record data",
        content: {
          "application/json": {
            schema: z.object({
              data: recordSchema.nullable(),
            }),
          },
        },
      },
    },
  }
}

import type { RouteConfig } from "@asteasolutions/zod-to-openapi"
import { RecordDO, type TableDo } from "@undb/table"
import { z, type ZodTypeAny } from "@undb/zod"

export const RECORD_COMPONENT = "Record"

export const createRecordComponent = (table: TableDo, record?: RecordDO) => {
  const schema = table.schema.readableSchema
  return schema.openapi(RECORD_COMPONENT)
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

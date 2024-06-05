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

export const createRecord = (table: TableDo): RouteConfig => {
  return {
    method: "post",
    path: `/tables/${table.id.value}/records`,
    description: `Create ${table.name.value} record`,
    summary: `Create ${table.name.value} record`,
    tags: [RECORD_COMPONENT],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              values: table.schema.mutableSchema,
            }),
          },
        },
        required: true,
      },
    },
    responses: {
      201: {
        description: "Record Created",
      },
    },
  }
}

export const duplicateRecordById = (table: TableDo): RouteConfig => {
  return {
    method: "post",
    path: `/tables/${table.id.value}/records/{recordId}/duplicate`,
    description: `Duplicate ${table.name.value} record by id`,
    summary: `Duplicate ${table.name.value} record by id`,
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
              recordId: recordId,
            }),
          },
        },
      },
    },
  }
}

export const deleteRecordById = (table: TableDo): RouteConfig => {
  return {
    method: "delete",
    path: `/tables/${table.id.value}/records/{recordId}`,
    description: `delete ${table.name.value} record by id`,
    summary: `delete ${table.name.value} record by id`,
    tags: [RECORD_COMPONENT],
    request: {
      params: z.object({
        recordId: recordId,
      }),
    },
    responses: {
      200: {
        description: "record data",
      },
    },
  }
}

export const recordSubscription = (table: TableDo): RouteConfig => {
  return {
    method: "get",
    path: `/tables/${table.id.value}/subscription`,
    description: `Subscribe ${table.name.value} record events`,
    summary: `Subscribe ${table.name.value} record events`,
    tags: [RECORD_COMPONENT, "Subscription"],
    responses: {
      200: {
        description: "subscription event schema",
        content: {
          "text/event-stream": {
            schema: z.object({
              // TODO: get event type
              event: z.any(),
            }),
          },
        },
      },
    },
  }
}

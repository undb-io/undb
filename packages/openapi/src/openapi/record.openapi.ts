import type { RouteConfig } from "@asteasolutions/zod-to-openapi"
import { RecordDO, recordId, type TableDo } from "@undb/table"
import { z, type ZodTypeAny } from "@undb/zod"
import { objectify } from "radash"

export const RECORD_COMPONENT = "Record"
export const RECORD_VALUES_COMPONENT = "RecordValues"
export const RECORD_DISPLAY_VALUES_COMPONENT = "RecordDisplayValues"

export const createRecordComponent = (table: TableDo, record?: RecordDO) => {
  const fields = table.schema.fields
  const displayFields = table.schema.getFieldsHasDisplayValue()
  const schema = table.schema.readableSchema
  const displayScheam = table.schema.displayValuesSchema

  const example = record
    ? objectify(
        fields,
        (f) => f.name.value,
        (f) => record?.getValue(f.id).into(undefined)?.value,
      )
    : undefined

  const displayExample = record
    ? objectify(
        displayFields,
        (f) => f.name.value,
        (f) => record.getDisplayValueByField(f.id)?.into(undefined),
      )
    : undefined
  return z
    .object({
      values: schema.openapi(RECORD_VALUES_COMPONENT, { example }),
      displayValues: displayScheam.openapi(RECORD_DISPLAY_VALUES_COMPONENT, { example: displayExample }),
    })
    .openapi(RECORD_COMPONENT)
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
              values: table.schema.getMutableSchema(table.schema.mutableFields, false),
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

export const updateRecord = (table: TableDo): RouteConfig => {
  return {
    method: "patch",
    path: `/tables/${table.id.value}/records/{recordId}`,
    description: `Update ${table.name.value} record`,
    summary: `Update ${table.name.value} record`,
    tags: [RECORD_COMPONENT],
    request: {
      params: z.object({
        recordId: recordId,
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              values: table.schema.getMutableSchema(table.schema.mutableFields, false).partial(),
            }),
          },
        },
        required: true,
      },
    },
    responses: {
      201: {
        description: "Record Updated",
      },
    },
  }
}

export const bulkUpdateRecords = (table: TableDo): RouteConfig => {
  return {
    method: "patch",
    path: `/tables/${table.id.value}/records`,
    description: `bulk update ${table.name.value} records`,
    summary: `bulk update ${table.name.value} records`,
    tags: [RECORD_COMPONENT],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              filter: z.object({}),
              values: table.schema.getMutableSchema(table.schema.mutableFields, false).partial(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "records updated",
        content: {
          "application/json": {
            schema: z
              .object({
                modifiedCount: z.number().nonnegative().int(),
              })
              .openapi("BulkUpdateRecordsOutput", { description: "records count that has been updated" }),
          },
        },
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

export const bulkDeleteRecords = (table: TableDo): RouteConfig => {
  return {
    method: "delete",
    path: `/tables/${table.id.value}/records`,
    description: `bulk delete ${table.name.value} records`,
    summary: `bulk delete ${table.name.value} records`,
    tags: [RECORD_COMPONENT],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              filter: z.object({}),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "record data",
        content: {
          "application/json": {
            schema: z.object({
              deletedCount: z.number().int().nonnegative(),
            }),
          },
        },
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

export const bulkDuplicateRecords = (table: TableDo): RouteConfig => {
  return {
    method: "post",
    path: `/tables/${table.id.value}/records/duplicate`,
    description: `bulk duplicate ${table.name.value} records`,
    summary: `bulk duplicate ${table.name.value} records`,
    tags: [RECORD_COMPONENT],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              filter: z.object({}),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "records updated",
        content: {
          "application/json": {
            schema: z
              .object({
                count: z.number().nonnegative().int(),
              })
              .openapi("BulkDuplicateRecordsOutput", { description: "records count that has been updated" }),
          },
        },
      },
    },
  }
}

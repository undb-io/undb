import type { RouteConfig } from "@asteasolutions/zod-to-openapi"
import type { Base } from "@undb/base"
import { recordId, type IReadableRecordDTO, type TableDo, type View } from "@undb/table"
import { z, type ZodTypeAny } from "@undb/zod"

export const RECORD_ID_COMPONENT = "RecordId"
export const RECORD_COMPONENT = "Record"
export const VIEW_NAME_COMPONENT = "ViewName"
export const RECORD_VALUES_COMPONENT = "RecordValues"
export const RECORD_DISPLAY_VALUES_COMPONENT = "RecordDisplayValues"

export const createRecordComponent = (table: TableDo, record?: IReadableRecordDTO) => {
  const schema = table.schema.readableSchema
  const displayScheam = table.schema.displayValuesSchema

  const example = record?.values
  const displayExample = record?.displayValues

  return z
    .object({
      id: recordId.openapi(RECORD_ID_COMPONENT, { example: record?.id }),
      values: schema.openapi(RECORD_VALUES_COMPONENT, { example }),
      displayValues: displayScheam.openapi(RECORD_DISPLAY_VALUES_COMPONENT, { example: displayExample }),
    })
    .openapi(RECORD_COMPONENT)
}

export const getRecords = (base: Base, table: TableDo, recordSchema: ZodTypeAny): RouteConfig => {
  return {
    method: "get",
    path: `/bases/${base.name.value}/tables/${table.name.value}/records`,
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

export const getViewRecords = (base: Base, table: TableDo, view: View, recordSchema: ZodTypeAny): RouteConfig => {
  return {
    method: "get",
    path: `/bases/${base.name.value}/tables/${table.name.value}/views/${view.name.value}/records`,
    description: `Get ${table.name.value} records in ${view.name.value} view`,
    summary: `Get ${table.name.value} records in ${view.name.value} view`,
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

export const getRecordById = (base: Base, table: TableDo, recordSchema: ZodTypeAny): RouteConfig => {
  return {
    method: "get",
    path: `/bases/${base.name.value}/tables/${table.name.value}/records/{recordId}`,
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

export const getViewRecordById = (base: Base, table: TableDo, view: View, recordSchema: ZodTypeAny): RouteConfig => {
  return {
    method: "get",
    path: `/bases/${base.name.value}/tables/${table.name.value}/views/${view.name.value}/records/{recordId}`,
    description: `Get ${table.name.value} record by id in ${view.name.value} view`,
    summary: `Get ${table.name.value} record by id in ${view.name.value} view`,
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

export const createRecord = (base: Base, table: TableDo): RouteConfig => {
  return {
    method: "post",
    path: `/bases/${base.name.value}/tables/${table.name.value}/records`,
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

export const createRecords = (base: Base, table: TableDo): RouteConfig => {
  return {
    method: "post",
    path: `/bases/${base.name.value}/tables/${table.name.value}/records/bulk`,
    description: `Bulk create ${table.name.value} record`,
    summary: `Bulk create ${table.name.value} record`,
    tags: [RECORD_COMPONENT],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              records: z
                .object({
                  id: recordId.optional(),
                  values: table.schema.getMutableSchema(table.schema.mutableFields, false),
                })
                .array(),
            }),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        description: "Record Created",
        content: {
          "application/json": {
            schema: z.object({
              createdCount: z.number().int().nonnegative(),
            }),
          },
        },
      },
    },
  }
}

export const updateRecord = (base: Base, table: TableDo): RouteConfig => {
  return {
    method: "patch",
    path: `/bases/${base.name.value}/tables/${table.name.value}/records/{recordId}`,
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

export const bulkUpdateRecords = (base: Base, table: TableDo): RouteConfig => {
  return {
    method: "patch",
    path: `/bases/${base.name.value}/tables/${table.name.value}/records`,
    description: `Bulk update ${table.name.value} records`,
    summary: `Bulk update ${table.name.value} records`,
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

export const duplicateRecordById = (base: Base, table: TableDo): RouteConfig => {
  return {
    method: "post",
    path: `/bases/${base.name.value}/tables/${table.name.value}/records/{recordId}/duplicate`,
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

export const deleteRecordById = (base: Base, table: TableDo): RouteConfig => {
  return {
    method: "delete",
    path: `/bases/${base.name.value}/tables/${table.name.value}/records/{recordId}`,
    description: `Delete ${table.name.value} record by id`,
    summary: `Delete ${table.name.value} record by id`,
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

export const bulkDeleteRecords = (base: Base, table: TableDo): RouteConfig => {
  return {
    method: "delete",
    path: `/bases/${base.name.value}/tables/${table.name.value}/records`,
    description: `Bulk delete ${table.name.value} records`,
    summary: `Bulk delete ${table.name.value} records`,
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

export const recordSubscription = (base: Base, table: TableDo): RouteConfig => {
  return {
    method: "get",
    path: `/bases/${base.name.value}/tables/${table.name.value}/subscription`,
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

export const bulkDuplicateRecords = (base: Base, table: TableDo): RouteConfig => {
  return {
    method: "post",
    path: `/bases/${base.name.value}/tables/${table.name.value}/records/duplicate`,
    description: `Bulk duplicate ${table.name.value} records`,
    summary: `Bulk duplicate ${table.name.value} records`,
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

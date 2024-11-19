import type { RouteConfig } from "@asteasolutions/zod-to-openapi"
import type { Base } from "@undb/base"
import {
  ButtonField,
  FormVO,
  getPivotDataOutput,
  PivotView,
  recordId,
  type IReadableRecordDTO,
  type TableDo,
  type View,
} from "@undb/table"
import { z, type ZodTypeAny } from "@undb/zod"

export const RECORD_ID_COMPONENT = "RecordId"
export const RECORD_COMPONENT = "Record"
export const AGGREGATE_RECORD_COMPONENT = "Aggregate"
export const BUTTON_COMPONENT = "Button"
export const FORM_COMPONENT = "Form"
export const VIEW_COMPONENT = "View"
export const PIVOT_COMPONENT = "Pivot"
export const VIEW_RECORD_COMPONENT = "ViewRecord"
export const VIEW_PIVOT_COMPONENT = "ViewPivotData"
export const FORM_SUBMIT_RECORD_COMPONENT = "FormSubmitRecord"
export const RECORD_VALUES_COMPONENT = "RecordValues"
export const VIEW_RECORD_VALUES_COMPONENT = "ViewRecordValues"
export const RECORD_DISPLAY_VALUES_COMPONENT = "RecordDisplayValues"
export const VIEW_RECORD_DISPLAY_VALUES_COMPONENT = "ViewRecordDisplayValues"

export const createRecordComponent = (table: TableDo, view?: View, record?: IReadableRecordDTO) => {
  const schema = view ? table.schema.getViewReadableSchema(table, view) : table.schema.readableSchema
  const displayScheam = view ? table.schema.getViewDisplayValuesSchema(table, view) : table.schema.displayValuesSchema

  const example = record?.values
  const displayExample = record?.displayValues

  return z
    .object({
      id: recordId.openapi(RECORD_ID_COMPONENT, { example: record?.id }),
      values: schema.openapi(view ? view.name.value + ":" + VIEW_RECORD_VALUES_COMPONENT : RECORD_VALUES_COMPONENT, {
        example,
      }),
      displayValues: displayScheam.openapi(
        view ? view.name.value + ":" + VIEW_RECORD_DISPLAY_VALUES_COMPONENT : RECORD_DISPLAY_VALUES_COMPONENT,
        { example: displayExample },
      ),
    })
    .openapi(view ? VIEW_RECORD_COMPONENT : RECORD_COMPONENT, {
      description: view ? `record in ${view.name.value} view` : "record",
    })
}

export const createPivotViewDateComponent = (table: TableDo, view: PivotView) => {
  return getPivotDataOutput.openapi(view.name.value + ":" + VIEW_PIVOT_COMPONENT, {
    description: `pivot view data in ${view.name.value} view`,
  })
}

export const getPivotData = (base: Base, table: TableDo, view: PivotView): RouteConfig => {
  return {
    method: "get",
    path: `/bases/${base.name.value}/tables/${table.name.value}/views/${view.name.value}/data`,
    description: `Get pivot view data in ${view.name.value} view`,
    summary: `Get pivot view data in ${view.name.value} view`,
    tags: [PIVOT_COMPONENT, VIEW_COMPONENT],
    responses: {
      200: {
        description: "pivot view data",
        content: {
          "application/json": {
            schema: getPivotDataOutput,
          },
        },
      },
    },
  }
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
    tags: [RECORD_COMPONENT, VIEW_COMPONENT],
    responses: {
      200: {
        description: "record data",
        content: {
          "application/json": {
            schema: z.object({
              total: z.number().int().positive(),
              records: z.array(recordSchema.openapi(view.name.value + ":" + VIEW_RECORD_COMPONENT)),
            }),
          },
        },
      },
    },
  }
}

export const getAggregateRecords = (base: Base, table: TableDo, view: View): RouteConfig => {
  return {
    method: "get",
    path: `/bases/${base.name.value}/tables/${table.name.value}/views/${view.name.value}/records/aggregate`,
    description: `Get ${table.name.value} records aggregate in ${view.name.value} view`,
    summary: `Get ${table.name.value} records aggregate in ${view.name.value} view`,
    tags: [RECORD_COMPONENT, AGGREGATE_RECORD_COMPONENT, VIEW_COMPONENT],
    responses: {
      200: {
        description: "record aggregate data",
        content: {
          "application/json": {
            schema: z.object({
              // TODO: add field properties
              data: z.record(z.string(), z.number()),
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
    tags: [RECORD_COMPONENT, VIEW_COMPONENT],
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
              data: recordSchema.openapi(view.name.value + ":" + VIEW_RECORD_COMPONENT).nullable(),
            }),
          },
        },
      },
    },
  }
}

export const triggerButton = (base: Base, table: TableDo, field: ButtonField): RouteConfig => {
  return {
    method: "post",
    path: `/bases/${base.name.value}/tables/${table.name.value}/records/{recordId}/trigger/${field.name.value}`,
    description: `Trigger ${table.name.value} ${field.name.value} button`,
    summary: `Trigger ${table.name.value} ${field.name.value} button`,
    tags: [RECORD_COMPONENT, BUTTON_COMPONENT],
    request: {
      params: z.object({
        recordId: recordId,
      }),
    },
    responses: {
      200: {
        description: "button triggered",
        content: {
          "application/json": {
            schema: z.object({
              mutated: z.boolean().openapi("TriggerButtonOutput", {
                description: "true if the button is triggered and record is updated",
              }),
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

export const submitFormCreateRecordComponent = (table: TableDo, form: FormVO, record?: IReadableRecordDTO) => {
  return z
    .object({
      id: recordId.optional().openapi(RECORD_ID_COMPONENT, { example: record?.id }),
      values: table.schema.getMutableSchemaFromForm(form, table.schema.mutableFields, false),
    })
    .openapi(form.name + ":" + FORM_SUBMIT_RECORD_COMPONENT, {
      description: `submit record in ${form.name} form`,
    })
}

export const submitForm = (base: Base, table: TableDo, form: FormVO): RouteConfig => {
  return {
    method: "post",
    path: `/bases/${base.name.value}/tables/${table.name.value}/forms/${form.name}/submit`,
    description: `Submit ${table.name.value} form ${form.name}`,
    summary: `Submit ${table.name.value} form ${form.name}`,
    tags: [RECORD_COMPONENT, FORM_COMPONENT],
    request: {
      body: {
        content: {
          "application/json": {
            schema: submitFormCreateRecordComponent(table, form),
          },
        },
      },
    },
    responses: {
      201: {
        description: "Form submitted",
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

import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
  type RouteConfig,
} from "@asteasolutions/zod-to-openapi"
import { z } from "@undb/zod"

extendZodWithOpenApi(z)

import type { Base } from "@undb/base"
import { type IReadableRecordDTO, type TableDo, type View } from "@undb/table"
import {
  RECORD_COMPONENT,
  VIEW_RECORD_COMPONENT,
  bulkDeleteRecords,
  bulkDuplicateRecords,
  bulkUpdateRecords,
  createRecord,
  createRecordComponent,
  createRecords,
  deleteRecordById,
  duplicateRecordById,
  getRecordById,
  getRecords,
  getViewRecordById,
  getViewRecords,
  recordSubscription,
  updateRecord,
} from "./openapi/record.openapi"

export const API_TOKEN_HEADER_NAME = "x-undb-api-token"

export interface ViewsOpenApi {
  view: View
  record?: IReadableRecordDTO
}

export const createOpenApiSpec = (
  base: Base,
  table: TableDo,
  record: IReadableRecordDTO | undefined,
  views: ViewsOpenApi[],
) => {
  const registry = new OpenAPIRegistry()

  const recordSchema = createRecordComponent(table, undefined, record)
  registry.register(RECORD_COMPONENT, recordSchema.openapi({ description: table.name.value + " record schema" }))

  const routes: RouteConfig[] = [
    getRecords(base, table, recordSchema),
    getRecordById(base, table, recordSchema),
    createRecord(base, table),
    createRecords(base, table),
    updateRecord(base, table),
    bulkUpdateRecords(base, table),
    duplicateRecordById(base, table),
    bulkDuplicateRecords(base, table),
    deleteRecordById(base, table),
    bulkDeleteRecords(base, table),
    recordSubscription(base, table),
  ]

  for (const { view, record } of views) {
    const viewRecordSchema = createRecordComponent(table, view, record)
    registry.register(
      view.name.value + ":" + VIEW_RECORD_COMPONENT,
      viewRecordSchema.openapi({ description: table.name.value + " " + view.name.value + " view record schema" }),
    )

    routes.push(getViewRecords(base, table, view, viewRecordSchema))
    routes.push(getViewRecordById(base, table, view, viewRecordSchema))
  }

  const apiKeyAuth = registry.registerComponent("securitySchemes", "apiKeyAuth", {
    type: "apiKey",
    in: "header",
    name: API_TOKEN_HEADER_NAME,
  })

  for (const route of routes) {
    registry.registerPath(route)
    route.security = [{ [apiKeyAuth.name]: [] }]
  }

  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: table.name.value,
    },
    servers: [{ url: "/api" }],
  })
}

export * from "./api-token"

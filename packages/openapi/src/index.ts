import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
  type RouteConfig,
} from "@asteasolutions/zod-to-openapi"
import { z } from "@undb/zod"

extendZodWithOpenApi(z)

import type { Base } from "@undb/base"
import type { RecordDO, TableDo } from "@undb/table"
import {
  RECORD_COMPONENT,
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
  recordSubscription,
  updateRecord,
} from "./openapi/record.openapi"

export const API_TOKEN_HEADER_NAME = "x-undb-api-token"

export const createOpenApiSpec = (base: Base, table: TableDo, record?: RecordDO) => {
  const registry = new OpenAPIRegistry()

  const recordSchema = createRecordComponent(table, record)
  registry.register(RECORD_COMPONENT, recordSchema)

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

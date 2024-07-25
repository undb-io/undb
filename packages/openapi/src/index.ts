import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
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

export const createOpenApiSpec = (base: Base, table: TableDo, record?: RecordDO) => {
  const registry = new OpenAPIRegistry()

  const recordSchema = createRecordComponent(table, record)
  registry.register(RECORD_COMPONENT, recordSchema)

  registry.registerPath(getRecords(base, table, recordSchema))
  registry.registerPath(getRecordById(base, table, recordSchema))
  registry.registerPath(createRecord(base, table))
  registry.registerPath(createRecords(base, table))
  registry.registerPath(updateRecord(base, table))
  registry.registerPath(bulkUpdateRecords(base, table))
  registry.registerPath(duplicateRecordById(base, table))
  registry.registerPath(bulkDuplicateRecords(base, table))
  registry.registerPath(deleteRecordById(base, table))
  registry.registerPath(bulkDeleteRecords(base, table))
  registry.registerPath(recordSubscription(base, table))

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
